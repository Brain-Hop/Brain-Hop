from flask import Flask, jsonify, request
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_classic.schema import Document
from langchain_openai import ChatOpenAI
from langchain_classic.prompts import ChatPromptTemplate
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_classic.chains import create_retrieval_chain

import boto3, os, io, zipfile, shutil

# ------------------ SETUP ------------------
load_dotenv()
app = Flask(__name__)

# ------------------ S3 CONFIG (Supabase Storage) ------------------
S3_ENDPOINT = f"https://{os.getenv('SUPABASE_PROJECT_ID')}.supabase.co/storage/v1/s3"
S3_BUCKET = os.getenv("SUPABASE_BUCKET")
ACCESS_KEY = os.getenv("SUPABASE_ACCESS_KEY")
SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

s3_client = boto3.client(
    "s3",
    endpoint_url=S3_ENDPOINT,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name="us-east-1"
)

# ------------------ OPENROUTER SETUP ------------------
os.environ["OPENAI_API_KEY"] = os.getenv("OPENROUTER_API_KEY")

# ------------------ EMBEDDING MODEL ------------------
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# ------------------ HELPER FUNCTIONS ------------------
def local_dir(user_id, chat_id):
    return f"vector_store_{user_id}_{chat_id}"

def vector_zip_name(user_id, chat_id):
    return f"{user_id}_{chat_id}_chat_memory.zip"

def split_text(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    return splitter.split_text(text)

# ------------------ DOWNLOAD VECTORSTORE ------------------
def load_vectorstore_from_supabase(user_id, chat_id):
    zip_name = vector_zip_name(user_id, chat_id)
    local_path = local_dir(user_id, chat_id)

    try:
        print(f"📥 Downloading {zip_name} from Supabase Storage ({S3_BUCKET})...")
        with open(f"{local_path}.zip", "wb") as f:
            s3_client.download_fileobj(S3_BUCKET, zip_name, f)

        with zipfile.ZipFile(f"{local_path}.zip", "r") as zip_ref:
            zip_ref.extractall(local_path)

        print(f"✅ Loaded vector DB for user={user_id}, chat={chat_id}")
        os.remove(f"{local_path}.zip")
        return Chroma(persist_directory=local_path, embedding_function=embedding_model)
    except Exception as e:
        print(f"⚠️ No existing DB found for user={user_id}, chat={chat_id}: {e}")
        return Chroma(persist_directory=local_path, embedding_function=embedding_model)

# ------------------ UPLOAD VECTORSTORE ------------------
def save_vectorstore_to_supabase(user_id, chat_id, vectorstore):
    local_path = local_dir(user_id, chat_id)
    zip_path = f"{local_path}.zip"

    vectorstore.persist()
    shutil.make_archive(local_path, 'zip', local_path)

    try:
        with open(zip_path, "rb") as f:
            s3_client.upload_fileobj(f, S3_BUCKET, vector_zip_name(user_id, chat_id))
        print(f"💾 Uploaded vector DB for user={user_id}, chat={chat_id}")
    except Exception as e:
        print(f"❌ Upload failed: {e}")

    shutil.rmtree(local_path, ignore_errors=True)
    if os.path.exists(zip_path):
        os.remove(zip_path)

# ------------------ MAIN CHAT ROUTE ------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("user_id")
    chat_id = data.get("chat_id")
    model_name = data.get("model_name")
    question = data.get("question")

    if not all([user_id, chat_id, model_name, question]):
        return jsonify({"error": "user_id, chat_id, model_name, and question are required"}), 400

    # Load vector store
    vectorstore = load_vectorstore_from_supabase(user_id, chat_id)

    llm = ChatOpenAI(
        model=model_name,
        temperature=0.7,
        openai_api_base="https://openrouter.ai/api/v1",
    )

    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

    prompt = ChatPromptTemplate.from_template(
        """Answer the following question based on the given context or answer whatever suits u the best.

Context:
{context}

Question: {input}"""
    )

    combine_docs_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, combine_docs_chain)

    try:
        result = rag_chain.invoke({"input": question})
        response = result.get("answer", "No answer found.")
        print(result)
    except Exception as e:
        print(f"Error during retrieval or generation: {e}")
        response = "I'm having trouble generating a response right now."

    # Save new chat message to DB
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

# ------------------ RUN ------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
