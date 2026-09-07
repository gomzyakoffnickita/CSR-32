// Скролл наверх при загрузке
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  // Если в URL есть якорь — НЕ сбрасываем, а скроллим к нему
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    console.log(target);
    if (target) {
      setTimeout(() => {
        if (typeof lenis !== "undefined") {
          lenis.scrollTo(target, { duration: 1.2 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      }, 100);
    }
    return; // ← выходим, не сбрасываем в начало
  }

  // Обычный случай: просто зашли на главную
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  }, 100);
});

// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});
