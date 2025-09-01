import "./scss/styles.scss";

import { apiProducts } from "./utils/data";
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { Api } from "./components/base/Api";
import { ApiClient } from "./components/api/ApiClient";
import { API_URL } from "./utils/constants";

/// Создание классов
const catalog = new CatalogModel();
const basket = new BasketModel();
const buyer = new BuyerModel();

/// Проверка работы методов

// Методы класса CatalogModel
catalog.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", catalog.getItems());

const product = catalog.getItems()[0];
if (product) {
  const newProduct = catalog.getItemsById(product.id);
  console.log("Найденный товар по ID из массива товаров:", newProduct);

  catalog.setSelectedItem(product);
  console.log("Выбранный товар из массива товаров:", catalog.getSelectedItem());
}

// Методы класса BasketModel
basket.addItem(apiProducts.items[0]);
console.log("Массив товаров в корзине:", basket.getItems());

basket.deleteItem(apiProducts.items[0].id);

console.log("Массив товаров в корзине:", basket.getItems());
console.log("Количество товаров в корзине:", basket.getItemCount());
console.log("Сумма всех товаров в корзине:", basket.getTotalPrice());

// Методы класса BuyerModel
const firstBuyer = {
  payment: "card" as const,
  address: "пр. Первый, д. 1",
  email: "example@mail.ru",
  phone: "+7 (981) 981-43-12",
};
buyer.setData(firstBuyer);
console.log("Данные первого покупателя:", buyer.getData());
console.log("Валидация данных первого покупателя:", buyer.validateData());

const secondBuyer = {
  payment: "cash" as const,
  address: "Питер",
  email: "пр. Первый, д. 1",
  phone: "03",
};
buyer.setData(secondBuyer);
console.log("Данные второго покупателя:", buyer.getData());
console.log("Валидация данных второго покупателя:", buyer.validateData());
console.log("Валидация оплаты второго покупателя:", buyer.validatePayment());
console.log("Валидация адреса второго покупателя:", buyer.validateAddress());
console.log("Валидация email второго покупателя:", buyer.validateEmail());
console.log("Валидация телефона второго покупателя:", buyer.validatePhone());

/// Проверка работы с сервером

// Создание экземпляра Api и ApiClient
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Выполнение запроса на сервер
try {
  const items = await apiClient.getItems();
  catalog.setItems(items);

  console.log("Товары получены с сервера");
  console.log("Массив товаров:", catalog.getItems());
  console.log("Количество товаров:", catalog.getItems().length);
} catch (error) {
  console.error("Ошибка при получении данных с сервера:", error);
}
