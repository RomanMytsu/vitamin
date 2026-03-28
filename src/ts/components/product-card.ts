import { getCategoryClass } from "../utils/category-utils";

export type Product = {
  id: string;
  name: string;
  category: string;
  img: string;
  price: number;
  discount?: number;
  sale?: boolean;
};

export type ProductCardOptions = {
  useBgClass?: boolean;
};

export function createProductCard(
  product: Product,
  options?: ProductCardOptions,
): string {
  const { id, name, category, img, price, discount, sale } = product;
  const textClass = getCategoryClass(category, "text");
  const bgClass = options?.useBgClass
    ? getCategoryClass(category, "background")
    : "";
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return `
    <article class="card-product">
      <a href="product-cart.html?id=${id}">
        <div class="card-product__wrapper ${sale ? "sale" : ""}">
          ${sale && discount ? `<span class="card-product__badge">-${discount}%</span>` : ""}
          <div class= "card-product__product-card-img-wrapper ${bgClass}">
           <img class="card-product__img" src="${img}" alt="${name}" loading="lazy"/>
           </div>
          <div class="card-product__content">
            <p class="card-product__category ${textClass}">${category}</p>
            <h3 class="card-product__name">${name}</h3>
            <div class="card-product__prices-wrapper">
              ${
                sale && discount
                  ? `<span class="card-product__old-price">$${price.toFixed(2)}</span>
                     <span class="card-product__sale-price">$${discountedPrice.toFixed(2)}</span>`
                  : `<span class="card-product__price">$${price.toFixed(2)}</span>`
              }
            </div>
          </div>
        </div>
      </a>
    </article>
  `;
}
