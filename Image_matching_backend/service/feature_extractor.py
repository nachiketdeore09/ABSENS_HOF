import numpy as np
from tensorflow import keras
from keras_facenet import FaceNet
from .face_detection import extract_face

# Initialize FaceNet model
model = FaceNet()

async def generate_embeddings(image):
    """Generate embeddings for a face image using FaceNet."""
    try:
        # Extract face from image
        face = await extract_face(image)  # Add await here
        if face is None:
            return None

        # Prepare face for FaceNet (expand dimensions to create batch of 1)
        face = np.expand_dims(face, axis=0)
        
        # Generate embeddings
        embedding = model.embeddings(face)
        return embedding[0]  # Return the first (and only) embedding
    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return None
    