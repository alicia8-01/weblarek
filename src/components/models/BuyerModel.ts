import { IBuyer } from "../../types";

export class BuyerModel {
  private payment: "card" | "cash" | "" = "";
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  setData(data: IBuyer): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.address !== undefined) this.address = data.address;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
  }

  clearData(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  validatePayment(): string {
    if (!this.payment) {
      return "Выберите способ оплаты";
    }

    if (this.payment !== "card" && this.payment !== "cash") {
      return "Выбран недопустимый способ оплаты";
    }

    return "";
  }

  validateAddress(): string {
    if (!this.address || this.address.trim() === "") {
      return "Адрес обязателен для заполнения";
    }

    const address = this.address.trim();

    if (address.length < 10) {
      return "Адрес должен содержать не менее 10 символов";
    }

    if (address.length > 200) {
      return "Адрес не должен превышать 200 символов";
    }

    if (!/\d/.test(address)) {
      return "Адрес должен содержать номер дома";
    }

    return "";
  }

  validateEmail(): string {
    if (!this.email || this.email.trim() === "") {
      return "Email обязателен для заполнения";
    }

    const input = document.createElement("input");
    input.type = "email";
    input.value = this.email;

    if (!input.checkValidity()) {
      if (input.validity.valueMissing) {
        return "Email обязателен для заполнения";
      }
      if (input.validity.typeMismatch) {
        return "Неверный формат email адреса";
      }
      if (input.validity.patternMismatch) {
        return "Email не соответствует требуемому формату";
      }
      if (input.validity.tooShort) {
        return "Email слишком короткий";
      }
      if (input.validity.tooLong) {
        return "Email слишком длинный";
      }
      if (input.validity.badInput) {
        return "Недопустимое значение email";
      }

      return "Неверный формат email адреса";
    }

    return "";
  }

  validatePhone(): string {
    if (!this.phone || this.phone.trim() === "") {
      return "Номер телефона обязателен для заполнения";
    }

    const input = document.createElement("input");
    input.type = "phone";
    input.value = this.phone;

    if (!input.checkValidity()) {
      if (input.validity.valueMissing) {
        return "Номер телефона обязателен для заполнения";
      }
      if (input.validity.typeMismatch) {
        return "Неверный формат номера телефона";
      }
      if (input.validity.patternMismatch) {
        return "Номер телефона не соответствует требуемому формату";
      }
      if (input.validity.tooShort) {
        return "Номер телефона слишком короткий";
      }
      if (input.validity.tooLong) {
        return "Номер телефона слишком длинный";
      }
      if (input.validity.badInput) {
        return "Недопустимое значение номера телефона";
      }

      return "Неверный формат номера телефона";
    }

    return "";
  }
}
