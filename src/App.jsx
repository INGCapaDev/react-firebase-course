import { useEffect, useState } from 'react';
import Auth from './components/auth';

import { db, auth, storage } from './config/firebase';
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([]);

  //New movie states
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState(1);
  const [isNewMovieOscar, setNewMovieOscar] = useState(false);

  //Update movie states
  const [updateTitleState, setUpdateTitleState] = useState('');

  //File upload states
  const [fileUpload, setFileUpload] = useState(null);

  const movieCollectionRef = collection(db, 'movies');

  const getMovieList = async () => {
    try {
      const data = await getDocs(movieCollectionRef);
      const filteredData = data.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setMovieList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(movieCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, 'movies', id);
    try {
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, 'movies', id);
    try {
      await updateDoc(movieDoc, { title: updateTitleState });
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Auth />
      <br />
      <input
        type='text'
        placeholder='Movie title...'
        onChange={(e) => setNewMovieTitle(e.target.value)}
      />
      <input
        type='number'
        placeholder='Release Date...'
        min={1}
        onChange={(e) => setNewReleaseDate(Number(e.target.value))}
      />
      <input
        type='checkbox'
        checked={isNewMovieOscar}
        onChange={() => setNewMovieOscar(!isNewMovieOscar)}
      />
      <label>Received an oscar</label>
      <button onClick={onSubmitMovie}>Submit Movie</button>

      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? 'green' : 'red' }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>
            <input
              placeholder='new title...'
              onChange={(e) => setUpdateTitleState(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update title
            </button>
          </div>
        ))}
      </div>
      <div>
        <input type='file' onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </>
  );
}

export default App;
