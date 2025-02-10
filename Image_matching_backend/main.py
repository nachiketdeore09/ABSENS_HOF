from fastapi import FastAPI, Form, File, UploadFile
from typing import List
from fastapi.staticfiles import StaticFiles
import uvicorn
import numpy as np  
from fastapi.middleware.cors import CORSMiddleware
from service.feature_extractor import generate_embeddings
import uuid
from dotenv import load_dotenv
import os
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# Check if index exists, else create it
index_name = "face-recognition"
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=512,  # FaceNet embeddings have 512 dimensions
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

# Connect to the index
index = pc.Index(index_name)


app = FastAPI(root_path="/api")

# allow cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Function to check allowed file types
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/report-missing")
async def store_user_images(user_id: str = Form(...), images: List[UploadFile] = File(...)):
    """Stores multiple images of the same user, averages their embeddings, and stores in Pinecone."""
    # check if uploaded images are valid
    for image in images:
        if not allowed_file(image.filename):
            return {"error": "Invalid file type"}   
        
    embeddings = []

    for image in images:
        embedding = await generate_embeddings(image)
        if embedding is not None:  # Only add embedding if face was detected
            embeddings.append(embedding)
    
    if not embeddings:
        return {"error": "No valid faces detected in any of the provided images"}
    
    # Compute the mean embedding (averaging all images of the same user)
    final_embedding = np.mean(embeddings, axis=0)
    # Convert numpy array to list and ensure all values are native Python types
    final_embedding_list = [float(x) for x in final_embedding]

    # Store in Pinecone under the 'reported' namespace
    try:
        # check if user_id already exists in the index with namespace "unconfirmed"
        query_response = index.query(vector=final_embedding_list, top_k=1, namespace="unconfirmed", include_metadata=True)
        matches = query_response["matches"]
        if matches and matches[0]["score"] > 0.8:  # Only consider it a match if similarity score is high enough
            return {"message": "User already exists in unconfirmed namespace", "user_id": user_id}
        index.upsert([(user_id, final_embedding_list)], namespace="reported")
        print(query_response)
        return {
            "message": "User images stored successfully", 
            "user_id": user_id, 
            "status": "success",
            "embedding_size": len(final_embedding_list)
        }
    except Exception as e:
        print(f"Error saving embedding: {e}")
        return {"error": str(e)}

@app.post("/find-missing")
async def find_missing_child(image: UploadFile = File(...)):
    """Searches for a missing child using facial similarity."""
    embedding = await generate_embeddings(image)

    # Query Pinecone for similar embeddings in 'reported' namespace
    search_results = index.query(vector=embedding.tolist(), top_k=1, namespace="reported", include_metadata=True)

    if search_results["matches"]:
        user_id = search_results["matches"][0]["id"]
        return {"message": "Child found", "user_id": user_id}
    
    # If no match found, store embedding in 'unconfirmed' namespace
    index.upsert([(str(uuid.uuid4()), embedding.tolist())], namespace="unconfirmed")
    return {"message": "No match found, stored for future cases"}
   
   
#  List all embeddings stored in index
@app.get("/list-embeddings")
async def list_embeddings():
    """Lists all embeddings stored in the index."""
    try:
        print("Listing embeddings")
        # Get all vector IDs from the index for both namespaces
        reported_stats = index.describe_index_stats()
        namespaces = reported_stats.namespaces
        
        vector_counts = {
            "reported": namespaces.get("reported", {}).get("vector_count", 0),
            "unconfirmed": namespaces.get("unconfirmed", {}).get("vector_count", 0)
        } 
      
        return {
            "total_vectors": sum(vector_counts.values()),
            "vectors_by_namespace": vector_counts,
        }
    except Exception as e:
        return {"error": str(e)}    

    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)