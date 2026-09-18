async function loadNews() {
  try {
    const response = await fetch("news.json");

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }
    const news = await response.json();
    console.log("Новости загружены", news);
    return news;
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

//Рендер одной карточки
function renderNewsCard(item) {
  const card = `
   <article class="news__card">
              <a href="/pages/news/${item.slug}.html" class="news__card-link">
                <div class="news__card-img">
                  <img src="/${item.img}" alt="${item.title}" loading="lazy" />
                  <span class="news__card-date">${item.date}</span>
                </div>
                <div class="news__card-body">
                  <span class="news__card-tag">${item.tag}</span>
                  <h3>${item.title}</h3>
                  <p>
                    ${item.desc}
                  </p>
                  <span class="news__card-more">Читать далее →</span>
                </div>
              </a>
            </article>
  `;
  return card;
}

//Рендер списка карточек
function renderNewsList(news, containerSelector, limit = null) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    return;
  }

  const newsToShow = limit ? news.slice(0, limit) : news; //Разделяем массив (показываем на главной 3 объекта)

  const html = newsToShow.map((item) => renderNewsCard(item)).join("");

  container.innerHTML = html;
}

async function initNews() {
  const news = await loadNews();
  if (news) {
    renderNewsList(news, ".news__grid", 3);
    renderNewsList(news, ".news-page__list");
  }
}

initNews();
