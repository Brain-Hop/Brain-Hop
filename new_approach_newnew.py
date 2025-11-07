from flask import Flask, jsonify, request
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains import create_retrieval_chain
from supabase import create_client
import os, shutil, zipfile, time

# -------------------- SETUP --------------------
load_dotenv()
app = Flask(__name__)

# -------------------- SUPABASE CONFIG --------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# -------------------- OPENROUTER SETUP --------------------
openrouter_key = os.getenv("OPENROUTER_API_KEY")
if not openrouter_key:
    raise ValueError("⚠️ Missing OPENROUTER_API_KEY in .env file!")
os.environ["OPENAI_API_KEY"] = openrouter_key
os.environ["OPENAI_API_BASE"] = "https://openrouter.ai/api/v1"

# -------------------- EMBEDDINGS --------------------
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# -------------------- GLOBAL CONTEXT --------------------
loaded_vectorstores = {}  # {(user_id, chat_id): vectorstore}
chat_history = {}          # {(user_id, chat_id): [{"role": "user"/"assistant", "text": "..."}]}
last_active = {}           # For cleanup management

# -------------------- HELPERS --------------------
def local_dir(user_id, chat_id):
    return f"vector_store_{user_id}_{chat_id}"

def vector_zip_name(user_id, chat_id):
    return f"{user_id}_{chat_id}_chat_memory.zip"

def split_text(text, chunk_size=500, overlap=100):
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=overlap)
    return splitter.split_text(text)

def get_recent_chat_context(user_id, chat_id, n_turns=5):
    key = (user_id, chat_id)
    if key not in chat_history:
        return ""
    msgs = chat_history[key][-n_turns * 2:]
    return "\n".join([f"{m['role'].capitalize()}: {m['text']}" for m in msgs])

# -------------------- LOAD VECTORSTORE --------------------
def load_vectorstore_from_supabase(user_id, chat_id):
    key = (user_id, chat_id)
    if key in loaded_vectorstores:
        last_active[key] = time.time()
        return loaded_vectorstores[key]

    local_path = local_dir(user_id, chat_id)
    zip_path = f"{local_path}.zip"

    try:
        print(f"📥 Downloading {vector_zip_name(user_id, chat_id)} from Supabase...")
        with open(zip_path, "wb") as f:
            res = supabase.storage.from_("chat_vectors").download(vector_zip_name(user_id, chat_id))
            f.write(res)
        with zipfile.ZipFile(zip_path, "r") as z:
            z.extractall(local_path)
        os.remove(zip_path)
        print(f"✅ Loaded existing DB for {user_id}-{chat_id}")
    except Exception as e:
        print(f"⚠️ No previous DB for {user_id}-{chat_id}: {e}")
        os.makedirs(local_path, exist_ok=True)

    vs = Chroma(persist_directory=local_path, embedding_function=embedding_model)
    loaded_vectorstores[key] = vs
    chat_history.setdefault(key, [])
    last_active[key] = time.time()
    return vs

# -------------------- SAVE VECTORSTORE --------------------
def persist_and_upload_vectorstore(user_id, chat_id):
    key = (user_id, chat_id)
    if key not in loaded_vectorstores:
        return {"error": "no vectorstore found"}

    local_path = local_dir(user_id, chat_id)
    zip_path = f"{local_path}.zip"
    vs = loaded_vectorstores[key]
    vs.persist()
    shutil.make_archive(local_path, "zip", local_path)

    with open(zip_path, "rb") as f:
        supabase.storage.from_("chat_vectors").upload(
            vector_zip_name(user_id, chat_id),
            f,
            {"x-upsert": "true"}
        )

    print(f"💾 Uploaded DB for {user_id}-{chat_id}")
    shutil.rmtree(local_path, ignore_errors=True)
    os.remove(zip_path)
    del loaded_vectorstores[key]
    del chat_history[key]
    last_active.pop(key, None)
    return {"status": "uploaded"}

# -------------------- ADD MESSAGE --------------------
def add_message(user_id, chat_id, role, text):
    key = (user_id, chat_id)
    chat_history.setdefault(key, [])
    chat_number = len(chat_history[key]) + 1
    chat_history[key].append({"role": role, "text": text, "chat_number": chat_number, "ts": int(time.time())})

    vs = load_vectorstore_from_supabase(user_id, chat_id)
    chunks = split_text(f"[{chat_number}] {role}: {text}")
    docs = [Document(page_content=c, metadata={"role": role, "chat_number": chat_number}) for c in chunks]
    vs.add_documents(docs)
    last_active[key] = time.time()

# -------------------- RAG PIPELINE --------------------
def build_rag_chain(vectorstore, model_name):
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    llm = ChatOpenAI(model=model_name, temperature=0.3)

    prompt = ChatPromptTemplate.from_template(
        """You are a contextual assistant with conversation memory.

Use the chat history and retrieved memory to answer coherently.

Chat History:
{chat_history}

Retrieved Memory:
{context}

User: {input}
Assistant:"""
    )

    combine_chain = create_stuff_documents_chain(llm, prompt)
    return create_retrieval_chain(retriever, combine_chain)

# -------------------- ROUTES --------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("user_id")
    chat_id = data.get("chat_id")
    model_name = data.get("model_name")
    question = data.get("question")

    if not all([user_id, chat_id, model_name, question]):
        return jsonify({"error": "Missing fields"}), 400

    vs = load_vectorstore_from_supabase(user_id, chat_id)
    add_message(user_id, chat_id, "user", question)

    rag_chain = build_rag_chain(vs, model_name)
    chat_context = get_recent_chat_context(user_id, chat_id, n_turns=5)

    try:
        result = rag_chain.invoke({"input": question, "chat_history": chat_context})
        response = result.get("answer", "").strip()
    except Exception as e:
        print("❌ RAG Error:", e)
        response = "Sorry, something went wrong while processing your request."

    add_message(user_id, chat_id, "assistant", response)
    return jsonify({
        "response": response,
        "history": chat_history[(user_id, chat_id)]
    })

@app.route("/close_chat", methods=["POST"])
def close_chat():
    data = request.get_json()
    user_id = data.get("user_id")
    chat_id = data.get("chat_id")
    if not user_id or not chat_id:
        return jsonify({"error": "Missing user_id/chat_id"}), 400
    return jsonify(persist_and_upload_vectorstore(user_id, chat_id))

# -------------------- RUN --------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
