import { Rules } from "just-validate";

export const nameRules = [
  { rule: Rules.Required, errorMessage: "This field is required" },
  {
    rule: Rules.CustomRegexp,
    value: /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ'`\-\s]+$/,
    errorMessage: "Letters only",
  },
  { rule: Rules.MaxLength, value: 50, errorMessage: "Max 50 characters" },
];

export const emailRules = [
  { rule: Rules.Required, errorMessage: "Enter your email" },
  {
    rule: Rules.CustomRegexp,
    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
    errorMessage: "Enter a valid email",
  },
  { rule: Rules.MaxLength, value: 50, errorMessage: "Max 50 characters" },
];

export const passwordRules = [
  { rule: Rules.Required, errorMessage: "Enter your password" },
  { rule: Rules.MinLength, value: 6, errorMessage: "Minimum 6 characters" },
  { rule: Rules.MaxLength, value: 30, errorMessage: "Maximum 30 characters" },
  {
    rule: Rules.CustomRegexp,
    value: /^[A-Za-zА-Яа-яЁёІіЇїЄє0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]+$/,
    errorMessage: "Password can contain letters, numbers, Cyrillic and symbols",
  },
];

export const addressRules = [
  { rule: Rules.Required, errorMessage: "This field is required" },
  { rule: Rules.MaxLength, value: 100, errorMessage: "Max 100 characters" },
];

export const cityRules = [
  { rule: Rules.Required, errorMessage: "City is required" },
  {
    rule: Rules.CustomRegexp,
    value: /^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s-]+$/,
    errorMessage: "Only letters and spaces allowed",
  },
  { rule: Rules.MaxLength, value: 50, errorMessage: "Max 50 characters" },
];

export const stateRules = [
  { rule: Rules.Required, errorMessage: "State / Province is required" },
];

export const zipRules = [
  { rule: Rules.Required, errorMessage: "ZIP / Postal Code is required" },
  {
    rule: Rules.CustomRegexp,
    value: /^[0-9]{5}(-[0-9]{4})?$/,
    errorMessage: "Invalid ZIP code",
  },
];

export const cardNumberRules = [
  { rule: Rules.Required, errorMessage: "Card number is required" },
  {
    rule: Rules.CustomRegexp,
    value: /^(?:\d{4}[-\s]?){3}\d{4}$/,
    errorMessage: "Enter a valid 16-digit card number",
  },
];

export const cardExpirationRules = [
  { rule: Rules.Required, errorMessage: "Expiration date is required" },
  {
    rule: Rules.CustomRegexp,
    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
    errorMessage: "Use MM/YY format",
  },
];

export const cardCvcRules = [
  { rule: Rules.Required, errorMessage: "CVC is required" },
  {
    rule: Rules.CustomRegexp,
    value: /^\d{3}$/,
    errorMessage: "CVC must be 3 digits",
  },
];

export const phoneRules = [
  { rule: Rules.Required, errorMessage: "Phone number is required" },
];
