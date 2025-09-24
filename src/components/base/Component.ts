/**
 * Базовый компонент
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
    // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
  }

  // Инструментарий для работы с DOM в дочерних компонентах

  // Установить изображение с альтернативным текстом
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
    if (element) {
      element.src = src;
      if (alt) {
        element.alt = alt;
      }
    }
  }

  protected setText(element: HTMLElement, value: string) {
    if (element) {
      element.textContent = value;
    }
  }

  // Вернуть корневой DOM-элемент
  // render(data?: Partial<T>): HTMLElement {
  //   Object.assign(this as object, data ?? {});
  //   return this.container;
  // }
  render(data?: Partial<T>): HTMLElement {
    if (data) {
      this.update(data);
    }

    return this.container;
  }

  protected update(_data: Partial<T>): void {}
}
