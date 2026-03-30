import { getPosts, postPost, getUserPosts } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import { ADD_POSTS_PAGE, AUTH_PAGE, LOADING_PAGE, POSTS_PAGE, USER_POSTS_PAGE } from "./routes.js";
import { getUserFromLocalStorage, removeUserFromLocalStorage, saveUserToLocalStorage } from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

export const getToken = () => (user ? `Bearer ${user.token}` : undefined);

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

export const goToPage = (newPage, data) => {
  if (newPage === POSTS_PAGE) {
    page = LOADING_PAGE;
    renderApp();
    return getPosts({ token: getToken() })
      .then((newPosts) => {
        posts = newPosts;
        page = POSTS_PAGE;
        renderApp();
      });
  }

  if (newPage === USER_POSTS_PAGE) {
    page = LOADING_PAGE;
    renderApp();
    return getUserPosts({ token: getToken(), userId: data.userId })
      .then((newPosts) => {
        posts = newPosts;
        page = USER_POSTS_PAGE;
        renderApp();
      });
  }

  if (newPage === ADD_POSTS_PAGE) {
    page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
    return renderApp();
  }

  page = newPage;
  renderApp();
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) return renderLoadingPageComponent({ appEl, user, goToPage });

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      }
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        postPost({ token: getToken(), description, imageUrl })
          .then(() => goToPage(POSTS_PAGE))
          .catch((err) => alert(err.message));
      },
    });
  }

  if (page === POSTS_PAGE || page === USER_POSTS_PAGE) {
    return renderPostsPageComponent({ appEl });
  }
};


goToPage(POSTS_PAGE);
