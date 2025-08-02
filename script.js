// script.js
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ---------- AUTH ----------
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCred.user.uid), {
    email,
    username,
    uid: userCred.user.uid,
  });
  location.href = "users.html";
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
  location.href = "users.html";
};

window.logout = async function () {
  await signOut(auth);
  location.href = "login.html";
};

// ---------- CHAT ----------
let currentUser = null;
let selectedUser = null;
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUser = user;

  if (location.pathname.includes("users.html")) {
    loadUsers();
  }
});

async function loadUsers() {
  const q = query(collection(db, "users"), where("uid", "!=", currentUser.uid));
  const querySnapshot = await getDocs(q);
  const userList = document.getElementById("userList");

  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = doc.data().username;
    li.onclick = () => selectUser(doc.data());
    userList.appendChild(li);
  });
}

function getChatId(uid1, uid2) {
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

function selectUser(userObj) {
  selectedUser = userObj;
  document.getElementById("chatHeader").textContent = userObj.username;
  document.getElementById("messages").innerHTML = "";
  listenForMessages();
}

function listenForMessages() {
  const chatId = getChatId(currentUser.uid, selectedUser.uid);
  const msgRef = collection(db, "chats", chatId, "messages");
  const q = query(msgRef, orderBy("createdAt"));

  onSnapshot(q, (snapshot) => {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.className = `message ${msg.sender === currentUser.uid ? "sent" : "received"}`;
      div.textContent = msg.text;
      messagesDiv.appendChild(div);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

window.sendMessage = async function () {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text || !selectedUser) return;

  const chatId = getChatId(currentUser.uid, selectedUser.uid);
  const msgRef = collection(db, "chats", chatId, "messages");

  await addDoc(msgRef, {
    sender: currentUser.uid,
    receiver: selectedUser.uid,
    text,
    createdAt: serverTimestamp(),
  });

  input.value = "";
};
