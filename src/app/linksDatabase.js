import {
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { showMessage } from "./showMessage.js";
import { db } from "./firebase.js";

const postedLinks = document.querySelector(".list-group");

export const setupLinks = (data) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const userLinks = data.filter((doc) => doc.data().userId === user.uid);

    if (userLinks.length) {
      let html = "";
      userLinks.forEach((doc) => {
        const links = doc.data();
        const li = `
          <li class="list-group-item list-group-item-action hover:bg-gray-300 text-white ">
            <p>Shortened URL: ${links.originalUrl}</p>
            <p>Shortened URL: ${links.shortUrl}</p>
            <button class="delete-link" data-link-id="${doc.id}">Delete</button>
          </li>
        `;
        html += li;
      });

      postedLinks.innerHTML = html;

      document.querySelectorAll(".delete-link").forEach((button) => {
        button.addEventListener("click", (event) => {
          const linkId = event.target.getAttribute("data-link-id");
          deleteLink(linkId);
        });
      });
    } else {
      postedLinks.innerHTML = '<h4 class="text-white">No links available</h4>';
    }
  } else {
    postedLinks.innerHTML =
      '<h4 class="text-white">Please sign in to see your links</h4>';
  }
};

// Función para eliminar un enlace
const deleteLink = async (linkId) => {
  const auth = getAuth();
  auth.currentUser;

  try {
    await deleteDoc(doc(db, "usersLinks", linkId));
    showMessage("Link deleted successfully");
  } catch (error) {
    console.error("Error deleting link:", error);
    showMessage("Error deleting link", "error");
  }
};
