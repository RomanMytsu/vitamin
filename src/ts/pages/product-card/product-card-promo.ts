import { orderBy, startAt, limit } from "firebase/firestore";
import { getCollectionsData } from "../../api/firestore-utils";
import { createProductCard, type Product } from "../../components/product-card";

export async function initProductPromo(): Promise<void> {
  const container = document.querySelector(".product-card-promo__items");

  if (!(container instanceof HTMLElement)) return;

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

  container.innerHTML = products.map((p) => createProductCard(p)).join("");
}
