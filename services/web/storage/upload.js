import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../initFirebase";

export const upload = ({ contentType, file, fileType, fileName }) => {
  return new Promise((resolve, reject) => {
    // contentType: 'image/jpeg'
    // file: actual file to upload
    // fileType: image or gif
    // fileName: my-super-meme.jpeg

    // Create the file metadata
    const metadata = { contentType };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, `${fileType}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      () => {},
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      },
    );
  });
};
