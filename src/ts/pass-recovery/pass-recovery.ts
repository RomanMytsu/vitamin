import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../firebase/firebase";
import { showToast } from "../utils/toast/toast";

export function initPasswordRecovery(): void {
  const form = document.querySelector<HTMLFormElement>("#pass-recovery-form");
  if (!form) return;

  const emailInput = form.querySelector<HTMLInputElement>("#email");

  if (!emailInput) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      emailInput.classList.add("input-error");
      showToast("Please enter your email");
      return;
    }

    emailInput.classList.remove("input-error");

    try {
      await sendPasswordResetEmail(auth, email);

      showToast(
        "Password recovery email sent. Please check your email.",
        3000,
        "success",
      );

      form.reset();
    } catch (error: unknown) {
      console.error("Password recovery error:", error);

      let message = "Failed to send recovery email.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            message = "No account found with this email.";
            break;

          case "auth/invalid-email":
            message = "The email address is not valid.";
            break;

          case "auth/too-many-requests":
            message = "Too many attempts. Please try again later.";
            break;
        }
      }

      showToast(message);
    }
  });
}
