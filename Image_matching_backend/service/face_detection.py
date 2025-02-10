# Description: This file contains the code to detect faces in an image using MTCNN.
from mtcnn import MTCNN
import cv2
import numpy as np
from fastapi import UploadFile

detector = MTCNN()

async def preprocess_image(image: UploadFile):
    # Read the image file into a byte array
    contents = await image.read()
    # Convert to numpy array
    nparr = np.frombuffer(contents, np.uint8)
    # Decode the image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        print(f"Error: Unable to read image")
        return None

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convert to RGB
    img = cv2.resize(img, (160, 160))  # Resize to the model's input size
    print("Image preprocessed =========================================================================")
    return img

async def extract_face(image: UploadFile):
    try:
        print("Image loaded  -------------------------------------------------------")
        img = await preprocess_image(image)  # Already in NumPy format (RGB)
        if img is None:
            return None
    except Exception as e:
        print(f"Failed to load image: {e}")
        return None

    # Check if the image is empty
    if img.size == 0:
        print(f"Image is empty")
        return None

    # Detect faces in the image
    results = detector.detect_faces(img)

    # Process results
    if results:
        x, y, width, height = results[0]['box']
        face = img[y:y + height, x:x + width]
        return face

    print(f"No face found in image")
    return None
