import JustValidate from "just-validate";
import {
  addressRules,
  cardCvcRules,
  cardExpirationRules,
  cardNumberRules,
  cityRules,
  emailRules,
  nameRules,
  passwordRules,
  zipRules,
} from "./validation-rules";

export let quizValidator: JustValidate | null = null;

export function initValidation(): void {
  const signUpForm = document.querySelector<HTMLFormElement>(".sign-up__form");
  if (signUpForm) {
    const validator = new JustValidate(signUpForm);

    validator.addField("#email", emailRules);
    validator.addField("#first-name", nameRules);
    validator.addField("#last-name", nameRules);
    validator.addField("#password", passwordRules);
  }

  const quizForm = document.querySelector<HTMLFormElement>("#quiz-form");
  if (!quizForm) return;

  quizValidator = new JustValidate(quizForm);
  quizValidator.addField("#quizName", nameRules);
  quizValidator.addField("#quizEmail", emailRules);
}

export function initProfileValidator(): JustValidate | null {
  const profileForm = document.querySelector<HTMLFormElement>("#form-overview");
  if (!profileForm) return null;

  const profileValidator = new JustValidate(profileForm);

  profileValidator.addField("#first-name", nameRules);
  profileValidator.addField("#last-name", nameRules);
  profileValidator.addField("#address1", addressRules);
  profileValidator.addField("#address2", addressRules);
  profileValidator.addField("#city", cityRules);
  profileValidator.addField("#zip", zipRules);
  profileValidator.addField("#email", emailRules);

  return profileValidator;
}

export function paymentFormValidator(): JustValidate | null {
  const paymentForm = document.querySelector<HTMLFormElement>(
    "#profile-payment-form",
  );
  if (!paymentForm) return null;

  const paymentValidator = new JustValidate(paymentForm);

  paymentValidator.addField("#payment-card", cardNumberRules);
  paymentValidator.addField("#payment-expiration", cardExpirationRules);
  paymentValidator.addField("#payment-cvc", cardCvcRules);

  return paymentValidator;
}
