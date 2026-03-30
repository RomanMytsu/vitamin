import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { createBasketCard, type Product } from "../../components/product-card"; // путь к файлу с твоей функцией
import { getCart, saveCart } from "../product-card/product-card";

export function initBasket(): void {
  const basketBtn = document.getElementById("basketBtn");
  const basket = document.querySelector(".basket");
  const basketWrapper = document.querySelector(".basket__wrapper");
  const content = basket?.querySelector<HTMLElement>(".basket__content-items");
  const closeBtn = document.getElementById("basketCloseBtn");
  const checkOutBtn = basket?.querySelector<HTMLButtonElement>(
    ".basket__footer-check-out-btn",
  );

  if (
    !(basketBtn instanceof HTMLElement) ||
    !(basket instanceof HTMLElement) ||
    !(basketWrapper instanceof HTMLElement) ||
    !(content instanceof HTMLElement) ||
    !(checkOutBtn instanceof HTMLButtonElement)
  )
    return;

  const basketEl = basket;
  const contentEl = content;
  const checkOutBtnEl = checkOutBtn;

  function scrollBasketContentToBottom() {
    requestAnimationFrame(() => {
      contentEl.scrollTop = contentEl.scrollHeight;
    });
  }

  function renderCart() {
    const cart = getCart();
    contentEl.innerHTML = "";

    if (!cart.length) {
      contentEl.innerHTML = `
      <div class="basket__content-empty-wrapper">
        <p class="basket__content-text">Your cart is empty</p>
      </div>
    `;
      checkOutBtnEl.textContent = "Check Out";
      return;
    }

    let total = 0;

    cart.forEach((item) => {
      total += item.price * item.count;

      const product: Product = {
        id: item.id,
        name: item.name,
        img: item.img,
        price: item.price,
        category: item.category,
      };

      const cardHtml = createBasketCard(product, { useBgClass: true });

      contentEl.insertAdjacentHTML("beforeend", cardHtml);

      const cardEl = contentEl.lastElementChild;
      if (!(cardEl instanceof HTMLElement)) return;

      const minusBtn =
        cardEl.querySelector<HTMLButtonElement>(".basket__minus-btn");
      const plusBtn =
        cardEl.querySelector<HTMLButtonElement>(".basket__plus-btn");
      const countInput =
        cardEl.querySelector<HTMLInputElement>(".basket__count");
      const deleteBtn = cardEl.querySelector<HTMLButtonElement>(
        ".basket__content-delete-item",
      );

      if (minusBtn && plusBtn && countInput) {
        countInput.value = item.count.toString();

        const updateTotal = () => {
          const totalSum = cart.reduce((sum, i) => sum + i.price * i.count, 0);
          checkOutBtnEl.innerHTML = `Check Out <span>•</span> $${totalSum.toFixed(2)}`;
          saveCart(cart);
        };

        minusBtn.addEventListener("click", () => {
          if (item.count > 1) {
            item.count -= 1;
            countInput.value = item.count.toString();
            updateTotal();
          }
        });

        plusBtn.addEventListener("click", () => {
          item.count += 1;
          countInput.value = item.count.toString();
          updateTotal();
        });

        countInput.addEventListener("input", () => {
          let value = parseInt(countInput.value) || 1;
          if (value < 1) value = 1;
          countInput.value = value.toString();
          item.count = value;
          updateTotal();
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          const index = cart.findIndex((i) => i.id === item.id);
          if (index > -1) {
            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
          }
        });
      }
    });

    checkOutBtnEl.textContent = `Check Out • $${total.toFixed(2)}`;
    scrollBasketContentToBottom();
  }

  function openBasket() {
    renderCart();
    basketEl.classList.add("visible");
    requestAnimationFrame(() => basketEl.classList.add("active"));
    disablePageScroll(document.body);
  }

  function closeBasket() {
    basketEl.classList.remove("active");
    setTimeout(() => {
      basketEl.classList.remove("visible");
      enablePageScroll(document.body);
    }, 400);
  }

  basketBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openBasket();
  });

  closeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeBasket();
  });

  basket.addEventListener("click", () => closeBasket());
  basketWrapper.addEventListener("click", (e) => e.stopPropagation());
}
