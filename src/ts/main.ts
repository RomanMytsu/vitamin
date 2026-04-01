import { initBasket } from "./pages/basket/basket";
import { initBurgerMenu } from "./pages/burger-menu/burger-menu";
import { initAuthLink } from "./pages/home-page/auth-link";
import { initSwiper } from "./pages/home-page/product-swiper";
import { initAuthStatus } from "./utils/auth-status";

document.addEventListener("DOMContentLoaded", async () => {
  initBurgerMenu();
  initSwiper();
  initAuthLink();
  initAuthStatus();
  initBasket();

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
    const { initLogout } = await import("./auth/sign-out/sign-out");

    initProfileRouter();
    initSubscriptions();
    initProfileUpdate();
    initPaymentUpdate();
    initPasswordUpdate();
    initLogout();
  }

  if (page === "catalog") {
    const { initCatalogSwiper } = await import("./pages/catalog/swiper");
    const { initCatalog } = await import("./pages/catalog/catalog");

    initCatalogSwiper();
    initCatalog();
  }

  if (page === "product-card") {
    const { initProduct } = await import("./pages/product-card/product-card");
    const { initProductPromo } =
      await import("./pages/product-card/product-card-promo");

    initProduct();
    initProductPromo();
  }

  if (page === "quiz") {
    const { initQuiz } = await import("./pages/quiz/quiz");

    initQuiz();
  }

  if (page === "personal-pack") {
    const { initPersonalPack } =
      await import("./pages/personal-pack/personal-pack");

    initPersonalPack();
  }

  if (page === "sign-up") {
    const { initSignUpForm } = await import("./auth/sign-up/rendering-form");

    initSignUpForm();
  }
  if (page === "sign-in") {
    const { initSignInForm } = await import("./auth/sign-in/sign-in");

    initSignInForm();
  }
  if (page === "pass-recovery") {
    const { initPasswordRecovery } =
      await import("./auth/pass-recovery/pass-recovery");

    initPasswordRecovery();
  }

  if (page === "checkout") {
    const { initCheckout } = await import("./pages/checkout/checkout");

    initCheckout();
  }
});
