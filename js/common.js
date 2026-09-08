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
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger === "undefined") return;

      const currentScroll = window.scrollY;

      if (typeof lenis !== "undefined") {
        lenis.stop();
      }

      // Пересоздаём ОБА пин-блока
      destroyCareerTrigger();
      destroyFormTimeline();

      initCareerTrigger();
      initFormTimeline();

      ScrollTrigger.refresh();

      window.scrollTo(0, currentScroll);

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
