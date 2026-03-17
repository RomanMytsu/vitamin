import { initBurgerMenu } from "./burger-menu/burger-menu";
import { initAuthLink } from "./home-page/auth-link";
import { initSwiper } from "./home-page/product-swiper";
import { initSignUpForm } from "./sign-up/rendering-form";
import { initQuiz } from "./quiz/quiz";
import { initPersonalPack } from "./personal-pack/personal-pack";
import { initSignInForm } from "./sign-in/sign-in";
import { initPasswordRecovery } from "./pass-recovery/pass-recovery";
import { initLogout } from "./sign-out/sign-out";
import { initProfileRouter } from "./profile/profile-sidebar";
import { initSubscriptions } from "./profile/profile-subscriptions";
import { initProfileUpdate } from "./profile/profile-overview";

document.addEventListener("DOMContentLoaded", async () => {
  initBurgerMenu();
  initSwiper();
  initSignUpForm();
  initSignInForm();
  initAuthLink();
  initLogout();
  initPasswordRecovery();
  initQuiz();
  initPersonalPack();
  initProfileRouter();
  initSubscriptions();
  initProfileUpdate();
});
