type CustomerType = "regular" | "wholesale";

const formContainer = document.querySelector<HTMLDivElement>(
  ".sign-up__form-wrapper",
);
const tabs = document.querySelectorAll<HTMLButtonElement>(".sign-up__btn");

function renderForm(type: CustomerType): void {
  if (!formContainer) return;

  const forms: Record<CustomerType, string> = {
    regular: `
      <form class="sign-up__form" novalidate="novalidete">
            <div class="sign-up__input-block">
              <input
                class="sign-up__input"
                type="email"
                name="email"
                placeholder="Email"
                id="email"
              />
            </div>
            <div class="sign-up__input-block">
              <input
                class="sign-up__input"
                type="text"
                name="first-name"
                placeholder="First Name"
                id="first-name"
              />
            </div>
            <div class="sign-up__input-block">
              <input
                class="sign-up__input"
                type="text"
                name="last-name"
                placeholder="Last Name"
                id="last-name"
              />
            </div>
            <div class="sign-up__input-block">
              <input
                class="sign-up__input"
                type="password"
                name="password"
                placeholder="Password"
                id="password"
              />
            </div>
            <button type="submit" class="sign-up__btn-form">
              Create my account
            </button>
          </form>
    `,

    wholesale: `
      <form class="sign-up__form" novalidate="novalidete">
            <div class="sign-up__input-block">
              <input
                class="sign-up__input"
                type="email"
                name="email"
                placeholder="Email"
              />
            </div>
            <div class="sign-up__input-block">
              <input
                class="sign-up__input"
                type="text"
                name="first-name"
                placeholder="First Name"
              />
            </div>
            <div class="sign-up__input-block">
              <input
                class="sign-up__input"
                type="text"
                name="last-name"
                placeholder="Last Name"
              />
            </div>
            <div class="sign-up__input-block">
              <input
                class="sign-up__input"
                type="password"
                name="password"
                placeholder="Password"
              />
            </div>
            <button type="submit" class="sign-up__btn-form" disabled>
              Create my account
            </button>
          </form>
    `,
  };

  formContainer.innerHTML = forms[type];

  if (type === "wholesale") initWholesaleValidation();
}

function initWholesaleValidation(): void {
  if (!formContainer) return;

  const form = formContainer.querySelector<HTMLFormElement>(".sign-up__form");
  const inputs = form?.querySelectorAll<HTMLInputElement>(".sign-up__input");
  const button = form?.querySelector<HTMLButtonElement>(".sign-up__btn-form");

  if (!form || !inputs || !button) return;

  const checkInputs = () => {
    const allFilled = Array.from(inputs).every(
      (input) => input.value.trim() !== "",
    );
    button.disabled = !allFilled;
  };

  inputs.forEach((input) => input.addEventListener("input", checkInputs));

  requestAnimationFrame(checkInputs);
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const type = tab.dataset.type;

    if (type !== "regular" && type !== "wholesale") return;

    tabs.forEach((btn) => btn.classList.remove("active"));
    tab.classList.add("active");

    renderForm(type);
  });
});

renderForm("regular");

const regularBtn = document.querySelector<HTMLButtonElement>(
  '[data-type="regular"]',
);

regularBtn?.classList.add("active");
