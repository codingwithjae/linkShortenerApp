import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from "./firebase.js";

const logout = document.querySelector(".logged-in");

logout.addEventListener("click", async () => {
  await signOut(auth);
  console.log("user signed out");
});
