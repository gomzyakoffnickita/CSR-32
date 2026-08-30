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




