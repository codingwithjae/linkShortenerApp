const loggedOutLinks = document.querySelectorAll(".header__logged-out-buttons");
const loggedOutButtonOut = document.querySelectorAll(".logged-in");
const logOutButtonIn = document.getElementById("log-out");
const formModalClose = document.getElementById("main__signup-modal");

export const loginCheck = (user) => {
  if (user) {
    loggedOutButtonOut.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
    logOutButtonIn.classList.remove("hidden");
    logOutButtonIn.classList.add("opacity-100");
    formModalClose.classList.add("hidden");
    
  } else {
    loggedOutButtonOut.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
    logOutButtonIn.classList.add("hidden");
  }
};
