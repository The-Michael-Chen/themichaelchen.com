const siteData = window.siteData;

const visionLayout = document.getElementById("vision-layout");
const primaryLinks = document.getElementById("primary-links");
const currentWork = document.getElementById("current-work");
const education = document.getElementById("education");
const projects = document.getElementById("projects");
const cursorRobot = document.getElementById("cursor-robot");
const imageModal = document.getElementById("image-modal");
const imageModalTarget = document.getElementById("image-modal-target");
const imageModalCaption = document.getElementById("image-modal-caption");
const imageModalClose = document.getElementById("image-modal-close");
const leftEye = cursorRobot.querySelector(".robot-eye--left");
const rightEye = cursorRobot.querySelector(".robot-eye--right");

const pretext = await loadPretext();
const robotState = {
  x: window.innerWidth * 0.82,
  y: 110,
  targetX: window.innerWidth * 0.82,
  targetY: 110,
  width: 58,
  height: 58,
  engaged: false,
};

let visionCtx = null;

if (pretext) {
  await document.fonts.ready;
  visionCtx = createVisionContext();
}

renderVision();

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

window.addEventListener("resize", () => {
  if (visionCtx) {
    visionCtx = createVisionContext();
  }
  renderVision();
});

window.addEventListener("pointermove", (event) => {
  robotState.engaged = true;
  robotState.targetX = clamp(event.clientX + 18, 8, window.innerWidth - robotState.width - 8);
  robotState.targetY = clamp(event.clientY + 18, 8, window.innerHeight - robotState.height - 8);
});

window.addEventListener("pointerleave", () => {
  robotState.engaged = false;
  robotState.targetX = window.innerWidth - 96;
  robotState.targetY = 96;
});

requestAnimationFrame(tickRobot);

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
      button.setAttribute(
        "aria-label",
        `Open image ${index + 1} for ${project.title}`,
      );

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

async function loadPretext() {
  const sources = [
    "https://esm.sh/pretext",
    "https://esm.sh/@chenglou/pretext",
  ];

  for (const source of sources) {
    try {
      return await import(source);
    } catch (error) {
      continue;
    }
  }

  return null;
}

function createVisionContext() {
  const prepare = pretext?.prepare || pretext?.default?.prepare;

  if (typeof prepare !== "function") {
    return null;
  }

  const style = getComputedStyle(visionLayout);

  return prepare({
    fontFamily: style.fontFamily,
    fontSize: Number.parseFloat(style.fontSize),
    lineHeight: Number.parseFloat(style.lineHeight) / Number.parseFloat(style.fontSize),
  });
}

function renderVision() {
  const visionText = siteData.profile.vision;

  if (!visionCtx) {
    visionLayout.textContent = visionText;
    return;
  }

  const style = getComputedStyle(visionLayout);
  const width = visionLayout.clientWidth;
  const fontSize = Number.parseFloat(style.fontSize);
  const lineHeight = Number.parseFloat(style.lineHeight);

  if (!width || !lineHeight || !fontSize) {
    visionLayout.textContent = visionText;
    return;
  }

  if (typeof visionCtx.layout !== "function" || typeof visionCtx.layoutNextLine !== "function") {
    visionLayout.textContent = visionText;
    return;
  }

  const baseLayout = visionCtx.layout(visionText, { width });
  visionLayout.style.minHeight = `${Math.max(baseLayout.height, lineHeight * 3)}px`;

  const containerRect = visionLayout.getBoundingClientRect();
  const robotRect = {
    left: robotState.x,
    top: robotState.y,
    right: robotState.x + robotState.width,
    bottom: robotState.y + robotState.height,
  };
  const overlapsVision =
    robotRect.right > containerRect.left &&
    robotRect.left < containerRect.right &&
    robotRect.bottom > containerRect.top &&
    robotRect.top < containerRect.bottom;

  let cursor = 0;
  let lineIndex = 0;
  const rows = [];

  while (cursor < visionText.length && lineIndex < 24) {
    const metrics = getVisionLineMetrics({
      containerRect,
      width,
      lineHeight,
      lineIndex,
      overlapsVision,
    });

    const nextLine = visionCtx.layoutNextLine(visionText, {
      cursor,
      width: metrics.width,
    });

    if (!nextLine || typeof nextLine.text !== "string") {
      break;
    }

    rows.push({
      text: nextLine.text.trimEnd(),
      indent: metrics.indent,
      width: metrics.width,
    });

    if (nextLine.cursor === cursor) {
      break;
    }

    cursor = nextLine.cursor;
    lineIndex += 1;
  }

  if (rows.length === 0) {
    visionLayout.textContent = visionText;
    return;
  }

  visionLayout.replaceChildren(...rows.map(renderVisionLine));
}

function getVisionLineMetrics({ containerRect, width, lineHeight, lineIndex, overlapsVision }) {
  if (!overlapsVision) {
    return { indent: 0, width };
  }

  const relativeLeft = robotState.x - containerRect.left;
  const relativeTop = robotState.y - containerRect.top;
  const robotWidth = robotState.width;
  const robotHeight = robotState.height;
  const lineTop = lineIndex * lineHeight;
  const lineBottom = lineTop + lineHeight;
  const buffer = 10;
  const affectsLine =
    lineBottom > relativeTop - buffer &&
    lineTop < relativeTop + robotHeight + buffer;

  if (!affectsLine) {
    return { indent: 0, width };
  }

  if (relativeLeft + robotWidth / 2 < width / 2) {
    const indent = clamp(relativeLeft + robotWidth + 12, 0, width * 0.55);
    return {
      indent,
      width: Math.max(150, width - indent),
    };
  }

  const available = clamp(relativeLeft - 12, 150, width);
  return {
    indent: 0,
    width: available,
  };
}

function renderVisionLine(line) {
  const row = document.createElement("span");
  row.className = "vision-line";
  row.textContent = line.text;
  row.style.paddingLeft = `${line.indent}px`;
  row.style.maxWidth = `${line.width}px`;
  return row;
}

function tickRobot() {
  const easing = robotState.engaged ? 0.14 : 0.08;
  robotState.x += (robotState.targetX - robotState.x) * easing;
  robotState.y += (robotState.targetY - robotState.y) * easing;

  cursorRobot.style.transform = `translate3d(${robotState.x}px, ${robotState.y}px, 0)`;

  const eyeOffsetX = clamp((robotState.targetX - robotState.x) * 0.08, -1.8, 1.8);
  const eyeOffsetY = clamp((robotState.targetY - robotState.y) * 0.08, -1.3, 1.3);

  if (leftEye && rightEye) {
    const transform = `translate(${eyeOffsetX}px, ${eyeOffsetY}px)`;
    leftEye.setAttribute("transform", transform);
    rightEye.setAttribute("transform", transform);
  }

  renderVision();
  requestAnimationFrame(tickRobot);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
