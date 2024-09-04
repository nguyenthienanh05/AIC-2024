import os
from collections import Counter
import re

# Define a set of stop words to exclude from hallucination checks
STOP_WORDS = {"the", "a", "an", "and", "is", "in", "on", "at", "of", "for", "with", "to", "from", "that", "it", "this",
              "by"}


def check_repetition(text, threshold=0.2):
    """
    Check if the text contains repeated words or phrases above a certain threshold,
    ignoring common stop words.

    Parameters:
    - text (str): The text to analyze.
    - threshold (float): The threshold for repetition (0.2 means 20% repetition).

    Returns:
    - bool: True if text is likely to be hallucinated, False otherwise.
    """
    # Tokenize the text into words
    words = re.findall(r'\w+', text.lower())
    total_words = len(words)

    # Count the frequency of each word
    word_counts = Counter(words)

    # Exclude stop words from the counts
    for stop_word in STOP_WORDS:
        if stop_word in word_counts:
            del word_counts[stop_word]

    # Calculate the repetition ratio
    if total_words == 0 or not word_counts:  # Avoid division by zero or empty counts
        return False, 0, ""

    most_common_word, most_common_count = word_counts.most_common(1)[0]
    repetition_ratio = most_common_count / total_words

    # Check if repetition ratio exceeds the threshold
    return repetition_ratio > threshold, repetition_ratio, most_common_word


def analyze_files(base_directory, threshold=0.2):
    """
    Analyze all .txt files in the directories for hallucination.

    Parameters:
    - base_directory (str): The base path to the directories (e.g., '/content/downloaded/').
    - threshold (float): The threshold for repetition to flag hallucination.
    """
    hallucinated_files = []

    # Loop through all directories that match the pattern L01_V*, L02_V*, ..., L31_V*
    for i in range(1, 32):  # From 1 to 31 inclusive
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

                    # Read the content of the file
                    with open(file_path, 'r', encoding='utf-8') as file:
                        content = file.read()

                        # Check for hallucination
                        is_hallucinated, repetition_ratio, repeated_word = check_repetition(content, threshold)

                        if is_hallucinated:
                            hallucinated_files.append((file_path, repetition_ratio, repeated_word))
                            print(
                                f"File: {file_path} is hallucinated with a repetition ratio of {repetition_ratio:.2f} for the word '{repeated_word}'")

    # Display summary of hallucinated files
    if not hallucinated_files:
        print("No hallucinated files found.")
    else:
        print("\nHallucinated Files Summary:")
        for file_info in hallucinated_files:
            print(f"File: {file_info[0]}, Repetition Ratio: {file_info[1]:.2f}, Most Repeated Word: '{file_info[2]}'")


# Example Usage
base_directory = '/Users/albuscorleone/Documents/Schoolwork/Major/AI/URA/BKInnovation/AIC-2024/backend/downloaded/'  # Replace with your base directory path
analyze_files(base_directory, threshold=0.15)