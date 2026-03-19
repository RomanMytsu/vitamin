export function initProfileRouter(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    ".profile-sidebar__btn[data-page]",
  );

  const pages = document.querySelectorAll<HTMLElement>(".profile__page");

  function openPage(pageName: string) {
    pages.forEach((page) => {
      page.classList.toggle("active", page.dataset.page === pageName);
    });

    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === pageName);
    });

    location.hash = pageName;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;

      if (!page) return;

      openPage(page);
    });
  });

  const hash = location.hash.replace("#", "");

  if (hash) {
    openPage(hash);
  } else {
    openPage("subscriptions");
  }
}
