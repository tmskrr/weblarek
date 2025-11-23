export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface ICartItem {
  productId: string;
  qty: number;
}

export interface IOrderRequest {
  items: ICartItem[];
  customer: IBuyer;
}

// ошибки валидации покупателя: ключ присутствует только у невалидных полей
export interface IValidationErrors {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderResponse {
  id: string;
}

// рендер каталога: создаём карточки и отображаем их в Gallery
events.on("catalog:changed", () => {
  const itemCards = productsModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });

    return card.render(item);
  });

  gallery.render({ catalog: itemCards });
});

larekApi
  .getProductList()
  .then((data) => {
    productsModel.setItems(data.items);
  })
  .catch((err) => console.error(err));
