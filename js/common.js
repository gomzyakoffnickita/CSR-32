// Скролл наверх при загрузке
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual"; //Сбрасываем историю
}

window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "instant" }); //Скроллим вверх
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh(); //Пересчитываем заного все анимации
    }
  }, 100);

  // Обновление ScrollTrigger при изменении размера окна
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer); //Отменяем предыдущий таймер если он ещё не сработал

    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger === "undefined") return;

      const currentScroll = window.scrollY; // Запоминаем место где юзер был до ресайза

      if (typeof lenis !== "undefined") {
        lenis.stop();
      }

      // Пересоздаём ОБА пин-блока
      destroyCareerTrigger();
      destroyFormTimeline();

      initCareerTrigger();
      initFormTimeline();

      ScrollTrigger.refresh();
      window.scrollTo(0, currentScroll); //Возвращаем на то место где были до ресайза

      if (typeof lenis !== "undefined") {
        lenis.start();
      }
    }, 250);
  });
});

// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

//Бургер-меню
const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    burger.classList.toggle("is-active");

    // блокировка Lenis
    if (typeof lenis !== "undefined") isOpen ? lenis.stop() : lenis.start();
  });
}
