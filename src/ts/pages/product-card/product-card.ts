import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getCategoryClass } from "../../utils/category-utils";
import { showToastError, showToastSuccess } from "../../utils/toast/toast";
import type { Product } from "../../components/product-card";

// type Product = {
//   id: string;
//   name: string;
//   category: string;
//   img: string;
//   price: number;
//   discount?: number;
//   sale?: boolean;
// };

type CartItem = {
  id: string;
  name: string;
  price: number;
  img: string;
  count: number;
  category: string;
  discount?: number;
  sale?: boolean;
};

const CART_KEY = "cart";

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCart(): CartItem[] {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function addToCart(item: CartItem) {
  const cart = getCart();

  const existing = cart.find((i) => i.id === item.id);

  if (existing) {
    existing.count += item.count;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

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
      showToastError("Product not found");
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

    const minusBtn = document.querySelector<HTMLButtonElement>(
      ".product-card__minus-btn",
    );
    const plusBtn = document.querySelector<HTMLButtonElement>(
      ".product-card__plus-btn",
    );
    const countEl = document.querySelector<HTMLInputElement>(
      ".product-card__count",
    );
    const addToCartBtn = document.querySelector<HTMLButtonElement>(
      ".product-card__ordered-btn",
    );

    if (
      !img ||
      !title ||
      !category ||
      !price ||
      !imgWrapper ||
      !oldPrice ||
      !salePrice ||
      !minusBtn ||
      !plusBtn ||
      !countEl ||
      !addToCartBtn
    ) {
      showToastError("Elements not found");
      return;
    }

    const basePrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    let count = 1;

    function updatePrice() {
      countEl!.value = String(count);

      const total = basePrice * count;
      const formatted = `$${total.toFixed(2)}`;

      if (product.sale && product.discount) {
        salePrice!.textContent = formatted;
      } else {
        price!.textContent = formatted;
      }
    }

    plusBtn.addEventListener("click", () => {
      count += 1;
      updatePrice();
    });

    minusBtn.addEventListener("click", () => {
      if (count > 1) {
        count -= 1;
        updatePrice();
      }
    });

    countEl.addEventListener("input", () => {
      let value = Number(countEl.value);

      if (!value || value < 1) {
        value = 1;
      }

      value = Math.floor(value);

      count = value;
      updatePrice();
    });

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

    addToCartBtn.addEventListener("click", () => {
      try {
        const item: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.img,
          count: count,
          category: product.category,
          ...(product.discount !== undefined && { discount: product.discount }),
          ...(product.sale !== undefined && { sale: product.sale }),
        };

        addToCart(item);

        showToastSuccess(`${product.name} added to cart`);
      } catch (e) {
        showToastError("Failed to add to cart");
      }
    });
  } catch (e) {
    showToastError("Failed to load product");
  }
}
