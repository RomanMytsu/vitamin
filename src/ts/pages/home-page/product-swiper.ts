import Swiper from "swiper";
import "swiper/css";

export function initSwiper(): void {
  const productSlider = document.querySelector<HTMLElement>(
    ".product__slider-wrapper",
  );
  if (productSlider) {
    new Swiper(productSlider, {
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
          spaceBetween: 33,
          enabled: false,
        },
      },
    });
  }

  const reviewsSlider = document.querySelector<HTMLElement>(
    ".reviews__slider-wrapper",
  );
  if (reviewsSlider) {
    new Swiper(reviewsSlider, {
      speed: 600,
      spaceBetween: 10,
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      },
    });
  }
}
