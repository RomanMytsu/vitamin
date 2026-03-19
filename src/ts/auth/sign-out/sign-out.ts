import { signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../../firebase/firebase";
import { showToast } from "../../utils/toast/toast";

export function initLogout(): void {
  const logoutButton = document.querySelector<HTMLButtonElement>("#sign-out");

  if (!logoutButton) return;

  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);

      showToast("You have been logged out.", 3000, "success");

      window.location.href = "sign-in.html";
    } catch (error: unknown) {
      console.error("Logout error:", error);

      let message = "Failed to logout.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/network-request-failed":
            message = "Network error. Please try again.";
            break;
        }
      }

      showToast(message);
    }
  });
}
