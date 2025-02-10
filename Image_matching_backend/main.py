from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import uvicorn
import requests
import cv2
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# allow cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Set upload folder and allowed file types
UPLOAD_FOLDER = "/static/uploads"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.mount("/static", StaticFiles(directory=UPLOAD_FOLDER), name="static")

# Function to check allowed file types
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.post('/report/saveembeddings')
async def report(unique_id: str):
    # Fetch the person from the database
    person = get_person(unique_id)
    
    # Handle case where the person is not found
    if not person:
        return {"message": 'Person not found'}, 404
        
    urls = []
    errors = []
    for url in person['images']['urls']:
        urls.append(url)

    # Proceed only if there are URLs
    if not urls:
        return {"message": 'No image URLs found'}, 404

    embeddings = []
    
    for url in urls:
        print(f"Processing URL: {url}")
        response = requests.get(url)
        
        # Check for successful image download
        if response.status_code != 200:
            return {"message": f'Failed to download image from URL: {url}'}, 400
        
        # Convert the image content to a NumPy array
        file_bytes = np.asarray(bytearray(response.content), dtype=np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        # Check if the image was decoded successfully
        if image is None:
            return {"error": f"Failed to decode image from URL: {url}"}, 400
        
        # Resize image to reduce memory usage
        image = cv2.resize(image, (224, 224))
        embedding = feature_extractor(image)
        
        # Check if embedding was created successfully
        if embedding is None:
            errors.append(url)
        else:
            embeddings.append(embedding)  # Store the embedding for this image

    # Calculate average of all embeddings
    if embeddings:
        avg_embedding = np.mean(embeddings, axis=0)
        save_embedding_to_db(avg_embedding, unique_id)
        return {"embeddings": avg_embedding.tolist()}
    else:
        return {"message": 'No embeddings to save'}, 400