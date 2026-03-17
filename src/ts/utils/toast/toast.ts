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

export function showToastSuccess() {
  const checkIcon = `
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M20 1.50892L7.28471 14L0 6.84375L1.536 5.33483L7.28471 10.9822L18.464 0L20 1.50892Z" fill="white" />
</svg>
  `;

  Toastify({
    node: (() => {
      const toast = document.createElement("div");
      toast.innerHTML = `${checkIcon}Changes successfully saved`;
      return toast;
    })(),
    duration: 4000,
    gravity: "top",
    position: "center",
    style: {
      background: "#a2c94f",
      borderRadius: "12px",
      width: "336px",
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Open Sans, sans-serif",
      fontWeight: "600",
      fontSize: "16px",
      color: "#fff",
      padding: "17px 50px 17px 40px",
      boxSizing: "border-box",
      gap: "15px",
    },
  }).showToast();
}
