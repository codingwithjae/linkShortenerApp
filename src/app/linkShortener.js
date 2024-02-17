import { showMessage } from "./showMessage.js";

export function initializeLinkShortener() {
  let buttonClicked = false;

  // Asigna el evento de input
  let linkInput = document.querySelector(".shortener__form--url");
  linkInput.addEventListener("input", handleInputChange);

  // Asigna el evento de click
  let shortenerButton = document.getElementById("shortener__input--button");
  shortenerButton.addEventListener("click", postData);

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
      errorMessage.textContent = showMessage(
        "Please enter a valid URL",
        "error"
      );

      buttonClicked = true;
      return;
    }

    errorMessage.textContent = "";

    // Use corsproxy.io to handle CORS

    const corsProxyUrl =
      "https://corsproxy.io/?" +
      encodeURIComponent("https://cleanuri.com/api/v1/shorten", urlInput);

    console.log("Initiating POST request with URL:", corsProxyUrl);

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
        inputElement.value = data.result_url;

        errorMessage.textContent = showMessage("Link created successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
