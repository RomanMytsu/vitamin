import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function showToast(
  message: string,
  duration = 4000,
  type: "success" | "error" = "error",
) {
  const backgroundColor =
    type === "success"
      ? "linear-gradient(to right, #00b09b, #96c93d)"
      : "linear-gradient(to right, #ff5f6d, #ffc371)";

  Toastify({
    text: message,
    duration,
    gravity: "top",
    position: "right",
    backgroundColor,
  }).showToast();
}
