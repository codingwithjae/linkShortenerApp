import { showMessage } from "./showMessage.js";
import {
  addDoc,
  collection,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Function to initialize the link shortener
export function initializeLinkShortener() {
  // Get Firestore and Auth instances
  const db = getFirestore();
  const auth = getAuth();

  // Flag to track if the button was clicked
  let buttonClicked = false;

  // Assign input event listener
  let linkInput = document.querySelector(".shortener__form-url");
  linkInput.addEventListener("input", handleInputChange);

  // Assign click event listener
  let shortenerButton = document.getElementById("shortener__input-button");
  shortenerButton.addEventListener("click", postData);

  // Check user authentication state
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      showMessage(
        "You can shorten links, but they won't be saved. Please sign in to save them.",
        "warning"
      );
    }
  });

  // Handle input change event
  function handleInputChange(event) {
    let urlInput = event.target.value;

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(urlInput) && buttonClicked) {
      // Handle invalid input if the button was clicked
    }
  }

  // Handle button click event
  function postData(event) {
    event.preventDefault();

    let inputElement = document.querySelector(".shortener__form-url");
    let errorMessage = document.querySelector(".shortener__error");

    let urlInput = inputElement.value;

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(urlInput)) {
      errorMessage.textContent = showMessage(
        "Please enter a valid URL",
        "error"
      );

      buttonClicked = true;
      return;
    }

    errorMessage.textContent = "";

    // Proxy API URL for URL shortening
    const proxyApiUrl = "https://corsproxyserver.onrender.com/api/v1/shorten";

    // Make request to the proxy server
    fetch(proxyApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: urlInput }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Short link", data.result_url);
        showMessage(`Link created successfully`);
        inputElement.value = data.result_url;
        inputElement.setAttribute("title", urlInput); // Set tooltip

        const user = auth.currentUser;

        if (user) {
          // Save link data to Firestore
          const linkData = {
            userId: user.uid,
            originalUrl: urlInput,
            shortUrl: data.result_url,
          };

          addDoc(collection(db, "usersLinks"), linkData)
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage(`Link already generated`);
      });
  }
}

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  const copyIcon = document.querySelector(".shortener__form-icon");

  // Event listener for click on copy icon
  copyIcon.addEventListener("click", function () {
    const inputElement = document.querySelector(".shortener__form-url");

    // Select text in the input
    inputElement.select();
    document.execCommand("copy");

    // Deselect text
    window.getSelection().removeAllRanges();

    // Show success message
    showMessage("Link copied to clipboard", "success");
  });
});
