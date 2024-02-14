// Associate the 'input' event with the input field
let linkInput = document
  .querySelector(".shortener__form--url")
  .addEventListener("input", handleInputChange);

// Associate the 'click' event with the button
let shortenerButton = document
  .getElementById("shortener__input--button")
  .addEventListener("click", postData);

// Variable to track whether the button was clicked
let buttonClicked = false;

// Function to handle the 'input' event
function handleInputChange(event) {
  let errorMessage = document.getElementById("shortener__error--message");
  let urlInput = event.target.value;

  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

  if (!urlPattern.test(urlInput) && buttonClicked) {
    // The URL is not in a valid format, and the button was clicked
    errorMessage.textContent = "Please enter a valid URL";
    errorMessage.style.color = "#FF6F5B";
  } else {
    // Clear the error message if the URL is valid or the button wasn't clicked
    errorMessage.textContent = "";
  }
}

// Function to handle the 'click' event
function postData(event) {
  event.preventDefault(); // Prevent the form from being submitted

  let inputElement = document.querySelector(".shortener__form--url");
  let errorMessage = document.getElementById("shortener__error--message");
  let urlInput = inputElement.value;

  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

  if (!urlPattern.test(urlInput)) {
    // Wrong URL format
    errorMessage.textContent = "Please enter a valid URL";
    errorMessage.style.color = "#FF6F5B";
    errorMessage.style.fontSize = "11px";
    errorMessage.style.position = "absolute";
    errorMessage.style.top = "420px";
    errorMessage.style.fontFamily = "Poppins, sans-serif";
    errorMessage.style.fontWeight = "300";
    buttonClicked = true;
    return;
  }

  errorMessage.textContent = "";

  console.log("Initiating POST request with URL:", urlInput);

  fetch("https://link-shortener-app-git-backend-jaedevgithub.vercel.app/proxy/cleanuri", {
    // Cambia el puerto si es necesario
    method: "POST", // Asegúrate de utilizar el método POST
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: urlInput }), // Envía el cuerpo de la solicitud correctamente
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Short link", data.result_url);
      inputElement.value = data.result_url;

      // Display a success message
      errorMessage.textContent = "Link generated successfully!";
      errorMessage.style.color = "#4CAF50";
      errorMessage.style.fontSize = "11px";
      errorMessage.style.position = "absolute";
      errorMessage.style.top = "320px";
      errorMessage.style.fontFamily = "Poppins, sans-serif";
      errorMessage.style.fontWeight = "300";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
