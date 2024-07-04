import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD9ak8YpdGIYuSZIuOprjxH7UrY6l7WyqY",
  authDomain: "a-donde-vamos-web.firebaseapp.com",
  projectId: "a-donde-vamos-web",
  storageBucket: "a-donde-vamos-web.appspot.com",
  messagingSenderId: "428018365247",
  appId: "1:428018365247:web:195247dc180133c54a198a",
  measurementId: "G-V1ZDV9Y0HE"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };