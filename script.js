const siteData = window.siteData;

const intro = document.getElementById("intro");
const primaryLinks = document.getElementById("primary-links");
const currentWork = document.getElementById("current-work");
const education = document.getElementById("education");
const projects = document.getElementById("projects");
const imageModal = document.getElementById("image-modal");
const imageModalTarget = document.getElementById("image-modal-target");
const imageModalCaption = document.getElementById("image-modal-caption");
const imageModalClose = document.getElementById("image-modal-close");
const themeToggle = document.getElementById("theme-toggle");

const savedTheme = window.localStorage.getItem("theme");
applyTheme(savedTheme || getPreferredTheme());
updateThemeToggleLabel();

renderIntro(siteData.profile.summary);

siteData.profile.links.forEach((link) => {
  const anchor = document.createElement("a");
  anchor.href = link.url;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.textContent = link.label;
  primaryLinks.appendChild(anchor);
});

siteData.currentWork.forEach((item) => {
  currentWork.appendChild(renderInfoCard(item));
});

siteData.education.forEach((item) => {
  education.appendChild(renderInfoCard(item));
});

siteData.projects.forEach((project) => {
  projects.appendChild(renderProject(project));
});

imageModalClose.addEventListener("click", () => {
  imageModal.close();
});

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    imageModal.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageModal.open) {
    imageModal.close();
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  window.localStorage.setItem("theme", nextTheme);
  updateThemeToggleLabel();
});

function renderInfoCard(item) {
  const card = document.createElement("article");
  card.className = "info-card";

  const title = document.createElement("h3");
  title.textContent = item.title;
  card.appendChild(title);

  if (item.meta) {
    const meta = document.createElement("p");
    meta.className = "meta-line";
    meta.textContent = item.meta;
    card.appendChild(meta);
  }

  const description = document.createElement("p");
  description.textContent = item.description;
  card.appendChild(description);

  if (item.link) {
    const anchor = document.createElement("a");
    anchor.className = "inline-link";
    anchor.href = item.link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.textContent = item.link.label;
    card.appendChild(anchor);
  }

  return card;
}

function renderProject(project) {
  const article = document.createElement("article");
  article.className = "project-card";

  const date = document.createElement("div");
  date.className = "project-card__date";
  date.textContent = project.period;
  article.appendChild(date);

  const body = document.createElement("div");

  const header = document.createElement("div");
  header.className = "project-card__header";

  const title = document.createElement("h3");
  title.className = "project-card__title";
  title.textContent = project.title;
  header.appendChild(title);

  const type = document.createElement("span");
  type.className = `project-type project-type--${project.type}`;
  type.textContent = project.typeLabel;
  header.appendChild(type);

  body.appendChild(header);

  const summary = document.createElement("p");
  summary.className = "project-card__summary";
  summary.textContent = project.summary;
  body.appendChild(summary);

  if (project.details) {
    const details = document.createElement("p");
    details.className = "project-card__details";
    details.textContent = project.details;
    body.appendChild(details);
  }

  const footer = document.createElement("div");
  footer.className = "project-card__footer";

  if (project.link) {
    const link = document.createElement("a");
    link.className = "project-card__link";
    link.href = project.link.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = project.link.label;
    footer.appendChild(link);
  }

  if (project.note) {
    const note = document.createElement("span");
    note.className = "meta-line";
    note.textContent = project.note;
    footer.appendChild(note);
  }

  if (footer.childElementCount > 0) {
    body.appendChild(footer);
  }

  if (project.images && project.images.length > 0) {
    const gallery = document.createElement("div");
    gallery.className = "project-card__gallery";

    project.images.forEach((image, index) => {
      const button = document.createElement("button");
      button.className = "project-card__thumb";
      button.type = "button";
      button.setAttribute("aria-label", `Open image ${index + 1} for ${project.title}`);

      const thumb = document.createElement("img");
      thumb.src = image.src;
      thumb.alt = image.alt || `${project.title} image ${index + 1}`;
      thumb.loading = "lazy";
      button.appendChild(thumb);

      button.addEventListener("click", () => {
        imageModalTarget.src = image.src;
        imageModalTarget.alt = thumb.alt;
        imageModalCaption.textContent = thumb.alt;
        imageModal.showModal();
      });

      thumb.addEventListener("error", () => {
        button.style.display = "none";
      });

      gallery.appendChild(button);
    });

    body.appendChild(gallery);
  }

  article.appendChild(body);
  return article;
}

function renderIntro(summary) {
  const sentences = Array.isArray(summary) ? summary : [summary];
  const fragments = sentences.map((sentence) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = sentence;
    return paragraph;
  });

  intro.replaceChildren(...fragments);
}

function getPreferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function updateThemeToggleLabel() {
  themeToggle.textContent =
    document.documentElement.dataset.theme === "dark" ? "Light mode" : "Dark mode";
}
