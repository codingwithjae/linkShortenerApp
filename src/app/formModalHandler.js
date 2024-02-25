// formModalHandler.js
export function initializeModal() {
  document.addEventListener("DOMContentLoaded", function () {
    const signInButton = document.getElementById("header__signin-button");
    const modal = document.getElementById("main__signup-modal");
    const closeButton = document.getElementById("main__signup-modal-close");

    signInButton.addEventListener("click", function () {
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    });

    closeButton.addEventListener("click", function () {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
    });
  });
}
