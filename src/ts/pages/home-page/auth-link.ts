import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export function initAuthLink(): void {
  const profileLink = document.querySelector<HTMLAnchorElement>("#profileLink");

  if (!profileLink) return;

  onAuthStateChanged(auth, (user) => {
    profileLink.href = user ? "profile.html" : "sign-up.html";
  });
}
