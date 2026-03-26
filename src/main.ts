import './scss/styles.scss';

// Импорт моделей
import { CatalogModel } from './components/models/caralogModel';
import { CartModel } from './components/models/cartModel';
import { BuyerModel } from './components/models/BuyerModel';

// Импорт API классов
import { Api } from './components/base/Api';
import { AppApi } from './components/models/AppApi';

// Импорт констант
import { API_URL } from './utils/constants';

// Запуск приложения
const baseUrl = new Api(API_URL);
const appApi = new AppApi(baseUrl);

// Создаем модели данных
const catalogModel = new CatalogModel();
const buyerModel = new BuyerModel();
const cartModel = new CartModel();

console.log('Модели данных созданы');

/**
 * Функция для загрузки товаров с сервера
 * Асинхронная, потому что запрос к серверу требует времени
 */
async function loadProductsFromServer() {
  try {
    const products = await appApi.getProducts();

    console.log('Данные успешно получены!');
    console.log('Количетсво товаров', products.length);
    console.log('Первый товар:', {
      id: products[0].id,
      description: products[0].description,
      image: products[0].image,
      title: products[0].title,
      category: products[0].category,
      price: products[0].price
    })

    // Сохраняем полученную информацию в каталог
    catalogModel.setItems(products);

    // Проверка на сохранение информации в каталог
    console.log('Количество товаров в каталоге:', catalogModel.getItems().length);
    console.log('Назавание товаров:', catalogModel.getItems().map(p => p.title));

    // Проверка поиска по id
    if (products.length > 0) {
      const found = catalogModel.getItemById(products[1].id);
      console.log('\nПоиск товара по ID:', found ? found.title : 'не найден');
    }

    return products; 
  } catch(error) {
    console.error('Ошибка при загрузке товаров:', error);
    return null;
  }
}
  loadProductsFromServer();

  // Пример того, как будет формироваться заказ
function prepareOrder() {
  // Получаем id товаров из корзины
  const cartItems = cartModel.getItems();
  const itemIds = cartItems.map(item => item.id);
  
  // Получаем данные покупателя
  const buyerData = buyerModel.getData();
  
  // Формируем заказ
  const order = {
    ...buyerData,
    items: itemIds
  };
  
  console.log('Данные для отправки заказа:', order);
  return order;
}


  import { apiProducts } from './utils/data';

  if (apiProducts && apiProducts.items) {
  // Добавляем несколько товаров в корзину для теста
  cartModel.addItem(apiProducts.items[0]);
  cartModel.addItem(apiProducts.items[1]);
  
  console.log('Товары добавлены в корзину:');
  console.log(`- ${apiProducts.items[0].title} - ${apiProducts.items[0].price} руб.`);
  console.log(`- ${apiProducts.items[1].title} - ${apiProducts.items[1].price} руб.`);
  console.log(`Всего товаров в корзине: ${cartModel.getCount()}`);
  console.log(`Общая сумма: ${cartModel.getTotal()} руб.`);
}

buyerModel.setData({
  payment: 'online',
  email: 'ivan.ivanov@example.com',
  phone: '+7 999 123-45-67',
  address: 'г. Москва, ул. Тверская, д. 15, кв. 78'
});

const buyerData = buyerModel.getData();

console.log('Данные покупателя:');
console.log(`- Способ оплаты: ${buyerData.payment === 'online' ? 'Онлайн' : 'Наличные'}`);
console.log(`- Email: ${buyerData.email}`);
console.log(`- Телефон: ${buyerData.phone}`);
console.log(`- Адрес: ${buyerData.address}`);


// Проверяем валидность данных
const validationErrors = buyerModel.validateAll();
const isValid = Object.keys(validationErrors).length === 0;
console.log(`\nВалидность данных: ${isValid ? 'Данные корректны' : 'Есть ошибки'}`);

if (!isValid) {
  console.log('Ошибки валидации:', validationErrors);
}

// Пример формирования заказа
if (cartModel.getCount() > 0 && isValid) {
  const orderExample = prepareOrder();
  console.log('Заказ готов к отправке:', orderExample);
} else {
  console.log('Заказ не готов: корзина пуста или данные покупателя не заполнены');
  console.log('Товаров в корзине:', cartModel.getCount());
  console.log('Данные покупателя валидны:', isValid);
}
