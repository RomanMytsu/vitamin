import { updateDocument } from "../../api/firestore-utils";
import { auth } from "../../firebase/firebase";
import { paymentFormValidator } from "../../utils/validate-form/validate-field";
import { showToastError, showToastSuccess } from "../../utils/toast/toast";

type UserPayment = {
  cardNumber: string;
  expiration: string;
  cvc: string;
};

export function initPaymentUpdate(): void {
  const form = document.querySelector<HTMLFormElement>("#profile-payment-form");
  const button = document.querySelector<HTMLButtonElement>("#payment-btn");
  if (!form || !button) return;

  const validator = paymentFormValidator();
  if (!validator) return;

  button.disabled = true;
  button.classList.remove("active");

  const checkInputs = () => {
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
    const hasValue = inputs.every((input) => input.value.trim() !== "");
    button.disabled = !hasValue;
    button.classList.toggle("active", hasValue);
  };

  const cardInput = form.querySelector<HTMLInputElement>("#payment-card");
  if (cardInput) {
    cardInput.addEventListener("input", () => {
      let value = cardInput.value.replace(/\D/g, "");
      if (value.length > 16) value = value.slice(0, 16);
      cardInput.value = value.match(/.{1,4}/g)?.join("-") || value;
      checkInputs();
    });
  }

  const expInput = form.querySelector<HTMLInputElement>("#payment-expiration");
  if (expInput) {
    expInput.addEventListener("input", () => {
      let value = expInput.value.replace(/\D/g, "");
      if (value.length > 4) value = value.slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
      expInput.value = value;
      checkInputs();
    });
  }

  const cvcInput = form.querySelector<HTMLInputElement>("#payment-cvc");
  if (cvcInput) {
    cvcInput.addEventListener("input", () => {
      let value = cvcInput.value.replace(/\D/g, "");
      if (value.length > 3) value = value.slice(0, 3);
      cvcInput.value = value;
      checkInputs();
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (button.disabled) return;

    const isValid = await validator.revalidate();
    if (!isValid) return;

    const user = auth.currentUser;
    if (!user) return;

    const formData = new FormData(form);

    const data: UserPayment = {
      cardNumber: String(formData.get("payment-card") ?? "").replace(/\D/g, ""),
      expiration: String(formData.get("payment-expiration") ?? ""),
      cvc: String(formData.get("payment-cvc") ?? ""),
    };

    button.disabled = true;

    try {
      await updateDocument<UserPayment>("users", user.uid, {
        cardNumber: data.cardNumber,
        expiration: data.expiration,
        cvc: data.cvc,
      });
      showToastSuccess("Payment method saved successfully");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save payment method. Please try again.";
      showToastError(message);
      button.disabled = false;
    } finally {
      button.classList.remove("active");
    }
  });
}
