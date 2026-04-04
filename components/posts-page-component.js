import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, user } from "../index.js";
import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { setLike, removeLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  const postsHtml = posts.map((post) => `
    <li class="post">
      <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${post.user.name}</p>
      </div>
      <div class="post-image-container">
        <img class="post-image" src="${post.imageUrl}">
      </div>
      <div class="post-likes">
        <button data-post-id="${post.id}" data-liked="${post.isLiked}" class="like-button">
          <img src="./assets/images/like-${post.isLiked ? 'active' : 'not-active'}.svg">
        </button>
        <p class="post-likes-text">Нравится: <strong>${post.likes.length}</strong></p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span> ${post.description}
      </p>
    </li>`).join("");

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">${postsHtml}</ul>
    </div>`;

  renderHeaderComponent({ element: document.querySelector(".header-container") });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, { userId: userEl.dataset.userId });
    });
  }

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!user) return alert("Авторизуйтесь, чтобы ставить лайки");

      const postId = likeBtn.dataset.postId;
      const isLiked = likeBtn.dataset.liked === "true";
      const action = isLiked ? removeLike : setLike;

      action({ token: getToken(), postId }).then(() => {
        const page = window.location.hash.includes("user-posts") ? USER_POSTS_PAGE : POSTS_PAGE;
        const post = posts.find((p) => p.id === postId);
        
        goToPage(page, { userId: post.user.id });
      });
    });
  }
}
