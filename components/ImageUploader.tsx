import { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '@lib/firebase';
import Loader from './Loader';

// Uploads images to Firebase Storage
const ImageUploader: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the file
    const file = Array.from(e.target.files!)[0]; // Note the use of "!" to assert that files is non-null
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(`uploads/${auth.currentUser!.uid}/${Date.now()}.${extension}`); // Note the use of "!" to assert that currentUser is non-null
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
      setProgress(Number(pct));
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => ref.getDownloadURL())
      .then((url) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };

  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-lg">
  <Loader show={uploading} />

  {uploading && (
    <div className="mt-4 text-center">
      <h3 className="text-2xl">{progress}%</h3>
    </div>
  )}

  {!uploading && (
    <div className="mt-4">
      <label className="btn bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg cursor-pointer">
        📸 Upload Img
        <input
          type="file"
          onChange={uploadFile}
          accept="image/x-png,image/gif,image/jpeg"
          className="hidden"
        />
      </label>
    </div>
  )}

  {downloadURL && (
    <div className="mt-4">
      <code className="upload-snippet bg-gray-200 text-gray-800 p-2 rounded-lg">
        ![alt]({downloadURL})
      </code>
    </div>
  )}
</div>

  );
}

export default ImageUploader;
