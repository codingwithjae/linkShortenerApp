// Import Firebase authentication and Firestore modules
import { auth, db } from "./app/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDocs, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
// Import functions from various modules
import { initializeLinkShortener } from "./app/linkShortener.js";
import { initializeMenuButton } from "./app/mobileMenuToggle.js";
import { setupLinks } from "./app/linksDatabase.js";
import { loginCheck } from "./app/loginCheck.js";
import "./app/signupForm.js";
import "./app/logout.js";
import "./app/googleLogin.js";
import { initializeModal } from "./app/formModalHandler.js";
import { initializeLoader } from "./app/loadingSpinner.js";

// Initialize form modal and mobile menu button
initializeModal();
initializeLoader();
initializeMenuButton();

// Listen for authentication state changes
onAuthStateChanged(auth, async (user) => {
    // Check if user is authenticated
    if (user) {
        // If authenticated, fetch user's links from Firestore
        const querySnapshot = await getDocs(collection(db, "usersLinks"));
        setupLinks(querySnapshot.docs); // Pass fetched documents to setupLinks function
    } else {
        // If not authenticated, initialize links with an empty array
        setupLinks([]);
    }
    // Perform login check to update UI based on user's authentication status
    loginCheck(user);
});

// Initialize link shortener functionality
initializeLinkShortener();
