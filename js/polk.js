// Загружаем данные

let allHeroes = [];

const grid = document.getElementById("polk-grid");
const modal = document.getElementById("polk-modal");
const modalBody = document.getElementById("polk-modal-body");

const groupsSection = document.querySelector(".polk-groups");
const heroesSection = document.getElementById("polk-heroes-section");
const counter = document.getElementById("polk-counter");
const heroesTitle = document.getElementById("polk-heroes-title");
const empty = document.getElementById("polk-empty");
const backLink = document.querySelector(".polk-back-link");

// === Вспомогательные функции для анимаций ===

function showSection(section) {
  section.classList.remove("is-hidden");
  section.classList.add("is-visible");
}

function hideSection(section) {
  section.classList.remove("is-visible");
  section.classList.add("is-hidden");
}

function openModal() {
  modal.removeAttribute("hidden");
  // Небольшая задержка чтобы transition сработал
  requestAnimationFrame(() => {
    modal.classList.add("is-open");
  });
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
  // Ждём окончания анимации, потом прячем
  setTimeout(() => {
    if (!modal.classList.contains("is-open")) {
      modal.setAttribute("hidden", "");
    }
  }, 300);
}

// === Основные функции ===

function getUrlParams() {
  const params = new URLSearchParams(location.search);
  const offset = parseInt(params.get("offset"), 10);
  const count = parseInt(params.get("count"), 10);
  const hero = parseInt(params.get("hero"), 10);
  return {
    offset: isNaN(offset) ? null : offset,
    count: isNaN(count) ? null : count,
    hero: isNaN(hero) ? null : hero,
  };
}

async function loadHeroes() {
  try {
    const response = await fetch("/data.json");
    if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error.message);
    return [];
  }
}

function renderGrid(heroes) {
  if (!grid) return;

  if (heroes.length === 0) {
    grid.innerHTML = "";
    if (empty) empty.hidden = false;
    if (counter) counter.textContent = "0";
    return;
  }

  if (empty) empty.hidden = true;

  const { offset, count } = getUrlParams();

  const htmlCards = heroes
    .map((hero) => {
      return `<a href="?hero=${hero.id}&offset=${offset}&count=${count}" class="polk-hero" data-id="${hero.id}">
        <img src="/${hero.thumb}"
             alt="${hero.name}"
             width="100"
             height="150"
             loading="lazy" />
        <span class="polk-hero__name">${hero.name}</span>
      </a>`;
    })
    .join("");

  grid.innerHTML = htmlCards;
  if (counter) counter.textContent = heroes.length;
}

function showGroups() {
  showSection(groupsSection);
  hideSection(heroesSection);
  closeModal();
}

function showHeroes(offset, count, shouldScroll = true) {
  const startIndex = offset - 1;
  const endIndex = startIndex + count;
  const currentHeroes = allHeroes.slice(startIndex, endIndex);

  if (heroesTitle) {
    heroesTitle.textContent = `Герои ${offset}–${offset + currentHeroes.length - 1}`;
  }

  // Скрываем группы
  hideSection(groupsSection);

  // Небольшая задержка чтобы анимация скрытия успела начаться
  setTimeout(() => {
    showSection(heroesSection);
    renderGrid(currentHeroes);

    if (shouldScroll && heroesSection) {
      setTimeout(() => {
        heroesSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, 200);
}

function openHero(id, fromUrl = false) {
  const hero = allHeroes.find((h) => h.id === id);
  if (!hero) return;

  modalBody.innerHTML = `
    <img class="polk-modal__photo" src="/${hero.photo}" alt="${hero.name}" />
    <div>
      <h2 class="polk-modal__name">${hero.name}</h2>
      <span class="polk-modal__years">${hero.years || ""}</span>
      <p class="polk-modal__bio">${hero.bio || ""}</p>
    </div>
  `;

  openModal();

  if (!fromUrl) {
    const { offset, count } = getUrlParams();
    const newUrl = `?hero=${id}&offset=${offset}&count=${count}`;
    history.pushState({ hero: id }, "", newUrl);
  }
}

function closeHero(fromPopState = false) {
  if (!modal || !modal.classList.contains("is-open")) return;

  closeModal();

  if (!fromPopState) {
    const { offset, count } = getUrlParams();
    if (offset && count) {
      history.pushState({}, "", `?offset=${offset}&count=${count}`);
    } else {
      history.pushState({}, "", location.pathname);
    }
  }
}

function updateViewFromUrl(fromPopState = false) {
  const { offset, count, hero } = getUrlParams();

  if (offset && count) {
    showHeroes(offset, count, !fromPopState);

    if (hero) {
      // Небольшая задержка чтобы секция успела появиться
      setTimeout(() => {
        openHero(hero, true);
      }, 400);
    }
  } else {
    showGroups();
  }
}

async function start() {
  allHeroes = await loadHeroes();

  if (allHeroes.length === 0) {
    console.warn("Данные не загрузились");
    return;
  }

  // Считаем количество групп
  const groupCountResult = document.querySelector("#polk-groups");
  const groupCards = document.querySelectorAll(".polk-group-card");
  if (groupCountResult) {
    groupCountResult.textContent = groupCards.length;
  }

  // Считаем общее количество героев
  const totalEl = document.getElementById("polk-total");
  if (totalEl) {
    totalEl.textContent = allHeroes.length;
  }

  // === Обработчики ===

  // 1. Клик по карточкам групп
  document.querySelectorAll(".polk-group-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const url = new URL(card.href, location.origin);
      const offset = parseInt(url.searchParams.get("offset"), 10);
      const count = parseInt(url.searchParams.get("count"), 10);

      history.pushState({ offset, count }, "", card.href);
      showHeroes(offset, count, true);
    });
  });

  // 2. Клик по карточкам героев
  if (grid) {
    grid.addEventListener("click", (e) => {
      const card = e.target.closest(".polk-hero");
      if (!card) return;
      e.preventDefault();
      openHero(Number(card.dataset.id));
    });
  }

  // 3. Кнопка "Назад к группам"
  if (backLink) {
    backLink.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState({}, "", location.pathname);
      showGroups();

      // Прокрутка к началу секции групп
      setTimeout(() => {
        groupsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    });
  }

  // 4. Закрытие модалки через крестик/оверлей
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) {
        closeHero();
      }
    });
  }

  // 5. Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
      closeHero();
    }
  });

  // 6. Кнопка "Назад" браузера
  window.addEventListener("popstate", () => {
    if (modal && modal.classList.contains("is-open")) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(() => modal.setAttribute("hidden", ""), 300);
    }
    updateViewFromUrl(true);
  });

  // Запуск
  updateViewFromUrl(true);
}

start();
