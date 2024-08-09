// Import the Google Cloud client library
import { Storage } from '@google-cloud/storage';

// Create a client
const storage = new Storage();

// The name of the bucket to access
const bucketName = 'aic_hieu';

export async function listFiles(videoPrefix) {
  const directory = `${videoPrefix}/scenes/`;
  
  try {
    const [files] = await storage.bucket(bucketName).getFiles({ prefix: directory });
    return files.map(file => file.name);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}
