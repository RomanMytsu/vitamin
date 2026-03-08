import JustValidate, { Rules } from "just-validate";

export function initValidation(): void {
  const form = document.querySelector<HTMLFormElement>(".sign-up__form");
  if (!form) return;

  const validator = new JustValidate(form);

  validator.addField("#email", [
    { rule: Rules.Required, errorMessage: "Please enter your email" },
    {
      rule: Rules.CustomRegexp,
      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      errorMessage:
        "Email must contain only lowercase letters, numbers",
    },
    {
      rule: Rules.MaxLength,
      value: 50,
      errorMessage: "Email must be no longer than 50 characters",
    },
  ]);

  validator.addField("#first-name", [
    { rule: Rules.Required, errorMessage: "Please enter your first name" },
    {
      rule: Rules.CustomRegexp,
      value: /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'`\-\s]+$/,
      errorMessage: "Only letters and symbols (' - `) are allowed",
    },
    {
      rule: Rules.MaxLength,
      value: 50,
      errorMessage: "First name must be no longer than 50 characters",
    },
  ]);

  validator.addField("#last-name", [
    { rule: Rules.Required, errorMessage: "Please enter your last name" },
    {
      rule: Rules.CustomRegexp,
      value: /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'`\-\s]+$/,
      errorMessage: "Only letters and symbols (' - `) are allowed",
    },
    {
      rule: Rules.MaxLength,
      value: 50,
      errorMessage: "Last name must be no longer than 50 characters",
    },
  ]);

  validator.addField("#password", [
    { rule: Rules.Required, errorMessage: "Please enter your password" },
    {
      rule: Rules.MinLength,
      value: 6,
      errorMessage: "Password must be at least 6 characters",
    },
    {
      rule: Rules.MaxLength,
      value: 30,
      errorMessage: "Password must be no longer than 30 characters",
    },
    {
      rule: Rules.CustomRegexp,
      value: /^[A-Za-zА-Яа-яЁёІіЇїЄє0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/,
      errorMessage:
        "Password can contain letters, numbers, Cyrillic and symbols",
    },
  ]);
}
