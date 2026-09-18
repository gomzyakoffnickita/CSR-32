let lastedScroll = window.scrollY;
const headerTop = document.querySelector(".header__top");

if (headerTop) {
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastedScroll) {
      headerTop.classList.add("hidden");
    } else {
      headerTop.classList.remove("hidden");
    }
    lastedScroll = currentScroll;
  });
}

// Горизонтальный скролл каруселей колесом мыши
const carousels = document.querySelectorAll(
  ".services-carousel, .news-post__carousel",
);

carousels.forEach((carousel) => {
  carousel.addEventListener(
    "wheel",
    (e) => {
      // Тачпад с горизонтальным жестом не трогаем
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Вертикальное колесо → горизонтальный скролл
      e.preventDefault();
      carousel.scrollLeft += e.deltaY;
    },
    { passive: false },
  );
});
