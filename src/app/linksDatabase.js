const postedLinks = document.querySelector(".list-group");

export const setupLinks = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const post = doc.data();
      const li = `
        <li class="list-group-item list-group-item-action hover:bg-gray-300 ">
          <h5>${post.title}</h5>
          <p>${post.content}</p>
        </li>
      `;
      html += li;
    });
    postedLinks.innerHTML = html;
  } else {
    postedLinks.innerHTML = '<h4 class="text-white">Login to See Posts</h4>';
  }
};
