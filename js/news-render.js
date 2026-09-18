// Определяем базовый путь проекта
function getBasePath() {
  const path = window.location.pathname; //Текущий путь URL
  const parts = path.split("/").filter((p) => p !== ""); //Разбиваем строку на / и убираем пустые элементы
  console.log(parts);

  if (
    parts.length === 0 || 
    parts[0] === "pages" ||
    parts[0].endsWith(".html")
  ) {
    return "";
  }

  return `/${parts[0]}`;
}

const basePath = getBasePath();

// Загрузка данных
async function loadNews() {
  try {
    const paths = [`${basePath}/news.json`, "../news.json", "./news.json"];

    let response;
    for (const path of paths) {
      response = await fetch(path);
      if (response.ok) break;
    }

    if (!response || !response.ok) {
      throw new Error(`Файл news.json не найден`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки новостей:", error);
  }
}

// Рендер одной карточки
function renderNewsCard(item) {
  const card = `
    <article class="news__card">
      <a href="${basePath}/pages/news/${item.slug}.html" class="news__card-link">
        <div class="news__card-img">
          <img src="${basePath}/${item.img}" alt="${item.title}" loading="lazy" />
          <span class="news__card-date">${item.date}</span>
        </div>
        <div class="news__card-body">
          <span class="news__card-tag">${item.tag}</span>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
          <span class="news__card-more">Читать далее →</span>
        </div>
      </a>
    </article>
  `;
  return card;
}

// Рендер списка карточек
function renderNewsList(news, containerSelector, limit = null) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const newsToShow = limit ? news.slice(0, limit) : news;
  const html = newsToShow.map((item) => renderNewsCard(item)).join("");
  container.innerHTML = html;
}

// Инициализация
async function initNews() {
  const news = await loadNews();
  if (!news) return;

  renderNewsList(news, ".news__grid", 3);
  renderNewsList(news, ".news-page__list");
}

initNews();
