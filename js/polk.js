let polkPeople = [];
let pushedState = false;

const modal = document.getElementById("polk-modal");
const modalBody = document.getElementById("polk-modal-body");
const grid = document.getElementById("polk-grid");

// ===== Загрузка =====
async function loadPolk() {
  try {
    const response = await fetch(`${basePath}/data/polk/polk.json`);
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки полка:", error);
  }
}

// ===== Сетка =====
function renderGrid(list) {
  grid.innerHTML = list
    .map(
      (p) => `
      <a href="?hero=${p.id}" class="polk-hero" data-id="${p.id}">
        <img src="${basePath}/${p.thumb}" alt="${p.name}"
             width="100" height="150" loading="lazy" decoding="async" />
        <span class="polk-hero__name">${p.name}</span>
      </a>`,
    )
    .join("");
  document.getElementById("polk-counter").textContent = list.length;
}

// ===== Поиск (с дебаунсом, чтобы не дёргать 480 карточек на каждый символ) =====
let searchTimer;
document.getElementById("polk-search").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const q = e.target.value.trim().toLowerCase();
    renderGrid(
      q
        ? polkPeople.filter((p) => p.name.toLowerCase().includes(q))
        : polkPeople,
    );
  }, 200);
});

// ===== Модалка =====
function lockScroll() {
  if (typeof lenis !== "undefined") lenis.stop();
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  if (typeof lenis !== "undefined") lenis.start();
  document.body.style.overflow = "";
}

function openHero(id, fromUrl = false) {
  const person = polkPeople.find((p) => p.id === id);
  if (!person) return;

  modalBody.innerHTML = `
    <img class="polk-modal__photo" src="${basePath}/${person.photo}" alt="${person.name}" />
    <div>
      <h2 class="polk-modal__name">${person.name}</h2>
      <span class="polk-modal__years">${person.years}</span>
      <p class="polk-modal__bio">${person.bio}</p>
    </div>
  `;
  modal.hidden = false;
  lockScroll();

  if (!fromUrl) {
    history.pushState(null, "", `?hero=${id}`);
    pushedState = true;
  }
}

function closeHero() {
  modal.hidden = true;
  unlockScroll();
  if (pushedState) {
    history.back(); // вернёт URL без ?hero и сработает popstate
    pushedState = false;
  } else {
    history.replaceState(null, "", location.pathname);
  }
}

// Клик по карточке → модалка вместо перехода
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".polk-hero");
  if (!card) return;
  e.preventDefault();
  openHero(parseInt(card.dataset.id, 10));
});

// Закрытие: оверлей, крестик, Esc
modal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeHero();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeHero();
});

// Кнопки вперёд/назад браузера
window.addEventListener("popstate", () => {
  const id = getHeroParam();
  if (id) openHero(id, true);
  else if (!modal.hidden) {
    modal.hidden = true;
    unlockScroll();
    pushedState = false;
  }
});

function getHeroParam() {
  const v = new URLSearchParams(location.search).get("hero");
  return v ? parseInt(v, 10) : null;
}

// ===== Старт =====
async function initPolk() {
  polkPeople = (await loadPolk()) || [];
  renderGrid(polkPeople);

  // Если пришли по ссылке ?hero=17 — сразу открываем героя
  const id = getHeroParam();
  if (id) openHero(id, true);
}

initPolk();
