import parsePhoneNumberFromString from "libphonenumber-js";
import { updateDocument } from "../api/firestore-utils";
import { auth } from "../firebase/firebase";
import { initProfileValidator } from "../utils/validate-form/validate-field";
import { showToastSuccess } from "../utils/toast/toast";

type UserProfile = {
  firstName: string;
  lastName: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  email: string;
  phone?: string;
};

export function initProfileUpdate(): void {
  const form = document.querySelector<HTMLFormElement>("#form-overview");
  const button = document.querySelector<HTMLButtonElement>(
    "#profile-overview-btn",
  );
  if (!form || !button) return;

  const validator = initProfileValidator();
  if (!validator) return;

  button.disabled = true;
  button.classList.remove("active");

  const checkInputs = () => {
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
    const hasValue = inputs.some((input) => input.value.trim() !== "");
    button.disabled = !hasValue;
    button.classList.toggle("active", hasValue);
  };

  form.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
    input.addEventListener("input", checkInputs);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (button.disabled) return;

    const isValid = await validator.revalidate();
    if (!isValid) return;

    const user = auth.currentUser;
    if (!user) return;

    const formData = new FormData(form);

    const phoneInput = form.querySelector<HTMLInputElement>("#phone");
    const phoneError = form.querySelector<HTMLSpanElement>("#phone-error");
    let formattedPhone: string | undefined;

    if (phoneInput) {
      const phoneValue = phoneInput.value.trim();
      if (phoneValue) {
        const phoneNumber = parsePhoneNumberFromString(phoneValue);
        if (!phoneNumber || !phoneNumber.isValid()) {
          if (phoneError)
            phoneError.textContent =
              "Enter a valid phone number starting with +";
          return;
        } else {
          if (phoneError) phoneError.textContent = "";
        }
        formattedPhone = phoneNumber.formatInternational();
      }
    }

    const data: Partial<UserProfile> = {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      address1: String(formData.get("address1") ?? ""),
      address2: String(formData.get("address2") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      zip: String(formData.get("zip") ?? ""),
      email: String(formData.get("email") ?? ""),
    };
    if (formattedPhone) {
      data.phone = formattedPhone;
    }

    await updateDocument<UserProfile>("users", user.uid, data);

    showToastSuccess();
    form.reset();

    button.disabled = true;
    button.classList.remove("active");
  });
}
