"use client";

import CartSide from "@/components/custom/cartSide";
import { TableDemo } from "@/components/custom/sales-table";
import { Input } from "@/components/ui/input";
import { Cart } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(true);

  const [cart, setCart] = useState<Cart[]>([
    // More products...
  ]);

  return (
    <div className=" w-full h-screen">
      <CartSide
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cart={cart}
        setCart={setCart}
      />
      <main className="flex min-h-screen flex-col items-center justify-between ">
        <div className=" w-[80%] mx-auto p-10 border-2 border-gray-200 rounded-xl">
          <div className=" w-full flex items-center justify-between">
            <div className=" mb-10">
              <h1 className=" text-3xl font-semibold">Stock Analysis</h1>
              <p className=" text-gray-500 font-medium text-lg mt-1">
                {"Here's a list of stocks available in the store ! "}
              </p>
            </div>

            <button onClick={() => setCartOpen(true)} className=" relative">
              <div className=" w-6 h-6 absolute -top-3 -right-2 bg-black text-white flex items-center justify-center rounded-full">
                <h1>{cart.length}</h1>
              </div>
              <ShoppingBag />
            </button>
          </div>

          <div>
            <Input className=" w-[14rem] mb-5" placeholder="Filter products" />
          </div>
          <TableDemo cart={cart} setCart={setCart} />
        </div>
      </main>
    </div>
  );
}
