//Скролл хедер блока
document.body.style.overflow = "hidden"; // Изначально блокируем скролл header
setTimeout(() => {
  document.body.style.overflow = "";
}, 1000); //Разрешаем скроллить через 1 сек

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

// Выезжающие изображения друг из под друга
const teamAnimation = document.querySelector(".team__animation-wrapper");
const images = gsap.utils.toArray(".team__animation-wrapper img");

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: teamAnimation,
    start: "top 90%",
    end: "bottom 70%",
    pin: false,
    scrub: true,
  },
});

tl.fromTo(
  images[1],
  { rotateY: 25, x: 0, opacity: 0 },
  { rotateY: 0, x: -450, opacity: 1 },
  0,
);
tl.fromTo(
  images[2],
  { rotateY: -25, x: 0, opacity: 0 },
  { rotateY: 0, x: 450, opacity: 1 },
  0,
);
tl.fromTo(
  images[3],
  { rotateY: -25, y: 100, opacity: 0 },
  { rotateY: 0, y: 520, opacity: 1 },
  0.5,
);
tl.fromTo(
  images[4],
  { rotateY: -25, y: 100, opacity: 0 },
  { rotateY: 0, x: 450, y: 520, opacity: 1 },
  0.5,
);
tl.fromTo(
  images[5],
  { rotateY: -25, y: 100, opacity: 0 },
  { rotateY: 0, y: 520, x: -450, opacity: 1 },
  0.5,
);
