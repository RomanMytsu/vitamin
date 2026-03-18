import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { showToastError, showToastSuccess } from "../utils/toast/toast";
import { changePasswordValidator } from "./../utils/validate-form/validate-field";

type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function initPasswordUpdate(): void {
  const form = document.querySelector<HTMLFormElement>("#profile-password");
  const button = document.querySelector<HTMLButtonElement>("#password-btn");

  if (!form || !button) return;

  const validator = changePasswordValidator();
  if (!validator) return;

  button.disabled = true;
  button.classList.remove("active");

  const checkInputs = () => {
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
    const hasValue = inputs.every((input) => input.value.trim() !== "");
    button.disabled = !hasValue;
    button.classList.toggle("active", hasValue);
  };

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", checkInputs);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (button.disabled) return;

    const isValid = await validator.revalidate();
    if (!isValid) return;

    const user = auth.currentUser;
    if (!user || !user.email) {
      showToastError("User not authenticated");
      return;
    }

    const formData = new FormData(form);

    const data: PasswordFormData = {
      currentPassword: String(formData.get("current-password") ?? ""),
      newPassword: String(formData.get("new-password") ?? ""),
      confirmPassword: String(formData.get("confirm-password") ?? ""),
    };

    if (data.currentPassword === data.newPassword) {
      showToastError("The new password matches the old one");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      showToastError("The passwords do not match");
      return;
    }

    button.disabled = true;

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword,
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, data.newPassword);

      showToastSuccess("Password updated successfully");
      form.reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update password. Please try again.";

      showToastError(message);
      button.disabled = false;
    } finally {
      button.classList.remove("active");
    }
  });
}
