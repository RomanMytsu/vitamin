import { orderBy } from "firebase/firestore";
import { getCollectionsData } from "../../api/firestore-utils";
import { getCategoryClass } from "../../utils/category-utils";

type Subscription = {
  name: string;
  category: string;
  img: string;
  price: number;
  nextShipment: string;
  shipment: string;
};

export async function initSubscriptions(): Promise<void> {
  const container = document.getElementById("subscriptions");
  if (!(container instanceof HTMLElement)) return;

  const subscriptions = await getCollectionsData<Subscription>(
    "subscriptions",
    orderBy("nextShipmentDate", "desc"),
  );

  container.innerHTML = subscriptions
    .map(({ name, category, img, price, shipment, nextShipment }) => {
      const textClass = getCategoryClass(category, "text");
      const bgClass = getCategoryClass(category, "background");
      return `
<article class="profile-sub__sub-card">
  <div class="profile-sub__image-wrapper ${bgClass}">
    <img src="${img}" alt="${name}" width="120" height="112" />
  </div>
  <div class="profile-sub__text-content">
    <div class="profile-sub__header">
      <div class="profile-sub__info">
        <p class="profile-sub__category ${textClass}">${category}</p>
        <h3 class="profile-sub__title">${name}</h3>
      </div>
      <p class="profile-sub__price">$${price.toFixed(2)}</p>
    </div>
    <div class="profile-sub__footer">
      <div class="profile-sub__schedule">
        <p class="profile-sub__interval">${shipment}</p>
        <p class="profile-sub__date">${nextShipment}</p>
      </div>
      <button type="button" class="profile-sub__btn">
        Unsubscribe
      </button>
    </div>
  </div>
</article>
`;
    })
    .join("");
}
