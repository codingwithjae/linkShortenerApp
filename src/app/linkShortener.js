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

export function initializeLinkShortener() {
  const db = getFirestore();
  const auth = getAuth();

  let buttonClicked = false;

  // Asigna el evento de input
  let linkInput = document.querySelector(".shortener__form--url");
  linkInput.addEventListener("input", handleInputChange);

  // Asigna el evento de click
  let shortenerButton = document.getElementById("shortener__input--button");
  shortenerButton.addEventListener("click", postData);

  // Verificar el estado de autenticación del usuario
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      showMessage(
        "You can shorten links, but they won't be saved. Please sign in to save them.",
        "warning"
      );
    }
  });

  function handleInputChange(event) {
    let urlInput = event.target.value;

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(urlInput) && buttonClicked) {
    }
  }

  function postData(event) {
    event.preventDefault();

    let inputElement = document.querySelector(".shortener__form--url");
    let errorMessage = document.getElementById("shortener__error--message");
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

    const rebrandlyApiKey = "3f39d47cb9974b72b3610a967505005e"; // Tu clave de API Rebrandly

    const apiUrl = "https://api.rebrandly.com/v1/links";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: rebrandlyApiKey,
      },
      body: JSON.stringify({ destination: urlInput }),
    };

    console.log("Initiating POST request to Rebrandly API");

    fetch(apiUrl, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Short link", data.shortUrl);
        showMessage(`Link created successfully`);
        inputElement.value = data.shortUrl;
        inputElement.setAttribute("title", data.destination); // Set tooltip

        const user = auth.currentUser;

        if (user) {
          const linkData = {
            userId: user.uid,
            originalUrl: urlInput,
            shortUrl: data.shortUrl,
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
      });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const copyIcon = document.querySelector(".shortener__form--icon");

  copyIcon.addEventListener("click", function () {
    const inputElement = document.querySelector(".shortener__form--url");

    // Selecciona el texto en el input
    inputElement.select();
    document.execCommand("copy");

    // Deselecciona el texto
    window.getSelection().removeAllRanges();

    // Muestra un mensaje de éxito
    showMessage("Link copied to clipboard", "success");
  });
});
