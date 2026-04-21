import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { AppApi } from "./components/models/AppApi";
import { CatalogModel } from "./components/models/CaralogModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { Basket } from "./components/view/Basket";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardBasket } from "./components/view/CardBasket";
import { CartPreview } from "./components/view/CardPreview";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Gallery } from "./components/view/Gallery";
import { Success } from "./components/view/Success";
import { Modal } from "./components/view/Modal";
import { Header } from "./components/view/Header";
import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { IProduct, IOrder, IBuyer } from "./types";

// Инициализация событий
const events = new EventEmitter();

// Инициализация API
const apiService = new Api(API_URL);
const appApi = new AppApi(apiService);

// Инициализация моделей
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Получение DOM-элементов
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const headerContainer = ensureElement<HTMLElement>(".header");
const galleryContainer = ensureElement<HTMLElement>(".gallery");

// Получение шаблонов
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketCardTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const previewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const catalogCardTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

// Инициализация View
const modal = new Modal(modalContainer, events);
const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const basket = new Basket(cloneTemplate<HTMLElement>(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>(contactsTemplate), events);
const successView = new Success(cloneTemplate<HTMLElement>(successTemplate), events);

const previewCard = new CartPreview(cloneTemplate<HTMLElement>(previewTemplate), events);

// Функция обновления UI корзины
function updateCartUI(): void {
    header.counter = cartModel.getCount();
}

// Функция рендера каталога
function renderCatalog(): void {
    const products = catalogModel.getItems();
    
    const cards = products.map((product) => {
        const cardElement = cloneTemplate<HTMLElement>(catalogCardTemplate);
        const card = new CardCatalog(cardElement, {
            onClick: () => {
                catalogModel.setSelectedItem(product);
                events.emit("card:open", { item: product });
            }
        });
        
        card.title = product.title;
        card.price = product.price ?? null;
        card.image = product.image;
        card.category = product.category;
        
        return card.render();
    });
    
    gallery.render({ items: cards });
}

// Функция рендера корзины
function renderBasketModal(): void {
    const basketItems = cartModel.getItems();
    const basketCards: HTMLLIElement[] = [];
    
    basketItems.forEach((item, index) => {
        const cardElement = cloneTemplate<HTMLLIElement>(basketCardTemplate);
        const basketCard = new CardBasket(cardElement, {
            onClick: () => {
                cartModel.removeItem(item.id);
                renderBasketModal();
                updateCartUI();
            }
        });
        
        basketCard.index = index + 1;
        basketCard.title = item.title;
        basketCard.price = item.price ?? null;
        
        basketCards.push(basketCard.render() as HTMLLIElement);
    });
    
    basket.content = basketCards;
    basket.total = cartModel.getTotal();
    
    modal.render({ content: basket.render() });
}

// Функция рендера формы заказа
function renderOrderFormModal(): void {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validateAll();
    
    const hasPaymentError = errors.payment;
    const hasAddressError = errors.address;
    const isValid = !hasPaymentError && !hasAddressError;
    
    orderForm.payment = buyerData.payment;
    orderForm.address = buyerData.address;
    orderForm.valid = isValid;
    
    if (hasPaymentError || hasAddressError) {
        orderForm.errors = [hasPaymentError, hasAddressError].filter(Boolean).join(", ");
    } else {
        orderForm.errors = "";
    }
    
    modal.render({ content: orderForm.render() });
}

// Функция рендера формы контактов
function renderContactsFormModal(): void {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validateAll();
    
    const hasEmailError = errors.email;
    const hasPhoneError = errors.phone;
    const isValid = !hasEmailError && !hasPhoneError;
    
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.valid = isValid;
    
    if (hasEmailError || hasPhoneError) {
        contactsForm.errors = [hasEmailError, hasPhoneError].filter(Boolean).join(", ");
    } else {
        contactsForm.errors = "";
    }
    
    modal.render({ content: contactsForm.render() });
}

// Функция рендера превью товара
function renderPreviewModal(item: IProduct): void {
    const isInCart = cartModel.contains(item.id);
    const isAvailable = item.price !== null;
    
    previewCard.title = item.title;
    previewCard.price = item.price ?? null;
    previewCard.image = item.image;
    previewCard.category = item.category;
    previewCard.description = item.description || "";
    previewCard.buttonText = !isAvailable 
        ? "Недоступно" 
        : isInCart 
            ? "Удалить из корзины" 
            : "В корзину";
    previewCard.buttonDisabled = !isAvailable;
    
    modal.render({ content: previewCard.render() });
}

// Подписка на изменения моделей
events.on("cart:changed", () => {
    updateCartUI();
});

events.on("catalog:changed", () => {
    renderCatalog();
});

events.on("buyer:changed", () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validateAll();
    
    // Обновляем форму заказа
    orderForm.payment = buyerData.payment;
    orderForm.address = buyerData.address;
    orderForm.valid = !errors.payment && !errors.address;
    orderForm.errors = [errors.payment, errors.address].filter(Boolean).join(", ");
    
    // Обновляем форму контактов
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.valid = !errors.email && !errors.phone;
    contactsForm.errors = [errors.email, errors.phone].filter(Boolean).join(", ");
});

