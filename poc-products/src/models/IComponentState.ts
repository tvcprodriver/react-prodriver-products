import { Product } from "prodriver-products";
import { IError } from "./IError";
import { ICheckoutResponse } from "./ICheckoutResponse";

export interface IComponentState {
  isOpen: boolean;
  dropDownOpen: boolean;
  products: Product[];
  product: Product;
  error: IError;
  checkoutResponse: ICheckoutResponse;
  showOverlay: boolean;
  childOfferingVisible: Map<string, boolean>;
  productId: number;
  promotionId: number;
}
