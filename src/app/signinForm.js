import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth } from "./firebase.js";
import { showMessage } from "./showMessage.js";

const signInForm = document.querySelector("#signin-form"); // Corregido aquí

signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = signInForm["signin-email"].value;
  const password = signInForm["signin-password"].value; // Corregido aquí

  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredentials);

    // show welcome message
    showMessage("Welcome " + userCredentials.user.email);

    const signupModal = document.getElementById("#signin-modal");
    if (signupModal) {
      signupModal.style.display = "none";
    }
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      showMessage("Wrong password", "error");
    } else if (error.code === "auth/user-not-found") {
      showMessage("User not found", "error");
    } else {
      showMessage("Something went wrong", "error");
    }
  }
});
