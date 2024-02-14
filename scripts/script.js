let linkInput = document
  .querySelector(".shortener__form--url")
  .addEventListener("input", handleInputChange);

let shortenerButton = document
  .getElementById("shortener__input--button")
  .addEventListener("click", postData);

let buttonClicked = false;

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

  // Use corsproxy.io to handle CORS

  const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent('https://cleanuri.com/api/v1/shorten', urlInput);

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
