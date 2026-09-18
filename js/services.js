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

const carousels = document.querySelectorAll(".services-carousel");

carousels.forEach((carousel) => {
  carousel.addEventListener(
    "wheel",
    (e) => {
      // Если есть горизонтальное движение — не мешаем
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Трансформируем вертикальный скролл в горизонтальный
      e.preventDefault();
      carousel.scrollLeft += e.deltaY;
    },
    { passive: false },
  );
});
