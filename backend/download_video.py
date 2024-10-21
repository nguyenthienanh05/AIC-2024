from google.cloud import storage
from google.oauth2 import service_account
import os
import concurrent.futures

# Thiết lập xác thực Google Cloud
credentials = service_account.Credentials.from_service_account_file(
    'ai-challenge-2024-431017-a875f74b540b.json',
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

# NEW CODE OF TWANG
def download_blob(blob, local_path):
    if os.path.exists(local_path):
        print(f"File already exists, skipping: {blob.name}")
        return
    
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    blob.download_to_filename(local_path)
    print(f"Downloaded: {blob.name}")

def download_video_files():
    current_dir = os.path.dirname(__file__)
    src_dir = os.path.join(current_dir, "..", "public")
    videos_dir = os.path.join(src_dir, "videos")
    os.makedirs(videos_dir, exist_ok=True)

    # List tất cả các blob trong bucket
    blobs = bucket.list_blobs()

    # Tạo danh sách các task để tải video
    tasks = []
    for blob in blobs:
        if blob.name.endswith('.mp4') and '/L' in blob.name:
            video_name = os.path.basename(blob.name)
            local_path = os.path.join(videos_dir, video_name)
            tasks.append((blob, local_path))

    # Số lượng worker (executors) để tải song song
    max_workers = 240

    # Sử dụng ThreadPoolExecutor để tải file song song
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(download_blob, blob, local_path) for blob, local_path in tasks]
        for future in concurrent.futures.as_completed(futures):
            try:
                future.result()
            except Exception as e:
                print(f"Lỗi khi tải file: {e}")

# Gọi hàm để tải các file video
download_video_files()

