import React from "react";
import { formatCurrency } from "@/utils/utils";

interface CartItemProps {
  item: {
    id: string | number;
    ticketType?: { type?: string };
    price: number;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <p className="font-normal">{item.ticketType?.type ?? "Loại vé"}</p>
        <p className="font-normal text-gray-500">
          {formatCurrency(item.price)}
        </p>
      </div>
      <div className="flex flex-col text-end">
        <p className="font-normal text-gray-500">{item.quantity}</p>
        <p className="font-normal text-gray-500">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
