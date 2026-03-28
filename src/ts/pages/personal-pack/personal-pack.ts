import { limit, orderBy, startAt } from "firebase/firestore";
import { getCollectionsData } from "../../api/firestore-utils";
import { createProductCard, type Product } from "../../components/product-card";

type QuizData = {
  quizName: string;
  quizEmail: string;
  [key: string]: unknown;
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

  const random = Math.random();

  const products = await getCollectionsData<Product>(
    "catalog",
    orderBy("random"),
    startAt(random),
    limit(4),
  );

  if (products.length < 4) {
    const extra = await getCollectionsData<Product>(
      "catalog",
      orderBy("random"),
      limit(4 - products.length),
    );

    products.push(...extra);
  }

  const container = document.querySelector(".personal-pack__card-wrapper");

  if (!(container instanceof HTMLElement)) return;

  container.innerHTML = products.map((p) => createProductCard(p)).join("");
}
