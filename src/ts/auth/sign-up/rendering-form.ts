import { registration } from "./register";
import { initValidation } from "../../utils/validate-form/validate-field";

type CustomerType = "regular" | "wholesale";

export function initSignUpForm(): void {
  const formContainer = document.querySelector<HTMLDivElement>(
    ".sign-up__form-wrapper",
  )!;

  const tabs = document.querySelectorAll<HTMLButtonElement>(".sign-up__btn");

  if (!formContainer) return;

  const formsHTML: Record<CustomerType, string> = {
    regular: `
      <form class="sign-up__form" novalidate>
        <div class="sign-up__input-block">
          <input class="sign-up__input" type="email" id="email" placeholder="Email"/>
        </div>
        <div class="sign-up__input-block">
          <input class="sign-up__input" type="text" id="first-name" placeholder="First Name"/>
        </div>
        <div class="sign-up__input-block">
          <input class="sign-up__input" type="text" id="last-name" placeholder="Last Name"/>
        </div>
        <div class="sign-up__input-block">
          <input class="sign-up__input" type="password" id="password" placeholder="Password"/>
        </div>
        <button type="submit" class="sign-up__btn-form">Create my account</button>
      </form>
    `,
    wholesale: `
      <form class="sign-up__form" novalidate>
        <div class="sign-up__input-block">
          <input class="sign-up__input" type="email" id="email" placeholder="Email"/>
        </div>
        <div class="sign-up__input-block">
          <input class="sign-up__input" type="text" id="first-name" placeholder="First Name"/>
        </div>
        <div class="sign-up__input-block">
          <input class="sign-up__input" type="text" id="last-name" placeholder="Last Name"/>
        </div>
        <div class="sign-up__input-block">
          <input class="sign-up__input" type="password" id="password" placeholder="Password"/>
        </div>
        <div class="sign-up__input-block sign-up__file">
          <label for="permission" class="sign-up__file-label">
            <span class="sign-up__file-text">Permission</span>
            <span class="sign-up__upload-btn">Upload</span>
          </label>
          <input class="sign-up__file-input" id="permission" type="file" name="permission"/>
        </div>
        <span id="permission-name" class="sign-up__file-name"></span>
        <button type="submit" class="sign-up__btn-form">Create my account</button>
      </form>
    `,
  };

  function renderForm(type: CustomerType) {
    formContainer.innerHTML = formsHTML[type];

    initValidation();

    const form = formContainer.querySelector<HTMLFormElement>(".sign-up__form");
    if (!form) return;

    registration(form);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const type = tab.dataset.type as CustomerType;
      if (!type) return;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      renderForm(type);
    });
  });

  renderForm("regular");

  tabs.forEach((t) =>
    t.dataset.type === "regular" ? t.classList.add("active") : null,
  );
}
