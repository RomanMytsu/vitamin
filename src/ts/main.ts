import { initBurgerMenu } from "./burger-menu/burger-menu";
import { initAuthLink } from "./home-page/header";
import { initSwiper } from "./home-page/product-swiper";
import { initSignUpForm } from "./sign-up/rendering-form";
import { initQuiz } from "./quiz/quiz";

document.addEventListener("DOMContentLoaded", async () => {
  initBurgerMenu();
  initSwiper();
  initSignUpForm();
  initAuthLink();
  initQuiz();
});
