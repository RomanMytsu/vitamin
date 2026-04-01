import { getCategoryClass } from "../utils/category-utils";

export type Product = {
  id: string;
  name: string;
  category: string;
  img: string;
  price: number;
  discount?: number;
  sale?: boolean;
  quantity?: number;
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

export function createBasketCard(
  product: Product,
  options?: ProductCardOptions,
): string {
  const { id, name, category, img, price, discount, sale } = product;
  const bgClass = options?.useBgClass
    ? getCategoryClass(category, "background")
    : "";
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return `
   <article class="basket__card-product">
    <div class="basket__wrapper-content">
      <a href="product-cart.html?id=${id}">
        <div class="basket__product-card-img-wrapper ${bgClass}">
          <img class="basket__img" src="${img}" alt="${name}" loading="lazy" />
        </div>
      </a>
      <div class="basket__content">
        <div class="basket__content-top">
          <div class="basket__content-title-wrapper">
            <h3 class="basket__content-name">${name}</h3>
            <button class="basket__content-delete-item" id="deleteItem">
              <span></span>
              <span></span>
            </button>
          </div>
          <div class="basket__inner">
            <div class="basket__counter-wrapper">
              <button class="basket__minus-btn" type="button">
                <svg width="16" height="16">
                  <use href="img/sprite.svg#product-card--minus"></use>
                </svg>
              </button>
              <input
                type="number"
                class="basket__count"
                value="1"
                min="1"
                step="1"
              />
              <button class="basket__plus-btn" type="button">
                <svg width="16" height="16">
                  <use href="img/sprite.svg#product-card--plus"></use>
                </svg>
              </button>
            </div>
            <div class="basket__prices-wrapper">
              ${
                sale && discount
                  ? `<span class="basket__old-price"
                >$${price.toFixed(2)}</span
              >
              <span class="basket__sale-price"
                >$${discountedPrice.toFixed(2)}</span
              >`
                  : `<span class="basket__price">$${price.toFixed(2)}</span>`
              }
            </div>
          </div>
        </div>
        <div class="basket__autoship-control">
          <label class="basket__autoship-label">
            <input type="checkbox" class="basket__autoship-checkbox" />
            <span class="basket__autoship-custom-checkbox"></span>
            <div class="basket__autoship-text">
              <p class="basket__autoship-text-desktop">Autoship every</p>
              <p class="basket__autoship-text-mob">Deliver every</p>
              <div class="basket__autoship-select-wrapper">
                <select class="basket__autoship-select">
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                </select>
              </div>
              <p class="basket__autoship-days">days</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  </article>
  `;
}

export function createCheckoutCard(
  product: Product,
  options?: ProductCardOptions,
): string {
  const { id, name, category, img, price, discount, sale, quantity } = product;
  const bgClass = options?.useBgClass
    ? getCategoryClass(category, "background")
    : "";
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return `
   <article class="checkout__card-product">
              <div class="checkout__wrapper-content">
                <a href="product-cart.html?id=${id}">
                  <div class="checkout__product-card-img-wrapper ${bgClass}">
                    <img
                      class="checkout__img"
                      src="${img}"
                      alt="${name}"
                      loading="lazy"
                    />
                  </div>
                </a>
                <div class="checkout__content">
                  <p class="checkout__content-name">
                    ${quantity}<span>x</span>${name}
                  </p>
                  <div class="checkout__prices-wrapper">
                    ${
                      sale && discount
                        ? `<span class="checkout__old-price"
                      >$${price.toFixed(2)}</span
                    >
                    <span class="checkout__sale-price"
                      >$${discountedPrice.toFixed(2)}</span
                    >`
                        : `<span class="checkout__price"
                      >$${price.toFixed(2)}</span
                    >`
                    }
                  </div>
                </div>
              </div>
            </article>
  `;
}
