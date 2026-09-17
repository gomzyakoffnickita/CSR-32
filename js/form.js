// Форма
const form = document.querySelector(".form__contact");

// Проверяем, что форма существует на странице
if (form) {
  const formState = form.querySelector('[data-state="form"]');
  const successState = form.querySelector('[data-state="success"]');
  const resetBtn = form.querySelector(".form__success-reset");

  // Обработка отправки
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formState.classList.remove("form__state--active");
    successState.classList.add("form__state--active");
  });

  // Кнопка возврата
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      formState.classList.add("form__state--active");
      successState.classList.remove("form__state--active");
      form.reset();
    });
  }
}
