// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnLtVZQw5MrL-HYuCTu1wrjlb1IojWOMA",
  authDomain: "letschat-46f6a.firebaseapp.com",
  projectId: "letschat-46f6a",
  storageBucket: "letschat-46f6a.appspot.com",
  messagingSenderId: "507883726947",
  appId: "1:507883726947:web:114eb827e09eab6e3fb056"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
