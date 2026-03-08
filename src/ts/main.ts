import "./burger-menu/burger-menu";
import { initAuthLink } from "./home-page/header";
import "./home-page/product-swiper";

import { initSignUpForm } from "./sign-up/rendering-form";

document.addEventListener("DOMContentLoaded", async () => {
  initSignUpForm();
  initAuthLink();
});
