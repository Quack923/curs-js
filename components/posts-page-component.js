import { renderHeaderComponent } from "./header-component.js";
import * as index from "../index.js";
import { USER_POSTS_PAGE } from "../routes.js";
import { setLike, removeLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  const render = () => {
    const currentPosts = index.posts;

    const postsHtml = currentPosts.map((post) => {
      return `
        <li class="post">
          <div class="post-header" data-user-id="${post.user?.id}">
              <img src="${post.user?.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user?.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="./assets/images/like-${post.isLiked ? 'active' : 'not-active'}.svg">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes?.length || 0}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.user?.name}</span>
            ${post.description}
          </p>
        </li>`;
    }).join("");

    appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <ul class="posts">${postsHtml}</ul>
      </div>`;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    for (let userEl of document.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        index.goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      });
    }

    const likeButtons = document.querySelectorAll(".like-button");
    for (let likeBtn of likeButtons) {
      likeBtn.addEventListener("click", (event) => {
        event.stopPropagation();

        if (!index.user) {
          alert("Авторизуйтесь, чтобы ставить лайки");
          return;
        }

        const postId = likeBtn.dataset.postId;
        const currentPost = index.posts.find((p) => p.id === postId);

        if (!currentPost) return;

        const action = currentPost.isLiked ? removeLike : setLike;

        action({ token: index.getToken(), postId })
          .then((result) => {
            const updatedPost = result.post || result;

            const newPosts = index.posts.map((p) => {
              return p.id === postId ? updatedPost : p;
            });

            index.setPosts(newPosts);
            render(); 
          })
          .catch((error) => {
            console.error(error);
            alert("Что-то пошло не так");
          });
      });
    }
  };

  render();
}
