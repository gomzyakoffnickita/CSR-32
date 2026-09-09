//Запрещаем скролл хедер блока на 1 сек
if (typeof lenis !== "undefined") {
  lenis.stop(); //Ленис перестаёт работать
}
document.body.style.overflow = "hidden"; // Изначально блокируем скролл header
setTimeout(() => {
  document.body.style.overflow = "";
  if (typeof lenis !== "undefined") {
    lenis.start();
  }
}, 1000); //Разрешаем скроллить через 1 сек

//Скролл хедер меню
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

let careerTrigger = null; // храним ссылку на триггер, для того, чтобы потом её kill

//Создаем функцию "Создания триггера"
function initCareerTrigger() {
  if (!careerSteps) return;

  const stepItems = gsap.utils.toArray(".steps__item");
  const hireImgs = gsap.utils.toArray(".hire__img");

  function setActive(index) {
    stepItems.forEach(
      (item, i) => item.classList.toggle("is-active", i <= index), //  Добавляем класс, если номер шага меньше или равен текущему
    );
    hireImgs.forEach(
      (img, i) => img.classList.toggle("is-visible", i === index), // Добавляем класс, если номер равен шагу
    );
  }

  function updateClasses(progress) {
    const index = Math.min(
      stepItems.length - 1,
      Math.floor(progress * stepItems.length),
    );
    setActive(index);
  }

  setActive(0);

  // Создаём триггер и сохраняем ссылку
  careerTrigger = ScrollTrigger.create({
    id: "careerSteps",
    trigger: careerSteps,
    start: "top 10%",
    end: () => "+=1300",
    pin: true,
    onUpdate: (self) => updateClasses(self.progress),
    onRefresh: (self) => updateClasses(self.progress),
  });
}

function destroyCareerTrigger() {
  if (careerTrigger) {
    careerTrigger.kill(true); // true = убрать пин-спейсер и очистить инлайны
    careerTrigger = null;
  }
}

// Запускаем при загрузке
initCareerTrigger();

// Скролл Формы
const formSection = document.querySelector(".form");
let formTimeline = null;

function initFormTimeline() {
  if (!formSection) return;

  const formHeading = document.querySelector(".form__title h2");
  const formRight = document.querySelector(".form__title-right");
  const formContact = document.querySelector(".form__contact");

  if (!formHeading || !formRight || !formContact) return;

  // Определяем, мобилка или десктоп
  const isMobile = window.innerWidth <= 768;

  gsap.set([formHeading, formRight, formContact], {
    clearProps: "transform",
  });
  gsap.set(formContact, { y: 600 });

  formTimeline = gsap.timeline({
    scrollTrigger: {
      id: "formPin",
      trigger: formSection,
      start: "top top",
      end: () => (isMobile ? "+=500" : "+=2000"), // ← адаптивная длина
      pin: true,
      scrub: true,
    },
  });

  // На десктопе добавляем разъезд заголовков
  if (!isMobile) {
    formTimeline.to(formHeading, { x: -100 }, 0);
    formTimeline.to(formRight, { x: 100 }, "<");
  }

  // На всех экранах форма поднимается
  formTimeline.to(formContact, { y: -300 }, 0.5);
}

function destroyFormTimeline() {
  if (formTimeline) {
    if (formTimeline.scrollTrigger) {
      formTimeline.scrollTrigger.kill(true);
    }
    formTimeline.kill();
    formTimeline = null;
  }
}

initFormTimeline();

//Новости
document.querySelector(".news__all").addEventListener("click", () => {
  alert("Раздел находится в разработке");
});
