import { getCollectionsData } from "../../api/firestore-utils";
import { getCategoryClass } from "../../utils/category-utils";

type QuizData = {
  quizName: string;
  quizEmail: string;
  [key: string]: unknown;
};

type Product = {
  name: string;
  category: string;
  img: string;
  price: number;
};

function getLocalStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function initPersonalPack(): Promise<void> {
  const userData = getLocalStorage<QuizData>("quizData");
  if (!userData) return;

  const nameEl = document.getElementById("user-name");
  if (nameEl) nameEl.textContent = userData.quizName;

  const products = await getCollectionsData<Product>("catalog");

  const shuffled = [...products].sort(() => Math.random() - 0.5);

  const selected = shuffled.slice(0, 4);

  const container = document.querySelector(".personal-pack__card-wrapper");

  if (!(container instanceof HTMLElement)) return;

  container.innerHTML = selected
    .map(({ category, img, name, price }) => {
      const textClass = getCategoryClass(category, "text");
      return `
      <div class="personal-pack__product-card">
  <div class="personal-pack__wrapper">
    <a href="#" class="personal-pack__link">
      <div class="personal-pack__image-wrapper">
        <img class="personal-pack__image" src="${img}" alt="${name}" loading="lazy" />
      </div>
      <div class="personal-pack__card-content">
        <p class="personal-pack__category ${textClass}">${category}</p>
        <h3 class="personal-pack__content-name">${name}</h3>
        <div class="personal-pack__price-wrapper">
          <span class="personal-pack__price">${price}</span>
        </div>
      </div>
    </a>
  </div>
  </div>
`;
    })
    .join("");
}
