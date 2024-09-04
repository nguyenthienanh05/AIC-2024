from google.cloud import storage
from google.oauth2 import service_account
import os
import concurrent.futures

# Thiết lập xác thực Google Cloud
credentials = service_account.Credentials.from_service_account_file(
    '/Users/albuscorleone/Downloads/ai-challenge-2024-431017-a875f74b540b.json',
    scopes=["https://www.googleapis.com/auth/cloud-platform"]
)
# Set your bucket name
bucket_name = 'aic_videos_2024'

storage_client = storage.Client(credentials=credentials)
bucket = storage_client.bucket(bucket_name)


def download_blob(blob, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    blob.download_to_filename(local_path)
    print(f"Downloaded: {blob.name}")


def download_description_files(prefix):
    # List all blobs in the bucket with the given prefix
    blobs = bucket.list_blobs(prefix=prefix)

    # Create a list of tasks for downloading blobs
    tasks = []
    for blob in blobs:
        if '/description/' in blob.name:
            local_path = os.path.join('downloaded', blob.name)
            tasks.append((blob, local_path))

    # Set the number of workers (executors) to 10
    max_workers = 120

    # Use ThreadPoolExecutor to download files in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(download_blob, blob, local_path) for blob, local_path in tasks]
        for future in concurrent.futures.as_completed(futures):
            try:
                future.result()
            except Exception as e:
                print(f"Error downloading file: {e}")


# Set your bucket name
bucket_name = 'aic_videos_2024'

# Set the prefix to match your directory structure
prefix = 'L12_V'

# Call the function to download description files
download_description_files(prefix)
