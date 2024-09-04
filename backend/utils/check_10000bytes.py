import os
import numpy as np
from scipy import stats


def detect_file_size_anomalies(base_directory, z_threshold=3.0):
    """
    Analyze the size of all .txt files in the specified directories and detect anomalies.

    Parameters:
    - base_directory (str): The base path to the directories (e.g., '/content/downloaded/').
    - z_threshold (float): The z-score threshold to flag an anomaly (default is 3.0).

    Returns:
    - list: A list of detected anomalies with their details.
    """
    file_sizes = []
    file_paths = []

    # Loop through all directories that match the pattern L01_V*, L02_V*, ..., L31_V*
    for i in range(1, 35):  # From 1 to 31 inclusive
        for j in range(1, 100):  # Up to 99, assuming there are subdirectories like L01_V001 to L31_V099
            dir_name = f"L{i:02d}_V{j:03d}"  # Format directory name as L01_V001, L01_V002, ..., L31_V099
            directory_path = os.path.join(base_directory, dir_name, "description")

            # Check if the directory exists
            if not os.path.exists(directory_path):
                continue  # Skip if the directory does not exist

            # Process each .txt file in the directory
            for file_name in os.listdir(directory_path):
                if file_name.endswith('.txt'):
                    file_path = os.path.join(directory_path, file_name)
                    file_size = os.path.getsize(file_path)  # Get the size of the file in bytes

                    # Store the file size and path
                    file_sizes.append(file_size)
                    file_paths.append(file_path)

    # Convert file sizes to a numpy array for statistical analysis
    file_sizes = np.array(file_sizes)

    # Calculate mean and standard deviation of file sizes
    mean_size = np.mean(file_sizes)
    std_dev_size = np.std(file_sizes)

    # Calculate z-scores for each file size
    z_scores = (file_sizes - mean_size) / std_dev_size

    # Identify anomalies based on the z-score threshold
    anomalies = []
    for idx, z in enumerate(z_scores):
        if abs(z) > z_threshold:  # Anomaly if z-score is beyond the threshold
            anomalies.append({
                'file_path': file_paths[idx],
                'file_size': file_sizes[idx],
                'z_score': z
            })

    # Display summary of anomalies
    if not anomalies:
        print("No file size anomalies found.")
    else:
        print("\nAnomalies Detected in File Sizes:")
        for anomaly in anomalies:
            print(
                f"File: {anomaly['file_path']}, Size: {anomaly['file_size']} bytes, Z-Score: {anomaly['z_score']:.2f}")

    return anomalies


def detect_and_delete_large_files(base_directory, size_threshold=10000, z_threshold=3.0):
    """
    Analyze the size of all .txt files in the specified directories, detect anomalies,
    and delete files larger than the size threshold.

    Parameters:
    - base_directory (str): The base path to the directories.
    - size_threshold (int): The file size threshold in bytes (default is 10000).
    - z_threshold (float): The z-score threshold to flag an anomaly (default is 3.0).

    Returns:
    - list: A list of deleted files with their details.
    """
    file_sizes = []
    file_paths = []

    # Loop through all directories that match the pattern L01_V*, L02_V*, ..., L31_V*
    for i in range(1, 35):  # From 1 to 31 inclusive
        for j in range(1, 100):  # Up to 99, assuming there are subdirectories like L01_V001 to L31_V099
            dir_name = f"L{i:02d}_V{j:03d}"  # Format directory name as L01_V001, L01_V002, ..., L31_V099
            directory_path = os.path.join(base_directory, dir_name, "description")

            # Check if the directory exists
            if not os.path.exists(directory_path):
                continue  # Skip if the directory does not exist

            # Process each .txt file in the directory
            for file_name in os.listdir(directory_path):
                if file_name.endswith('.txt'):
                    file_path = os.path.join(directory_path, file_name)
                    file_size = os.path.getsize(file_path)  # Get the size of the file in bytes

                    # Store the file size and path
                    file_sizes.append(file_size)
                    file_paths.append(file_path)

    # Convert file sizes to a numpy array for statistical analysis
    file_sizes = np.array(file_sizes)

    # Calculate mean and standard deviation of file sizes
    mean_size = np.mean(file_sizes)
    std_dev_size = np.std(file_sizes)

    # Calculate z-scores for each file size
    z_scores = (file_sizes - mean_size) / std_dev_size

    deleted_files = []
    for idx, size in enumerate(file_sizes):
        if size > size_threshold:
            file_path = file_paths[idx]
            try:
                os.remove(file_path)
                deleted_files.append({
                    'file_path': file_path,
                    'file_size': size,
                    'z_score': z_scores[idx]
                })
                print(f"Deleted: {file_path}")
            except OSError as e:
                print(f"Error deleting {file_path}: {e}")

    # Display summary of deleted files
    if not deleted_files:
        print("No files larger than 10,000 bytes found.")
    else:
        print("\nDeleted Files (larger than 10,000 bytes):")
        for file in deleted_files:
            print(f"File: {file['file_path']}, Size: {file['file_size']} bytes, Z-Score: {file['z_score']:.2f}")

    return deleted_files


# Example Usage
base_directory = '/Users/albuscorleone/Documents/Schoolwork/Major/AI/URA/BKInnovation/AIC-2024/backend/downloaded/'  # Replace with your base directory path
anomalies = detect_file_size_anomalies(base_directory, z_threshold=4.5)

# Filter and display files larger than 10,000 bytes
large_files = [anomaly for anomaly in anomalies if anomaly['file_size'] > 10000]

print("\nFiles larger than 10,000 bytes:")
for file in large_files:
    print(f"File: {file['file_path']}, Size: {file['file_size']} bytes, Z-Score: {file['z_score']:.2f}")
    try:
        os.remove(file['file_path'])
        print(f"Deleted: {file['file_path']}")
    except OSError as e:
        print(f"Error deleting {file['file_path']}: {e}")

deleted_files = detect_and_delete_large_files(base_directory)