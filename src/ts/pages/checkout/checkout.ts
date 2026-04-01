import { AsYouType, parsePhoneNumberFromString } from "libphonenumber-js";
import { getCart } from "../product-card/product-card";
import {
  createCheckoutCard,
  type Product,
} from "../../components/product-card";
import { createDocument } from "../../api/firestore-utils";
import { initCheckoutValidator } from "../../utils/validate-form/validate-field";
import { showToastError, showToastSuccess } from "./../../utils/toast/toast";

export function initCheckout(): void {
  const orderItemsEl = document.querySelector<HTMLDivElement>(
    ".checkout__order-items",
  );
  const subtotalEl = document.querySelector<HTMLSpanElement>(
    ".checkout__order-price",
  );
  const discountEl = document.querySelector<HTMLSpanElement>(
    ".checkout__order-discount",
  );
  const shippingEl = document.querySelector<HTMLSpanElement>(
    ".checkout__order-shipping",
  );
  const totalEl = document.querySelectorAll<HTMLSpanElement>(
    ".checkout__order-total",
  );
  const discountRow = document.querySelector<HTMLElement>(
    ".checkout__order-pricing.discount",
  );

  const wrapper = document.querySelector<HTMLElement>(
    ".checkout__order-wrapper",
  );
  const content = document.querySelector<HTMLElement>(
    ".checkout__order-content",
  );
  const toggle = document.querySelector<HTMLElement>(
    ".checkout__order-mob-header",
  );
  const form = document.querySelector<HTMLFormElement>("#checkoutForm");
  const phoneInput = form?.querySelector<HTMLInputElement>("#phone");
  const phoneError = form?.querySelector<HTMLSpanElement>("#phone-error");

  const cardInput = form?.querySelector<HTMLInputElement>("#payment-card");
  const expInput = form?.querySelector<HTMLInputElement>("#payment-expiration");
  const cvcInput = form?.querySelector<HTMLInputElement>("#payment-cvc");

  if (
    !orderItemsEl ||
    !subtotalEl ||
    !discountEl ||
    !shippingEl ||
    !totalEl.length ||
    !discountRow ||
    !wrapper ||
    !content ||
    !toggle ||
    !form ||
    !cardInput ||
    !expInput ||
    !cvcInput
  )
    return;

  if (!toggle.hasAttribute("data-accordion-init")) {
    toggle.setAttribute("data-accordion-init", "true");
    toggle.addEventListener("click", () => {
      const isOpen = wrapper.classList.contains("active");
      if (isOpen) {
        content.style.maxHeight = "";
        wrapper.classList.remove("active");
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
        wrapper.classList.add("active");
      }
    });
  }

  const cart = getCart();
  let subtotal = 0;
  let discount = 0;
  const shippingCost = 9.2;

  if (!cart.length) {
    subtotalEl.textContent = "$0.00";
    discountEl.textContent = "$0.00";
    shippingEl.textContent = "$0.00";
    totalEl.forEach((el) => (el.textContent = "$0.00"));
    discountRow.style.display = "none";
    updateAccordionHeight(wrapper, content);
    return;
  }

  orderItemsEl.innerHTML = "";
  cart.forEach((item) => {
    subtotal += item.price * item.count;
    if (item.discount)
      discount += item.price * item.count * (item.discount / 100);
    const product: Product = {
      id: item.id,
      name: item.name,
      img: item.img,
      price: item.price,
      category: item.category,
      quantity: item.count,
      ...(item.discount !== undefined && { discount: item.discount }),
      ...(item.sale !== undefined && { sale: item.sale }),
    };
    orderItemsEl.insertAdjacentHTML(
      "beforeend",
      createCheckoutCard(product, { useBgClass: true }),
    );
  });

  if (discount > 0) {
    discountRow.style.display = "flex";
    discountEl.textContent = `-$${discount.toFixed(2)}`;
  } else {
    discountRow.style.display = "none";
  }

  const total = subtotal - discount + shippingCost;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shippingCost.toFixed(2)}`;
  totalEl.forEach((el) => (el.textContent = `$${total.toFixed(2)}`));
  updateAccordionHeight(wrapper, content);

  const validator = initCheckoutValidator();
  if (!validator) return;

 if (phoneInput) {
   phoneInput.addEventListener("input", (e: Event) => {
     const target = e.target;
     if (!(target instanceof HTMLInputElement)) return;

     let value = target.value.replace(/[^\d+]/g, "");

     if (!value.startsWith("+")) {
       value = "+" + value.replace(/\D/g, "");
     }

     const formatter = new AsYouType();
     target.value = formatter.input(value);
   });
 }
  cardInput.addEventListener("input", () => {
    let value = cardInput.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    cardInput.value = value.match(/.{1,4}/g)?.join("-") || value;
  });

  expInput.addEventListener("input", () => {
    let value = expInput.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    expInput.value = value;
  });

  cvcInput.addEventListener("input", () => {
    let value = cvcInput.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    cvcInput.value = value;
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid = await validator.revalidate();
    if (!isValid) return;

    const formData = new FormData(form);
    const customer = Object.fromEntries(formData.entries());

    if (!cart.length) {
      showToastError("Cart is empty");
      return;
    }

    let formattedPhone: string | undefined;

    if (phoneInput) {
      const phoneValue = phoneInput.value.trim();

      if (phoneValue) {
        const phoneNumber = parsePhoneNumberFromString(phoneValue);

        if (!phoneNumber || !phoneNumber.isValid()) {
          phoneError && (phoneError.textContent = "Enter a valid phone number");
          showToastError("Enter a valid phone number");
          return;
        }

        phoneError && (phoneError.textContent = "");
        formattedPhone = phoneNumber.formatInternational();
      }
    }

    const cardNumber = String(formData.get("payment-card") ?? "").replace(
      /\D/g,
      "",
    );
    const expiration = String(formData.get("payment-expiration") ?? "");
    const cvc = String(formData.get("payment-cvc") ?? "");

    if (cardNumber.length !== 16) {
      showToastError("Enter a valid 16-digit card number");
      return;
    }

    const [monthStr, yearStr] = expiration.split("/");
    if (!monthStr || !yearStr) {
      showToastError("Enter valid expiration date");
      return;
    }

    const month = parseInt(monthStr, 10);
    const year = parseInt("20" + yearStr, 10);

    if (month < 1 || month > 12) {
      showToastError("Invalid month");
      return;
    }

    const now = new Date();
    const expDate = new Date(year, month - 1, 1);

    if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
      showToastError("Card has expired");
      return;
    }

    if (!/^\d{3}$/.test(cvc)) {
      showToastError("CVC must be 3 digits");
      return;
    }

    const order = {
      customer: { ...customer, phone: formattedPhone },
      payment: { cardNumber, expiration, cvc },
      items: cart,
      pricing: { subtotal, discount, shipping: shippingCost, total },
      createdAt: new Date().toISOString(),
    };

    try {
      await createDocument("orders", order);
      localStorage.removeItem("cart");
      form.reset();
      showToastSuccess("Order placed successfully");
      window.location.href = "checkout-successfully.html";
    } catch {
      showToastError("Error placing order");
    }
  });

  function updateAccordionHeight(
    wrapper: HTMLElement,
    content: HTMLElement,
  ): void {
    if (wrapper.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  }
}
