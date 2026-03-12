import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  type FirestoreDataConverter,
  QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";

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

const productConverter: FirestoreDataConverter<Product> = {
  toFirestore(product: Product) {
    return product;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): Product {
    const data = snapshot.data(options);

    return {
      name: data.name,
      category: data.category,
      img: data.img,
      price: data.price,
    };
  },
};

export async function initPersonalPack(): Promise<void> {
  const userDataStr = localStorage.getItem("quizData");
  if (!userDataStr) return;

  let quizData: QuizData;

  try {
    const parsed = JSON.parse(userDataStr);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "quizName" in parsed &&
      typeof parsed.quizName === "string"
    ) {
      quizData = parsed as QuizData;
    } else {
      return;
    }
  } catch (error) {
    console.error("Invalid quizData", error);
    return;
  }

  const nameEl = document.getElementById("user-name");
  if (nameEl) nameEl.textContent = quizData.quizName;

  const catalogRef = collection(db, "catalog").withConverter(productConverter);

  const snapshot = await getDocs(catalogRef);

  const products = snapshot.docs.map((doc) => doc.data());

  const shuffled = [...products].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);

  const container = document.querySelector(".personal-pack__card-wrapper");

  if (!(container instanceof HTMLElement)) return;

  container.innerHTML = selected
    .map(
      (p) => `
<div class="personal-pack__product-card">
  <div class="personal-pack__wrapper">
    <a href="#" class="personal-pack__link">
      <div class="personal-pack__image-wrapper">
        <img class="personal-pack__image" src="${p.img}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="personal-pack__card-content">
        <p class="personal-pack__category">${p.category}</p>
        <h3 class="personal-pack__content-name">${p.name}</h3>
        <div class="personal-pack__price-wrapper">
          <span class="personal-pack__price">${p.price}</span>
        </div>
      </div>
    </a>
  </div>
</div>
`,
    )
    .join("");
}
