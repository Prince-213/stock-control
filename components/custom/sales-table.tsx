"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  DollarSign,
  DollarSignIcon,
  Loader2,
  PlusCircle,
  ShoppingBag
} from "lucide-react";
import { DialogDemo } from "./sale-dialog";
import axios from "axios";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Cart, Product } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import emailjs from "@emailjs/browser";
import { useEffect } from "react";

import { MenuItems } from "@headlessui/react";

const invoices = [
  {
    id: "INV001",
    name: "Rice",
    category: "Foodstuff",
    price: "$250",
    quantity: "20",
    status: "false"
  }
];

export function TableDemo({
  cart,
  setCart
}: {
  cart: Cart[];
  setCart: Dispatch<SetStateAction<Cart[]>>;
}) {
  const fetchTodoList = async () => {
    const res = await fetch("/api/products");
    const data = res.json();
    return data;
  };

  const {
    data: productData,
    error,
    isFetching
  } = useQuery({
    queryKey: ["items"],
    queryFn: fetchTodoList,

    refetchOnMount: true
  });

  console.log(productData);

  const sendMail = ({ email, item }: { email: string; item: string }) => {
    emailjs.send(
      "service_3cs79uj",
      "template_wm40ob8",
      {
        from_name: "Store Analysis",
        to_name: "User",
        message: `The product you posted ( ${item} ) stock is low. Please do replenish your inventory`,
        to_email: email,
        reply_to: "onyiacypraintochi@gmail.com"
      },
      { publicKey: "lXy3uMKebxhwBPRWt" }
    );
  };

  const alertMail = async () => {
    productData?.map((item: any, index: number) => {
      if (item.amount < 50) {
        sendMail({ email: "onyiacypraintochi@gmail.com", item: item.name });
      }
    });
  };

  useEffect(() => {
    if (productData != null) {
      alertMail();
    }
  }, [productData]);

  const [quantity, setQuantity] = useState(1);

  return (
    <div className=" w-full border-2 border-gray-100 rounded-xl">
      <Table className=" ">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">In Stock</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        {isFetching ? (
          <Loader2 className=" animate-spin " />
        ) : (
          <TableBody>
            {productData?.data.map((invoice: any, index: any) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.name}</TableCell>
                <TableCell className="text-right">₦{invoice.price}</TableCell>
                <TableCell className=" flex justify-end">
                  <Input
                    className=" w-fit"
                    type="number"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    defaultValue={1}
                  />
                </TableCell>
                <TableCell className=" text-center ">
                  <h1>{invoice.amount}</h1>
                </TableCell>
                <TableCell className="  ">
                  {invoice.amount > invoice.initial / 2 ? (
                    <p className=" text-right font-medium text-emerald-500 border-2 border-emerald-600 p-3 rounded-lg w-fit ml-[75%]">
                      Active
                    </p>
                  ) : (
                    <p className=" text-right font-medium text-red-500 border-2 border-red-600 p-3 rounded-lg w-fit ml-[75%]">
                      Low
                    </p>
                  )}
                </TableCell>
                <TableCell className=" flex justify-end text-right">
                  <button
                    onClick={() => {
                      setCart([
                        ...cart,
                        {
                          id: invoice.id,
                          name: invoice.name,
                          href: "",
                          color: "",
                          price: invoice.price,
                          quantity: quantity,
                          imageSrc: "",
                          imageAlt: ""
                        }
                      ]);
                      console.log(cart);
                    }}
                    className=" flex items-center justify-center"
                  >
                    {" "}
                    <PlusCircle />{" "}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>
    </div>
  );
}
function sendMail(arg0: { email: string; item: any }) {
  throw new Error("Function not implemented.");
}
