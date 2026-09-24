// Загрузка данных (basePath уже определён в news-render.js,
// т.к. этот файл подключается после него)
async function loadSocial() {
  try {
    const response = await fetch(`${basePath}/social.json`);
    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки соцпроектов:", error);
  }
}

// Карточка соцпроекта
function renderSocialCard(item, index) {
  const num = String(index + 1).padStart(2, "0");

  // Если есть link — это внешний сайт, иначе внутренняя страница
  const isExternal = Boolean(item.link);
  const href = isExternal ? item.link : `pages/social/${item.slug}.html`;
  const target = isExternal ? ' target="_blank" rel="noopener"' : "";

  return `
    <a href="${href}" class="social__card"${target}>
      <div class="social__card-img">
        <img src="${basePath}/${item.img}" alt="${item.title}" loading="lazy" />
        <span class="social__year">${item.years}</span>
      </div>
      <div class="social__card-body">
        <span class="social__num">/${num}</span>
        <h3 class="social__card-title">${item.title}</h3>
        <p class="social__card-desc">${item.desc}</p>
        <span class="social__more">
          ${isExternal ? "Сайт проекта ↗" : "Подробнее →"}
        </span>
      </div>
    </a>
  `;
}

// Рендер карусели
function renderSocialList(list) {
  const track = document.querySelector(".social__track");
  if (!track) return;
  track.innerHTML = list.map(renderSocialCard).join("");
}

// Инициализация
async function initSocial() {
  const social = await loadSocial();
  if (!social) return;
  renderSocialList(social);
}

initSocial();
