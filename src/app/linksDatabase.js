import {
  deleteDoc,
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { showMessage } from "./showMessage.js";
import { db } from "./firebase.js";

const dashboardContainer = document.querySelector(".dashboard");
const postedLinks = document.querySelector(".dashboard__links-list");
const closeDashboardButton = document.querySelector(".dashboard__close-button");
const dashboardToggle = document.querySelector(".header__dashboard-button");

const createLinkHTML = (links) => `
  <div class="dashboard__links-container list-group-item-action text-white flex flex-row align-items-between mb-4 mt-2 ">
    <button class="dashboard__copy-link-button relative right-8 transition duration-300 hover:text-gray-400" data-link-text="${
      links.shortUrl
    }"><i class="fa-regular fa-copy"></i></button>
    <div class="dashboard__tooltip-container">
      <p class="text-gray-300 font-light transition duration-300 hover:text-gray-400 cursor-pointer">${truncateUrl(
        links.shortUrl
      )}</p>
      <span class="dashboard__tooltip bg-gray-800 text-white text-center rounded px-2 py-1 absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 transition-opacity duration-300">${
        links.originalUrl
      }</span>
    </div>
    <button class="dashboard__delete-button relative left-8 transition duration-300 hover:text-gray-400" data-link-id="${
      links.docId
    }"><i class="fa-solid fa-delete-left"></i></button>
  </div>
`;

const truncateUrl = (url) => {
  const maxLength = 30; // Define la longitud máxima que deseas mostrar
  return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
};

export const setupLinks = async () => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dashboardContainer.classList.remove("block");

      const userLinksQuery = query(
        collection(db, "usersLinks"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(userLinksQuery, (snapshot) => {
        const userLinks = snapshot.docs;

        const html = userLinks
          .map((doc) => {
            const links = { ...doc.data(), docId: doc.id };
            return createLinkHTML(links);
          })
          .join("");

        postedLinks.innerHTML =
          html || '<h4 class="text-white">No links available</h4>';
        setupEventListeners();
      });

      setupLinks.unsubscribe = () => unsubscribe();
    } else {
      dashboardContainer.classList.add("hidden");
      if (setupLinks.unsubscribe) {
        setupLinks.unsubscribe();
      }
    }
  });

  if (dashboardToggle) {
    dashboardToggle.addEventListener("click", () => {
      dashboardContainer.classList.toggle("hidden");
    });
  }
};

const setupEventListeners = () => {
  document
    .querySelectorAll(".dashboard__delete-button, .dashboard__copy-link-button")
    .forEach((button) => {
      button.addEventListener("click", async (event) => {
        if (button.classList.contains("dashboard__delete-button")) {
          const linkId = button.getAttribute("data-link-id");
          await deleteLink(linkId);
        } else {
          const linkText = event.currentTarget.getAttribute("data-link-text");
          copyToClipboard(linkText);
          showMessage("Link copied to clipboard");
        }
      });
    });
};

const deleteLink = async (linkId) => {
  try {
    await deleteDoc(doc(db, "usersLinks", linkId));
    showMessage("Link deleted successfully");
  } catch (error) {
    console.error("Error deleting link:", error);
    showMessage("Error deleting link", "error");
  }
};

const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

if (closeDashboardButton) {
  closeDashboardButton.addEventListener("click", () => {
    dashboardContainer.classList.add("hidden");
  });
}
