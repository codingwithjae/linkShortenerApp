import { showMessage } from "./showMessage.js";
import { addDoc, collection, getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


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
      showMessage("You can shorten links, but they won't be saved. Please sign in to save them.", "warning");
    }
  });

  function handleInputChange(event) {
    let errorMessage = document.getElementById("shortener__error--message");
    let urlInput = event.target.value;

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(urlInput) && buttonClicked) {
      errorMessage.textContent = "Please enter a valid URL";
      errorMessage.style.color = "#FF6F5B";
    } else {
      errorMessage.textContent = "";
    }
  }

  function postData(event) {
    event.preventDefault();

    let inputElement = document.querySelector(".shortener__form--url");
    let errorMessage = document.getElementById("shortener__error--message");
    let urlInput = inputElement.value;

    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!urlPattern.test(urlInput)) {
      errorMessage.textContent = showMessage("Please enter a valid URL", "error");

      buttonClicked = true;
      return;
    }

    errorMessage.textContent = "";

    // Use corsproxy.io to handle CORS
    const corsProxyUrl =
      "https://corsproxy.io/?" +
      encodeURIComponent("https://cleanuri.com/api/v1/shorten", urlInput);

    console.log("Initiating POST request with URL:", corsProxyUrl);

    // Obtener el usuario autenticado
    const user = auth.currentUser;

    if (user) {
      // Usuario autenticado, almacenar en la base de datos
      fetch(corsProxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: corsProxyUrl }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Short link", data.result_url);
          // Muestra el enlace acortado al usuario
          showMessage(`Link created successfully: ${data.result_url}`);
          inputElement.value = '';  // Limpiar el campo de entrada después de mostrar el enlace
          // Crear un objeto con los datos a almacenar en Firestore
          const linkData = {
            userId: user.uid,
            originalUrl: urlInput,
            shortUrl: data.result_url,
          };

          // Añadir documento a la colección "post" en Firestore
          addDoc(collection(db, "usersLinks"), linkData)
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              // Ahora puedes hacer algo con el ID del documento si es necesario
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // Usuario no autenticado, solo mostrar el enlace
      fetch(corsProxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: corsProxyUrl }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Short link (not saved)", data.result_url);
          showMessage(`Link created successfully`);
          inputElement.value = '';  // Limpiar el campo de entrada después de mostrar el enlace
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
}
