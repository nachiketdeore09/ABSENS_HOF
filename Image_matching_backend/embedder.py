import aiohttp
from fastapi import UploadFile

async def generate_embeddings(image: UploadFile):
    """Generate embeddings for a face image using FaceNet."""
    try:
        image_bytes = await image.read()  # Read file content
        
        # Create multipart form data
        form = aiohttp.FormData()
        form.add_field("file", image_bytes, filename=image.filename, content_type=image.content_type)

        # Send request to embedding API
        async with aiohttp.ClientSession() as session:
            async with session.post("https://VaibhavRVerma-absens.hf.space/api/embed", data=form) as resp:
                response = await resp.json()
                return response.get("embedding")  # Return embedding if available

    except Exception as e:
        print(f"Error generating embeddings: {e}")
        return None
