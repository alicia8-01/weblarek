import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { ApiClient } from "./components/api/ApiClient";
import { BasketView } from "./components/views/BasketView";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { CardPreview } from "./components/views/Card/CardPreview";
import { CatalogModel } from "./components/models/CatalogModel";
import { ContactsView } from "./components/views/ContactsView";
import {
  cloneTemplate,
  ensureElement,
  replaceExtensionToPng,
} from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { GalleryView } from "./components/views/GalleryView";
import { HeaderView } from "./components/views/HeaderView";
import {
  IBasketChangedEvent,
  ICatalogChangedEvent,
  ISelectedItemEvent,
  IOrderData,
  IOrderResult,
  IProduct,
} from "./types";
import { ModalView } from "./components/views/ModalView";
import { OrderView } from "./components/views/OrderView";
import { SuccessView } from "./components/views/SuccessView";

// Создание экземпляра EventEmitter
const events = new EventEmitter();

// Создание экземпляров Api и ApiClient
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Создание контейнеров для элементов DOM
const headerContainer = ensureElement<HTMLElement>(".header");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>("#modal-container");

/// Создание классов модулей
const catalog = new CatalogModel(events);
const basket = new BasketModel(events);
const buyer = new BuyerModel(events);

// Создание компонентов представления
const header = new HeaderView(headerContainer, events);
const modal = new ModalView(modalContainer, events);
const gallery = new GalleryView(galleryContainer, {
  onClick: (item: IProduct) => {
    catalog.setSelectedItem(item);
  },
});

// Создание компонентов для модальных окон
const basketTemplate = cloneTemplate<HTMLElement>("#basket");
const basketView = new BasketView(basketTemplate, {
  onClick: () => {
    const orderView = new OrderView(
      cloneTemplate<HTMLFormElement>("#order"),
      events
    );

    const customerData = buyer.getData();
    const orderFormElement = orderView.render({
      address: customerData.address,
      payment: customerData.payment,
      errors: "",
      valid: false,
    });

    modal.setContent(orderFormElement, "order");
    modal.open("order");
  },

  onRemove: (id: string) => {
    basket.deleteItem(id);
  },
});

const successTemplate = cloneTemplate<HTMLElement>("#success");
const success = new SuccessView(successTemplate, {
  onClick: () => {
    modal.close();
  },
});

// Событие загрузки каталога
events.on("catalog:changed", (data: ICatalogChangedEvent) => {
  gallery.render(data.items);
});

// Событие просмотра выбранного товара из каталога
events.on("catalog:item-selected", (data: ISelectedItemEvent) => {
  //currentModal = "preview";
  const isInBasket = basket.isItemInBasket(data.item.id);
  const hasPrice = data.item.price !== null;

  const imageUrl = data.item.image
    ? `${CDN_URL}/${replaceExtensionToPng(data.item.image)}`
    : "";

  const itemData = {
    ...data.item,
    image: imageUrl,
    description: data.item.description || "Описание отсутствует",
    isInBasket: isInBasket,
    hasPrice: hasPrice,
  };

  const preview = new CardPreview(cloneTemplate<HTMLElement>("#card-preview"), {
    onClick: () => {
      if (hasPrice) {
        if (isInBasket) {
          basket.deleteItem(data.item.id);
        } else {
          basket.addItem(data.item);
        }
      }

      modal.close();
    },
  });

  const previewElement = preview.render(itemData);

  modal.setContent(previewElement, "preview");
  modal.open("preview");
});

// Событие открытие корзины с товарами
events.on("basket:open", () => {
  const basketElement = basketView.render({
    items: basket.getItems(),
    total: basket.getTotalPrice(),
  });

  modal.setContent(basketElement, "basket");
  modal.open("basket");
});

// Событие изменения корзины с товарами
events.on("cart:changed", (data: IBasketChangedEvent) => {
  header.counter = data.count;

  if (modal.getCurrentContentType() === "preview") {
    const selectedItem = catalog.getSelectedItem();

    if (selectedItem) {
      const isInBasket = basket.isItemInBasket(selectedItem.id);
      const hasPrice = selectedItem.price !== null;

      const imageUrl = selectedItem.image
        ? `${CDN_URL}/${replaceExtensionToPng(selectedItem.image)}`
        : "";

      const itemData = {
        ...selectedItem,
        image: imageUrl,
        description: selectedItem.description || "Описание отсутствует",
        isInBasket: isInBasket,
        hasPrice: hasPrice,
      };

      const preview = new CardPreview(
        cloneTemplate<HTMLElement>("#card-preview"),
        {
          onClick: () => {
            if (hasPrice) {
              if (isInBasket) {
                basket.deleteItem(selectedItem.id);
              } else {
                basket.addItem(selectedItem);
              }
            }

            modal.close();
          },
        }
      );

      const previewElement = preview.render(itemData);
      modal.setContent(previewElement, "preview");
    }
  }

  if (modal.getCurrentContentType() === "basket") {
    const basketElement = basketView.render({
      items: basket.getItems(),
      total: data.total,
    });

    modal.setContent(basketElement, "basket");
  }
});

// Событие обработки формы с заказом товара
events.on("order:submit", () => {
  const orderErrors = buyer.validatePayment() || buyer.validateAddress();

  if (orderErrors.length === 0) {
    const contactsView = new ContactsView(
      cloneTemplate<HTMLFormElement>("#contacts"),
      events
    );

    const customerData = buyer.getData();
    const contactsFormElement = contactsView.render({
      email: customerData.email,
      phone: customerData.phone,
      errors: "",
      valid: false,
    });

    modal.setContent(contactsFormElement, "contacts");
  } else {
    events.emit("order:errors", { errors: orderErrors });
  }
});

