from flask import Flask, jsonify, request
from dotenv import load_dotenv
from supabase import create_client, Client
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_classic.schema import Document
from langchain_openai import ChatOpenAI

# ✅ NEW LangChain RAG import
from langchain_classic.prompts import ChatPromptTemplate
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains import create_retrieval_chain

import os, io, zipfile, shutil
# ------------------ SETUP ------------------
load_dotenv()
app = Flask(__name__)

# Supabase setup
SUPABASE_URL = "https://jglveatavrfvdczmjaqs.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnbHZlYXRhdnJmdmRjem1qYXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTE3NzUsImV4cCI6MjA3Njk4Nzc3NX0.btpQXyyP4qZfLNkuHKrYS9-qwXspvnc5LGYaS98EVGQ"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# OpenRouter API key
os.environ["OPENAI_API_KEY"] = os.getenv("OPENROUTER_API_KEY")  # LangChain uses same var

# Embedding model (offline & free)
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# ------------------ UTILITY FUNCTIONS ------------------

def local_dir(user_id, chat_id):
    return f"vector_store_{user_id}_{chat_id}"

def vector_zip_name(user_id, chat_id):
    return f"{user_id}_{chat_id}_chat_memory.zip"

def split_text(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    return splitter.split_text(text)

def load_vectorstore_from_supabase(user_id, chat_id):
    """Download vector DB for a specific user + chat ID"""
    zip_name = vector_zip_name(user_id, chat_id)
    local_path = local_dir(user_id, chat_id)

    try:
        res = supabase.storage.from_("vector_dbs").download(zip_name)
        with zipfile.ZipFile(io.BytesIO(res), 'r') as zip_ref:
            zip_ref.extractall(local_path)
        print(f"✅ Loaded vector DB for user={user_id}, chat={chat_id}")
        return Chroma(persist_directory=local_path, embedding_function=embedding_model)
    except Exception as e:
        print(f"⚠️ No existing DB found for user={user_id}, chat={chat_id}: {e}")
        return Chroma(persist_directory=local_path, embedding_function=embedding_model)


def save_vectorstore_to_supabase(user_id, chat_id, vectorstore):
    """Save & upload vector DB to Supabase (modern, warning-free)"""
    local_path = local_dir(user_id, chat_id)
    zip_path = f"{local_path}.zip"

    # Persist Chroma vector DB to disk
    vectorstore.persist()

    # Compress into a .zip archive
    shutil.make_archive(local_path, 'zip', local_path)

    # Connect to Supabase
    supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

    # Upload with correct header format (string not bool)
    with open(zip_path, "rb") as f:
        supabase.storage.from_("chat_vectors").upload(
            vector_zip_name(user_id, chat_id),
            f,
            {"x-upsert": "true"}   # ✅ must be a string, not bool
        )

    print(f"💾 Uploaded vector DB for user={user_id}, chat={chat_id}")

    # Cleanup temporary files
    shutil.rmtree(local_path, ignore_errors=True)
    if os.path.exists(zip_path):
        os.remove(zip_path)

# ------------------ MAIN CHAT ROUTE ------------------

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("user_id")
    chat_id = data.get("chat_id")
    model_name = data.get("model_name")  # e.g., "mistralai/mixtral-8x7b" or "meta-llama/llama-3-70b-instruct"
    question = data.get("question")

    if not all([user_id, chat_id, model_name, question]):
        return jsonify({"error": "user_id, chat_id, model_name, and question are required"}), 400

    # Load or create vectorstore
    vectorstore = load_vectorstore_from_supabase(user_id, chat_id)

    # Configure dynamic model from OpenRouter
    llm = ChatOpenAI(
        model=model_name,
        temperature=0.7,
        openai_api_base="https://openrouter.ai/api/v1",  # Required for OpenRouter
    )

    # ✅ MODERN RAG IMPLEMENTATION
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    # Prompt template for retrieval-based QA
    prompt = ChatPromptTemplate.from_template(
        """Answer the following question based only on the given context.
If the context does not contain enough information, say "I don’t have enough information to answer."

Context:
{context}

Question: {input}"""
    )

    # Create a document chain (LLM + prompt)
    combine_docs_chain = create_stuff_documents_chain(llm, prompt)

    # Combine retriever and document chain into retrieval chain
    rag_chain = create_retrieval_chain(retriever, combine_docs_chain)

    # Run RAG
    try:
        result = rag_chain.invoke({"input": question})
        response = result.get("answer", "No answer found.")
    except Exception as e:
        print(f"Error during retrieval or generation: {e}")
        response = "I'm having trouble generating a response right now."

    # Save chat context into vector DB
    new_chat = f"User: {question}\nBot ({model_name}): {response}"
    docs = [Document(page_content=chunk) for chunk in split_text(new_chat)]
    vectorstore.add_documents(docs)
    save_vectorstore_to_supabase(user_id, chat_id, vectorstore)

    return jsonify({
        "response": response,
        "user_id": user_id,
        "chat_id": chat_id,
        "model_used": model_name
    })

# ------------------ OPTIONAL FINALIZE ENDPOINT ------------------

@app.route("/finalize_chat", methods=["POST"])
def finalize_chat():
    """Mark a chat as complete in Supabase"""
    data = request.get_json()
    user_id = data.get("user_id")
    chat_id = data.get("chat_id")

    if not user_id or not chat_id:
        return jsonify({"error": "user_id and chat_id are required"}), 400

    zip_name = vector_zip_name(user_id, chat_id)
    try:
        supabase.storage.from_("vector_dbs").get_public_url(zip_name)
        msg = f"✅ Chat {chat_id} for user {user_id} is finalized and saved."
    except Exception:
        msg = f"⚠️ No chat found to finalize for chat_id={chat_id}"

    return jsonify({"message": msg})


# ------------------ RUN SERVER ------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
