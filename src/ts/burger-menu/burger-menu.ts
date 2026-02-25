const initBurgerMenu = (): void => {
  const burgerBtn = document.querySelector<HTMLButtonElement>(".open-menu");
  const closeBtn = document.querySelector<HTMLButtonElement>(".close-menu");
  const menu = document.querySelector<HTMLElement>(".burger-menu");
  const body = document.body;

  if (!burgerBtn || !menu) return;

  const views = menu.querySelectorAll<HTMLElement>(".burger-menu__view");

  let activeView: string = "main";
  
  views.forEach((view) => {
    if (view.dataset.view === "main") view.classList.add("is-active");
  });

  // ---------- Работа с экранами ----------

  const showView = (name: string): void => {
    views.forEach((view) => {
      const viewName = view.dataset.view;

      view.classList.remove("is-active", "is-prev");

      if (viewName === name) {
        view.classList.add("is-active");
      } else if (viewName === activeView) {
        view.classList.add("is-prev");
      }
    });

    activeView = name;
  };

  const goBack = (): void => {
    showView("main");
  };

  const resetViews = (): void => {
    activeView = "main";

    views.forEach((view) => {
      view.classList.remove("is-active", "is-prev");

      if (view.dataset.view === "main") {
        view.classList.add("is-active");
      }
    });
  };
  // ---------- Открытие / закрытие ----------

  const openMenu = (): void => {
    menu.classList.add("is-open");
    burgerBtn.classList.add("is-active");
    body.classList.add("no-scroll");
  };

  const closeMenu = (): void => {
    menu.classList.remove("is-open");
    burgerBtn.classList.remove("is-active");
    body.classList.remove("no-scroll");
    resetViews();
  };

  const toggleMenu = (): void => {
    menu.classList.contains("is-open") ? closeMenu() : openMenu();
  };

  // ---------- События ----------

  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  closeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    closeMenu();
  });

  // Делегирование data-open / data-back
  menu.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const openBtn = target.closest<HTMLElement>("[data-open]");
    const backBtn = target.closest<HTMLElement>("[data-back]");

    if (openBtn) {
      const view = openBtn.dataset.open;
      if (view) showView(view);
    }

    if (backBtn) {
      goBack();
    }
  });

  // Клик вне меню
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Node)) return;

    if (!menu.contains(target) && !burgerBtn.contains(target)) {
      closeMenu();
    }
  });

  // Закрытие при desktop
  const mediaQuery = window.matchMedia("(min-width: 1024px)");
  mediaQuery.addEventListener("change", (e) => {
    if (e.matches) {
      closeMenu();
    }
  });
};

document.addEventListener("DOMContentLoaded", initBurgerMenu);
