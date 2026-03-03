import Swiper from "swiper";
import "swiper/css";

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector<HTMLElement>(
    ".product__slider-wrapper",
  );
  if (!slider) return;

  new Swiper(slider, {
    spaceBetween: 10,
    speed: 500,

    breakpoints: {
      0: {
        slidesPerView: 1.06,
        spaceBetween: 10,
        enabled: true,
      },
      768: {
        slidesPerView: 2,
        enabled: false,
      },
      1024: {
        slidesPerView: 2,
        enabled: false,
        spaceBetween: 33,
      },
    },
  });
});
