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

// Скролл в разделе Карьера
const careerSteps = document.querySelector(".career__hire-steps");
if (careerSteps) {
  const stepItems = gsap.utils.toArray(".steps__item");
  const hireImgs = gsap.utils.toArray(".hire__img");

  function setActive(index) {
    stepItems.forEach((item, i) =>
      item.classList.toggle("is-active", i <= index),
    );
    hireImgs.forEach((img, i) =>
      img.classList.toggle("is-visible", i === index),
    );
  }

  setActive(0);

  ScrollTrigger.create({
    trigger: careerSteps,
    start: "top 10%",
    end: "+=1500",
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      const index = Math.min(
        stepItems.length - 1,
        Math.floor(self.progress * stepItems.length),
      );
      setActive(index);
    },
  });
}

// Скролл Формы
const formSection = document.querySelector(".form");
if (formSection) {
  const formHeading = document.querySelector(".form__title h2");
  const formRight = document.querySelector(".form__title-right");
  const formContact = document.querySelector(".form__contact");

  gsap.set(formContact, { y: 600 });

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: formSection,
      start: "top top",
      end: "+=2000",
      pin: true,
      scrub: true,
    },
  });

  tl.to(formHeading, { x: -100 }, 0);
  tl.to(formRight, { x: 100 }, "<");
  tl.to(formContact, { y: -300 }, 0.5);
}
