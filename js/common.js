const isMobile = window.innerWidth <= 768 || "ontouchstart" in window;

// 1. ПЕРЕХВАТ ЯКОРЯ (самая первая строка файла!)
const savedHash = window.location.hash; //Берём хэш из URL
if (savedHash) {
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
}

// 2. Отключение автосохранения скролла браузером
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// 3. При загрузке — init триггеров + скролл к якорю
window.addEventListener("load", () => {
  setTimeout(() => {
    if (typeof destroyCareerTrigger === "function") {
      destroyCareerTrigger();
      initCareerTrigger();
    }
    if (typeof destroyFormTimeline === "function") {
      destroyFormTimeline();
      initFormTimeline();
    }

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }

    if (savedHash) {
      const target = document.querySelector(savedHash);
      if (target) {
        const targetTop = window.scrollY + target.getBoundingClientRect().top;
        window.scrollTo({ top: targetTop, behavior: "instant" });
        history.replaceState(null, "", savedHash);
      }
    }
  }, 0);
});

// 4. Ресайз
if (!isMobile) {
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger === "undefined") return;
      const currentScroll = window.scrollY;

      if (typeof lenis !== "undefined") lenis.stop();

      if (typeof destroyCareerTrigger === "function") {
        destroyCareerTrigger();
        initCareerTrigger();
      }
      if (typeof destroyFormTimeline === "function") {
        destroyFormTimeline();
        initFormTimeline();
      }

      ScrollTrigger.refresh();
      window.scrollTo(0, currentScroll);

      if (typeof lenis !== "undefined") lenis.start();
    }, 250);
  });
}

// 5. Lenis + ScrollTrigger интеграция

let lenis;
if (!isMobile && typeof Lenis !== "undefined") {
  lenis = new Lenis({ autoRaf: false });

  if (typeof ScrollTrigger !== "undefined") {
    lenis.on("scroll", ScrollTrigger.update);
  }

  // Запуск цикла анимации — ТОЛЬКО внутри проверки
  if (typeof gsap !== "undefined" && gsap.ticker) {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

// 6. Клик по якорям на самой странице
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href === "#" || !href) return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const targetTop = window.scrollY + target.getBoundingClientRect().top;

    if (typeof lenis !== "undefined" && typeof lenis.scrollTo === "function") {
      lenis.stop();
      lenis.start();
      lenis.scrollTo(targetTop, { duration: 1.2 });
    } else {
      // Fallback: нативный плавный скролл
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }

    history.pushState(null, "", href);
  });
});

// 7. Бургер
const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");
if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    burger.classList.toggle("is-active");

    // Защита: lenis может быть undefined на мобильном
    if (typeof lenis !== "undefined") {
      isOpen ? lenis.stop() : lenis.start();
    }
  });
}