events.on("order:errors", (data: { errors: string }) => {
  if (modal.getCurrentContentType() === "order") {
    const orderView = new OrderView(
      cloneTemplate<HTMLFormElement>("#order"),
      events
    );

    const customerData = buyer.getData();
    const orderFormElement = orderView.render({
      address: customerData.address,
      payment: customerData.payment,
      errors: data.errors,
      valid: data.errors.length === 0,
    });

    modal.setContent(orderFormElement, "order");
  }
});

// Событие изменения способа оплаты
events.on("order.payment:change", (data: { payment: string }) => {
  buyer.setData({ payment: data.payment as "card" | "cash" | "" });
  const orderErrors = buyer.validatePayment() || buyer.validateAddress();

  if (modal.getCurrentContentType() === "order") {
    const orderView = new OrderView(
      cloneTemplate<HTMLFormElement>("#order"),
      events
    );

    const customerData = buyer.getData();
    const orderFormElement = orderView.render({
      address: customerData.address,
      payment: customerData.payment,
      errors: orderErrors,
      valid: orderErrors.length === 0,
    });

    modal.setContent(orderFormElement, "order");
  }
});

// Событие изменения адреса
events.on(
  "order.address:change",
  (data: { address: string; validate?: boolean }) => {
    buyer.setData({ address: data.address });

    if (data.validate) {
      const orderErrors = buyer.validatePayment() || buyer.validateAddress();

      if (modal.getCurrentContentType() === "order") {
        const orderView = new OrderView(
          cloneTemplate<HTMLFormElement>("#order"),
          events
        );

        const customerData = buyer.getData();
        const orderFormElement = orderView.render({
          address: customerData.address,
          payment: customerData.payment,
          errors: orderErrors,
          valid: orderErrors.length === 0,
        });

        modal.setContent(orderFormElement, "order");
      }
    }
  }
);

// Событие изменения адреса E-mail
events.on("contacts.email:change", (data: { email: string }) => {
  buyer.setData({ email: data.email });
  const errors = buyer.validatePhone() || buyer.validateEmail();

  if (modal.getCurrentContentType() === "contacts") {
    const contactsView = new ContactsView(
      cloneTemplate<HTMLFormElement>("#contacts"),
      events
    );

    const customerData = buyer.getData();
    const contactsFormElement = contactsView.render({
      email: customerData.email,
      phone: customerData.phone,
      errors: errors,
      valid: errors.length === 0,
    });

    modal.setContent(contactsFormElement, "contacts");
  }
});

// Событие изменение номера телефона
events.on("contacts.phone:change", (data: { phone: string }) => {
  buyer.setData({ phone: data.phone });
  const errors = buyer.validatePhone() || buyer.validateEmail();

  if (modal.getCurrentContentType() === "contacts") {
    const contactsView = new ContactsView(
      cloneTemplate<HTMLFormElement>("#contacts"),
      events
    );

    const customerData = buyer.getData();
    const contactsFormElement = contactsView.render({
      email: customerData.email,
      phone: customerData.phone,
      errors: errors,
      valid: errors.length === 0,
    });

    modal.setContent(contactsFormElement, "contacts");
  }
});

// Событие обработки формы контактов
events.on("contacts:submit", () => {
  const errors = buyer.validatePhone() || buyer.validateEmail();

  if (errors.length === 0) {
    const orderData: IOrderData = {
      payment: buyer.getData().payment as "card" | "cash",
      email: buyer.getData().email,
      phone: buyer.getData().phone,
      address: buyer.getData().address,
      total: basket.getTotalPrice(),
      items: basket.getItems().map((item) => item.id),
    };

    apiClient
      .postOrder(orderData)
      .then((result: IOrderResult) => {
        const successElement = success.render({ total: result.total });
        modal.setContent(successElement, "success");

        basket.clear();
        buyer.clearData();
      })
      .catch((error) => {
        console.error("Ошибка оформления заказа:", error);

        const contactsView = new ContactsView(
          cloneTemplate<HTMLFormElement>("#contacts"),
          events
        );

        const customerData = buyer.getData();
        const contactsFormElement = contactsView.render({
          email: customerData.email,
          phone: customerData.phone,
          errors: "Ошибка оформления заказа. Попробуйте еще раз.",
          valid: false,
        });

        modal.setContent(contactsFormElement, "contacts");
      });
  } else {
    const contactsView = new ContactsView(
      cloneTemplate<HTMLFormElement>("#contacts"),
      events
    );

    const customerData = buyer.getData();
    const contactsFormElement = contactsView.render({
      email: customerData.email,
      phone: customerData.phone,
      errors: errors,
      valid: false,
    });

    modal.setContent(contactsFormElement, "contacts");
  }
});

// Функция инициализации приложения
function initializationApp() {
  apiClient
    .getItems()
    .then((items) => {
      console.log("Загружены товары:", items);

      if (!items || !Array.isArray(items)) {
        throw new Error("Некорректные данные от сервера");
      }

      catalog.setItems(items);
    })
    .catch((error) => {
      console.error("Ошибка загрузки:", error);
    });
}

document.addEventListener("DOMContentLoaded", initializationApp);
