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

  validateData(): boolean {
    return (
      this.validatePayment() &&
      this.validateAddress() &&
      this.validateEmail() &&
      this.validatePhone()
    );
  }

  validatePayment(): boolean {
    return this.payment === "card" || this.payment === "cash";
  }

  validateAddress(): boolean {
    return this.address.trim().length > 0;
  }

  validateEmail(): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(this.email);
  }

  validatePhone(): boolean {
    const regex =
      /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
    return regex.test(this.phone);
  }
}
