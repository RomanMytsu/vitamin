import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase/firebase";
import { showToast } from "../utils/toast/toast";

export function initSignInForm(): void {
  const form = document.querySelector<HTMLFormElement>("#sign-in-form");
  if (!form) return;

  const emailInput = form.querySelector<HTMLInputElement>("#email");
  const passwordInput = form.querySelector<HTMLInputElement>("#password");
  const submitButton = form.querySelector<HTMLButtonElement>(
    "button[type='submit']",
  );

  if (!emailInput || !passwordInput || !submitButton) return;

  const inputs = [emailInput, passwordInput];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emptyFields = inputs.filter((input) => input.value.trim() === "");
    if (emptyFields.length > 0) {
      emptyFields.forEach((input) => input.classList.add("input-error"));
      showToast("Please fill in all fields");
      return;
    }

    inputs.forEach((input) => input.classList.remove("input-error"));

    try {
      await signInWithEmailAndPassword(
        auth,
        emailInput.value.trim(),
        passwordInput.value,
      );

      showToast("Login successful!", 3000, "success");
      window.location.href = "profile.html";
    } catch (error: unknown) {
      console.error("Login error:", error);

      let message = "Login failed. Please check your credentials.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            message = "No user found with this email.";
            break;
          case "auth/wrong-password":
            message = "Incorrect password.";
            break;
          case "auth/invalid-email":
            message = "The email address is not valid.";
            break;
        }
      }

      showToast(message);
    }
  });
}
