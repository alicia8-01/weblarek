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

    return "";
  }

  validateAddress(): string {
    if (!this.address || this.address.trim() === "") {
      return "Адрес обязателен для заполнения";
    }

    return "";
  }

  validateEmail(): string {
    if (!this.email || this.email.trim() === "") {
      return "Email обязателен для заполнения";
    }

    return "";
  }

  validatePhone(): string {
    if (!this.phone || this.phone.trim() === "") {
      return "Номер телефона обязателен для заполнения";
    }

    return "";
  }
}
