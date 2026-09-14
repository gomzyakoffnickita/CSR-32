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

//Новости
document.querySelector(".news__all").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Раздел находится в разработке");
});

// Accordeon
const faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq__question");
  const answer = item.querySelector(".faq__answer");
  const answerInner = item.querySelector(".faq__answer-inner");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("is-active");

    // Закрываем все остальные пункты (режим "один открыт")
    faqItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains("is-active")) {
        otherItem.classList.remove("is-active");
        const otherAnswer = otherItem.querySelector(".faq__answer");
        const otherQuestion = otherItem.querySelector(".faq__question");
        otherAnswer.style.maxHeight = null;
        otherQuestion.setAttribute("aria-expanded", "false");
      }
    });

    // Переключаем текущий пункт
    if (isActive) {
      // Закрываем
      item.classList.remove("is-active");
      answer.style.maxHeight = null;
      question.setAttribute("aria-expanded", "false");
    } else {
      // Открываем
      item.classList.add("is-active");
      // max-height = реальная высота контента (нужна для плавной анимации)
      answer.style.maxHeight = answerInner.offsetHeight + "px";
      question.setAttribute("aria-expanded", "true");
    }
  });
});