// Обработчики событий
events.on("catalog:load", async () => {
    try {
        const products = await appApi.getProducts();
        catalogModel.setItems(products);
    } catch (error) {
        console.error("Ошибка загрузки каталога:", error);
    }
});

events.on("card:open", (data: { item: IProduct }) => {
    renderPreviewModal(data.item);
});

events.on("basket-toggle", () => {
    const selectedItem = catalogModel.getSelectedItem();
    if (selectedItem) {
        if (cartModel.contains(selectedItem.id)) {
            cartModel.removeItem(selectedItem.id);
        } else {
            if (selectedItem.price !== null) {
                cartModel.addItem(selectedItem);
            }
        }
        
        const isInCart = cartModel.contains(selectedItem.id);
        const isAvailable = selectedItem.price !== null;
        
        previewCard.buttonText = !isAvailable 
            ? "Недоступно" 
            : isInCart 
                ? "Удалить из корзины" 
                : "В корзину";
        
        modal.close();
    }
});


events.on("basket:open", () => {
    renderBasketModal();
});

events.on("basket:order", () => {
    if (cartModel.getCount() > 0) {
        buyerModel.clearData();
        renderOrderFormModal();
    }
});

events.on("form:change", (data: { form: string; field: string; value: string }) => {
    if (data.form === "order") {
        const updateData: Partial<IBuyer> = {};
        if (data.field === "payment") updateData.payment = data.value as "online" | "cash";
        if (data.field === "address") updateData.address = data.value;
        buyerModel.setData(updateData);
    } else if (data.form === "contacts") {
        const updateData: Partial<IBuyer> = {};
        if (data.field === "email") updateData.email = data.value;
        if (data.field === "phone") updateData.phone = data.value;
        buyerModel.setData(updateData);
    }
});

events.on("order:submit", () => {
    const errors = buyerModel.validateAll();
    if (!errors.payment && !errors.address) {
        renderContactsFormModal();
    }
});

events.on("contacts:submit", async () => {
    const errors = buyerModel.validateAll();
    if (!errors.email && !errors.phone) {
        const buyerData = buyerModel.getData();
        const order: IOrder = {
            payment: buyerData.payment,
            email: buyerData.email,
            phone: buyerData.phone,
            address: buyerData.address,
            total: cartModel.getTotal(),
            items: cartModel.getItems().map(item => item.id)
        };
        
        try {
            const result = await appApi.postOrder(order);
            successView.total = result.total;
            cartModel.clearCart();
            buyerModel.clearData();
            modal.render({ content: successView.render() });
        } catch (error) {
            console.error("Ошибка при оформлении заказа:", error);
            contactsForm.errors = "Не удалось оформить заказ";
            contactsForm.valid = true;
        }
    }
});

events.on("success:close", () => {
    modal.close();
});

events.on("modal:close", () => {
    modal.close();
});

// Загрузка данных
catalogModel.setItems([]); // Инициализация пустым массивом
renderCatalog();
updateCartUI();

// Загрузка товаров с сервера
appApi.getProducts()
    .then((products) => {
        catalogModel.setItems(products);
    })
    .catch((error) => {
        console.error("Ошибка при получении списка товаров:", error);
    });