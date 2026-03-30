import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea id="description-input" class="textarea" rows="4" placeholder="Опишите фото..."></textarea>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>`;

    renderHeaderComponent({ element: appEl.querySelector(".header-container") });

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newUrl) { imageUrl = newUrl; }
    });

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.getElementById("description-input").value;
      if (!imageUrl) return alert("Загрузите фото");
      if (!description) return alert("Добавьте описание");

      onAddPostClick({ 
        description: description.replace(/</g, "&lt;").replace(/>/g, "&gt;"), 
        imageUrl 
      });
    });
  };

  render();
}
