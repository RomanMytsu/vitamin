import {
  initValidation,
  quizValidator,
} from "../../utils/validate-form/validate-field";

type QuizStep = HTMLElement;

type QuizData = {
  quizName: string;
  quizEmail: string;
  [key: string]: FormDataEntryValue;
};

type QuizState = {
  currentStep: number;
};

export function initQuiz(): void {
  const quiz = document.getElementById("quiz");
  if (!quiz) return;

  const form = document.querySelector<HTMLFormElement>("#quiz-form");
  if (!(form instanceof HTMLFormElement)) return;

  const formEl: HTMLFormElement = form;

  const steps: QuizStep[] = Array.from(
    quiz.querySelectorAll<QuizStep>(".quiz__step"),
  );

  if (!steps.length) return;

  const currentEl = document.getElementById("quiz-current");
  const totalEl = document.getElementById("quiz-total");

  if (totalEl) totalEl.textContent = String(steps.length);

  const state: QuizState = {
    currentStep: 0,
  };

  function updateCounter(): void {
    if (currentEl) currentEl.textContent = String(state.currentStep + 1);
  }

  steps.forEach((step) => step.classList.remove("active"));

  const firstStep = steps[0];
  if (firstStep) {
    firstStep.classList.add("active");
  }

  updateCounter();

  function showStep(index: number): void {
    steps.forEach((step) => step.classList.remove("active"));

    const step = steps[index];
    if (!step) return;

    step.classList.add("active");
    state.currentStep = index;

    updateCounter();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  initValidation();

  function goNext(): void {
    if (state.currentStep === steps.length - 1) {
      const formData = new FormData(formEl);

      const quizName = formData.get("quizName");
      const quizEmail = formData.get("quizEmail");

      if (typeof quizName !== "string" || typeof quizEmail !== "string") {
        return;
      }

      const data: QuizData = {
        quizName,
        quizEmail,
      };

      localStorage.setItem("quizData", JSON.stringify(data));
      window.location.href = "personal-pack.html";
      return;
    }

    showStep(state.currentStep + 1);
  }

  function nextStep(): void {
    if (!quizValidator) return;

    const step = steps[state.currentStep];
    if (!step) return;

    const nameInput = step.querySelector<HTMLInputElement>("#quizName");
    const emailInput = step.querySelector<HTMLInputElement>("#quizEmail");

    if (nameInput) {
      quizValidator.revalidateField("#quizName").then((isValid) => {
        if (!isValid) return;
        goNext();
      });
      return;
    }

    if (emailInput) {
      quizValidator.revalidateField("#quizEmail").then((isValid) => {
        if (!isValid) return;
        goNext();
      });
      return;
    }

    goNext();
  }

  function prevStep(): void {
    if (state.currentStep === 0) {
      window.location.href = "/";
      return;
    }

    showStep(state.currentStep - 1);
  }

  quiz.querySelectorAll<HTMLButtonElement>(".quiz__next-btn").forEach((btn) => {
    const step = btn.closest<QuizStep>(".quiz__step");
    if (!step) return;

    const inputs = step.querySelectorAll<HTMLInputElement>(
      "input[type=text], input[type=email]",
    );

    inputs.forEach((input) => {
      btn.disabled = input.value.trim().length === 0;

      input.addEventListener("input", () => {
        const hasValue = input.value.trim().length > 0;

        btn.disabled = !hasValue;
        btn.classList.toggle("active", hasValue);
      });
    });

    btn.addEventListener("click", nextStep);
  });

  steps.forEach((step) => {
    const radios = step.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]',
    );

    if (!radios.length) return;

    radios.forEach((radio) => {
      radio.addEventListener("change", () => {
        setTimeout(nextStep, 150);
      });
    });
  });

  quiz.querySelectorAll<HTMLButtonElement>(".quiz__btn-back").forEach((btn) => {
    btn.addEventListener("click", prevStep);
  });
}
