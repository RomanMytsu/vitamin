import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";

export function initCatalogSwiper() {
  const swiper = new Swiper(".catalog-hero__swiper-container", {
    modules: [Navigation, Pagination],

    loop: true,
    speed: 600,

    initialSlide: 0,

    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 10,

    pagination: {
      el: ".catalog-hero__pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".catalog-hero__next-btn",
      prevEl: ".catalog-hero__prev-btn",
    },

    breakpoints: {
      320: {
        initialSlide: 0,
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false,
      },
      1024: {
        slidesPerView: 1.28,
        centeredSlides: true,
        spaceBetween: 30,
        initialSlide: 1,
        loop: true,
      },
      1800: {
        slidesPerView: 1.28,
        centeredSlides: true,
        spaceBetween: 50,
      },
    },
  });

  return swiper;
}
