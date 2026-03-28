import {
  where,
  QueryConstraint,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { getCollectionsData, getCatalogPage } from "../../api/firestore-utils";
import { createProductCard, type Product } from "../../components/product-card";

export async function initCatalog(): Promise<void> {
  const catalog = document.querySelector(".catalog");
  if (!catalog) return;

  const toggle = catalog.querySelector<HTMLButtonElement>(".catalog__toggle");
  const list = catalog.querySelector<HTMLUListElement>(".catalog__filter-list");
  const buttons = catalog.querySelectorAll<HTMLButtonElement>(
    ".catalog__filter-btn",
  );
  const icon = toggle?.querySelector<SVGElement>("svg");
  const text = toggle?.querySelector<HTMLSpanElement>(".catalog__toggle-text");
  const itemsContainer = catalog.querySelector(".catalog__items");
  const loadMoreBtn = catalog.querySelector<HTMLButtonElement>(
    ".catalog__load-more-btn",
  );

  if (
    !toggle ||
    !list ||
    !buttons.length ||
    !icon ||
    !text ||
    !itemsContainer ||
    !loadMoreBtn
  )
    return;

  let products: Product[] = [];
  let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
  let isLoading = false;
  let currentCategory: string | null = null;
  let isSale = false;

  const isMobile = window.innerWidth < 1024;
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");
  const saleFromUrl = urlParams.get("sale");

  if (saleFromUrl === "true") {
    isSale = true;
  } else if (categoryFromUrl && categoryFromUrl !== "All categories") {
    currentCategory = categoryFromUrl;
  }

  async function loadInitial() {
    try {
      if (isMobile) {
        const params: Parameters<typeof getCatalogPage>[0] = { pageSize: 4 };
        if (currentCategory) params.category = currentCategory;
        if (isSale) params.sale = isSale;

        const { data, lastDoc: newLastDoc } =
          await getCatalogPage<Product>(params);
        products = data;
        lastDoc = newLastDoc ?? null;
      } else {
        const constraints: QueryConstraint[] = [];
        if (currentCategory && currentCategory !== "All categories")
          constraints.push(where("category", "==", currentCategory));
        if (isSale) constraints.push(where("sale", "==", true));

        products = await getCollectionsData<Product>("catalog", ...constraints);
      }

      render();
    } catch (e) {
      console.error("Ошибка загрузки:", e);
    }
  }
  function render() {
    if (!itemsContainer) return;

    if (!products.length) {
      itemsContainer.innerHTML = `<p class="catalog__empty">No products found</p>`;
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
      return;
    }

    itemsContainer.innerHTML = products
      .map((p) => createProductCard(p))
      .join("");

    if (loadMoreBtn) {
      loadMoreBtn.style.display = isMobile && !!lastDoc ? "flex" : "none";
    }
  }

  const activeBtn = Array.from(buttons).find((btn) => {
    const btnText = (btn.textContent ?? "").trim();
    if (saleFromUrl === "true") return btnText === "Sale%";
    if (categoryFromUrl) return btnText === categoryFromUrl;
    return btnText === "All categories";
  });

  if (activeBtn) {
    buttons.forEach((b) => b.classList.remove("active"));
    activeBtn.classList.add("active");
    text.textContent = activeBtn.textContent ?? "All categories";
  }

  loadMoreBtn.addEventListener("click", async () => {
    if (!isMobile || isLoading || !lastDoc) return;

    isLoading = true;

    try {
      const params: Parameters<typeof getCatalogPage>[0] = {
        pageSize: 4,
        lastDoc,
      };
      if (currentCategory && currentCategory !== "All categories")
        params.category = currentCategory;
      if (isSale) params.sale = true;

      const { data, lastDoc: newLastDoc } =
        await getCatalogPage<Product>(params);

      products = [...products, ...data];
      lastDoc = newLastDoc ?? null;

      render();
    } catch (e) {}

    isLoading = false;
  });

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    list.classList.toggle("open");
    icon.classList.toggle("rotated");
  });

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = (btn.textContent ?? "").trim();

      currentCategory = null;
      isSale = false;

      if (category === "Sale%") isSale = true;
      else if (category !== "All categories") currentCategory = category;

      const url = new URL(window.location.href);

      url.searchParams.delete("category");
      url.searchParams.delete("sale");

      if (isSale) {
        url.searchParams.set("sale", "true");
      } else if (currentCategory) {
        url.searchParams.set("category", currentCategory);
      }

      window.history.pushState({}, "", url);

      lastDoc = null;
      await loadInitial();

      if (isMobile) {
        text.textContent = category;
        list.classList.remove("open");
        icon.classList.remove("rotated");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!catalog.contains(e.target as Node)) {
      list.classList.remove("open");
      icon.classList.remove("rotated");
    }
  });

  await loadInitial();
}
