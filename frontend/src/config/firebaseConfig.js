import firebase from "firebase";

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyAzlZOWeodXbAPdTvvNul5dAnv0UAfN478",
  authDomain: "serverless-demo-4b5cb.firebaseapp.com",
  projectId: "serverless-demo-4b5cb",
  storageBucket: "serverless-demo-4b5cb.appspot.com",
  messagingSenderId: "1030922017497",
  appId: "1:1030922017497:web:868e01141ad489f8223cc8",
  measurementId: "G-B80NY8M44W",
});

export const firebaseAuthObj = firebaseConfig.auth();
export default firebaseConfig;
