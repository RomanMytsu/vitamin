import { initBurgerMenu } from "./pages/burger-menu/burger-menu";
import { initAuthLink } from "./pages/home-page/auth-link";
import { initSwiper } from "./pages/home-page/product-swiper";
import { initSignUpForm } from "./auth/sign-up/rendering-form";
import { initQuiz } from "./pages/quiz/quiz";
import { initPersonalPack } from "./pages/personal-pack/personal-pack";
import { initSignInForm } from "./auth/sign-in/sign-in";
import { initPasswordRecovery } from "./auth/pass-recovery/pass-recovery";
import { initLogout } from "./auth/sign-out/sign-out";

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
  const page = document.body.dataset.page;

  if (page === "profile") {
    const { initProfileRouter } =
      await import("./pages/profile/profile-sidebar");
    const { initSubscriptions } =
      await import("./pages/profile/profile-subscriptions");
    const { initProfileUpdate } =
      await import("./pages/profile/profile-overview");
    const { initPaymentUpdate } =
      await import("./pages/profile/profile-payment");
    const { initPasswordUpdate } =
      await import("./pages/profile/profile-password");

    initProfileRouter();
    initSubscriptions();
    initProfileUpdate();
    initPaymentUpdate();
    initPasswordUpdate();
  }

  if (page === "catalog") {
    const { initCatalogSwiper } = await import("./pages/catalog/swiper");
    const { initCatalog } = await import("./pages/catalog/catalog");

    initCatalogSwiper();
    initCatalog();
  }
});
