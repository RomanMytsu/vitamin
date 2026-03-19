import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { showToast } from "../../utils/toast/toast";

type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
};

export function registration(form: HTMLFormElement): void {
  const emailInput = form.querySelector<HTMLInputElement>("#email");
  const passwordInput = form.querySelector<HTMLInputElement>("#password");
  const firstNameInput = form.querySelector<HTMLInputElement>("#first-name");
  const lastNameInput = form.querySelector<HTMLInputElement>("#last-name");
  const submitButton = form.querySelector<HTMLButtonElement>(
    "button[type='submit']",
  );

  if (
    !emailInput ||
    !passwordInput ||
    !firstNameInput ||
    !lastNameInput ||
    !submitButton
  )
    return;

  const inputs = [emailInput, passwordInput, firstNameInput, lastNameInput];

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailInput.value.trim(),
        passwordInput.value.trim(),
      );

      const userData: UserProfile = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      showToast("Registration successful!", 3000, "success");
      window.location.href = "profile.html";
    } catch (error: unknown) {
      console.error("Registration error:", error);

      let message = "Registration failed. Please try again.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            message = "This email is already registered.";
            break;

          case "auth/invalid-email":
            message = "The email address is not valid.";
            break;

          case "auth/weak-password":
            message = "Password is too weak. Minimum 6 characters.";
            break;
        }
      }

      showToast(message);
    }
  });
}
