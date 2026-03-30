const pichuginIvan = "prod";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${pichuginIvan}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: { Authorization: token },
  })
    .then((response) => {
      if (response.status === 401) throw new Error("Нет авторизации");
      return response.json();
    })
    .then((data) => data.posts);
}

export function getUserPosts({ token, userId }) {
  return fetch(`${postsHost}/user-posts/${userId}`, {
    method: "GET",
    headers: { Authorization: token },
  })
    .then((response) => response.json())
    .then((data) => data.posts);
}

export function postPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({ description, imageUrl }),
    headers: { Authorization: token },
  }).then((response) => {
    if (response.status === 400) throw new Error("Заполните все поля");
    return response.json();
  });
}

export function setLike({ token, postId }) {
  return fetch(`${postsHost}/${postId}/like`, {
    method: "POST",
    headers: { Authorization: token },
  }).then((response) => response.json());
}

export function removeLike({ token, postId }) {
  return fetch(`${postsHost}/${postId}/dislike`, {
    method: "POST",
    headers: { Authorization: token },
  }).then((response) => response.json());
}

export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);
  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => response.json());
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  }).then((response) => {
    if (response.status === 400) throw new Error("Неверный логин или пароль");
    return response.json();
  });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({ login, password, name, imageUrl }),
  }).then((response) => {
    if (response.status === 400) throw new Error("Пользователь уже существует");
    return response.json();
  });
}
