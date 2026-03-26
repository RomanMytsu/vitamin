import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getCategoryClass } from "../../utils/category-utils";

type Product = {
  id: string;
  name: string;
  category: string;
  img: string;
  price: number;
  discount?: number;
  sale?: boolean;
};

export async function initProduct(): Promise<void> {
  if (!window.location.search.includes("id")) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    return;
  }

  try {
    const ref = doc(db, "catalog", productId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return;
    }

    const product = {
      id: snap.id,
      ...snap.data(),
    } as Product;

    const img = document.querySelector<HTMLImageElement>(".product-card__img");
    const title = document.querySelector(".product-card__title");
    const category = document.querySelector(".product-card__category");
    const price = document.querySelector(".product-card__price");
    const oldPrice = document.querySelector(".product-card__old-price");
    const salePrice = document.querySelector(".product-card__sale-price");
    const imgWrapper = document.querySelector(".product-card__img-wrapper");

    if (
      !img ||
      !title ||
      !category ||
      !price ||
      !imgWrapper ||
      !oldPrice ||
      !salePrice
    )
      return;

    const discountedPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    const textClass = getCategoryClass(product.category, "text");
    const bgClass = getCategoryClass(product.category, "background");

    img.src = product.img;
    img.alt = product.name;

    title.textContent = product.name;
    category.textContent = product.category;
    category.classList.add(textClass);
    imgWrapper.classList.add(bgClass);

    if (product.sale && product.discount) {
      oldPrice.textContent = `$${product.price.toFixed(2)}`;
      salePrice.textContent = `$${discountedPrice.toFixed(2)}`;
    } else {
      price.textContent = `$${product.price.toFixed(2)}`;
    }
  } catch (e) {
    console.error("Ошибка загрузки товара:", e);
  }
}
