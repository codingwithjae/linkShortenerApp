import { auth, db } from "./app/firebase.js";
import { initializeLinkShortener } from "./app/linkShortener.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { initializeMenuButton } from "./app/mobileMenuToggle.js";
import {
  getDocs,
  collection,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { setupLinks } from "./app/linksDatabase.js";
import { loginCheck } from "./app/loginCheck.js";


import "./app/signupForm.js";
import "./app/logout.js";
import "./app/googleLogin.js";
import { initializeModal } from "./app/formModalHandler.js";
initializeModal();
initializeMenuButton();


onAuthStateChanged(auth, async (user) => {
  if (user) {
    const querySnapshot = await getDocs(collection(db, "usersLinks"));
    setupLinks(querySnapshot.docs);
  } else {
    setupLinks([]);
  }
  loginCheck(user);
});

initializeLinkShortener();
