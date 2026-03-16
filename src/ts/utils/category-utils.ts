type CategoryStyles = {
  text: string;
  background: string;
};

const categoryStyles: Record<string, CategoryStyles> = {
  "Vitamins & Dietary Supplements": {
    text: "category--vitamins",
    background: "category-bg--vitamins",
  },
  Minerals: {
    text: "category--minerals",
    background: "category-bg--minerals",
  },
  "Prenatal Vitamins": {
    text: "category--prenatal-vitamins",
    background: "category-bg--prenatal-vitamins",
  },
  "Pain Relief": {
    text: "category--pain",
    background: "category-bg--pain",
  },
  Antioxidants: {
    text: "category--antioxidants",
    background: "category-bg--antioxidants",
  },
  "Weight Loss": {
    text: "category--loss",
    background: "category-bg--loss",
  },
  Probiotics: {
    text: "category--probiotics",
    background: "category-bg--probiotics",
  },
};

export function getCategoryClass(
  category: string,
  type: "text" | "background",
): string {
  return categoryStyles[category]?.[type] ?? "";
}
