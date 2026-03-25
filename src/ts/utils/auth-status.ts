import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export function initAuthStatus(): void {
  if (!window.location.pathname.includes("profile.html")) return;

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "sign-up.html";
    }
  });
}


