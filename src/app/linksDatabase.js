import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


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
          </li>
        `;
        html += li;
      });
      postedLinks.innerHTML = html;
    } else {
      postedLinks.innerHTML = '<h4 class="text-white">No links available</h4>';
    }
  } else {
    postedLinks.innerHTML = '<h4 class="text-white">Please sign in to see your links</h4>';
  }
};

