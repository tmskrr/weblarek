// Компонент Gallery отвечает за область каталога на главной странице.
// Принимает массив карточек товара (CardCatalog) и заменяет весь контент в контейнере.
// Сеттер items(items[]) полностью перерисовывает список карточек за один раз.
// не хранит данные, не принимает решений — только отображает карточки, которые пришли из Presenter.

import { Component } from "../base/Component";

export class Gallery extends Component<IGallery> {
  constructor(protected container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
