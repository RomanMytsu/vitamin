import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

export function initAuthLink(): void {
  const profileLink = document.querySelector<HTMLAnchorElement>("#profileLink");

  if (!profileLink) return;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      profileLink.href = "profile.html";
    } else {
      profileLink.href = "sign-up.html";
    }
  });
}
