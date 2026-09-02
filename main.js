//Скролл хедер блока
let lastedScroll = window.scrollY;
const headerTop = document.querySelector(".header__top");

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastedScroll) {
    headerTop.classList.add("hidden");
  } else {
    headerTop.classList.remove("hidden");
  }

  lastedScroll = currentScroll;
});

// Скролл в разделе Карьера
gsap.registerPlugin(ScrollTrigger);

const stepItems = gsap.utils.toArray(".steps__item");
const hireImgs = gsap.utils.toArray(".hire__img");

// одна функция переключения — вызываем и на старте, и при скролле
function setActive(index) {
  stepItems.forEach((item, i) =>
    item.classList.toggle("is-active", i <= index),
  );
  hireImgs.forEach((img, i) => img.classList.toggle("is-visible", i === index));
}

setActive(0); // при загрузке «1» сразу красная

ScrollTrigger.create({
  trigger: ".career__hire-steps",
  start: "top 10%", // блок прилипает, когда его верх дошёл до 20% экрана
  end: "+=1500", // 1500px «виртуального» скролла на 4 переключения
  pin: true, // GSAP сам создаст распорку — ничего не наедет
  anticipatePin: 1,
  onUpdate: (self) => {
    // self.progress = 0..1 → делим на 4 зоны
    const index = Math.min(
      stepItems.length - 1,
      Math.floor(self.progress * stepItems.length),
    );
    setActive(index);
  },
});

//Скролл Формы
const formHeading = document.querySelector(".form__title h2");
const formRight = document.querySelector(".form__title-right");
const formContact = document.querySelector(".form__contact");

gsap.set(formContact, { y: 600 }); // Изначально скрываем форму

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".form", //Блок за которым следим
    start: "top top", //Когда начать(верх блока и верх экрана)
    end: "+=2000", //Длина в пикселях
    pin: true,
    scrub: true,
  },
});

tl.to(formHeading, { x: -100 }, 0);
tl.to(formRight, { x: 100 }, "<"); //< Старт одновременно с предыдущим блоком
tl.to(formContact, { y: -300 }, 0.5); //Возвращаем в норму
