"use client";

import { Dispatch, Fragment, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild
} from "@headlessui/react";
import { calculateTotalPrice, Cart, Product } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import emailjs from "@emailjs/browser";
import { fetchTodoList } from "@/lib/actions";
import { useEffect } from "react";

export default function CartSide({
  cartOpen,
  setCartOpen,
  cart,
  setCart
}: {
  cartOpen: boolean;
  setCartOpen: Dispatch<SetStateAction<boolean>>;
  cart: Cart[];
  setCart: Dispatch<SetStateAction<Cart[]>>;
}) {
  // const fetchTodoList = async () => {
  //   return axios
  //     .get("http://localhost:3000/product")
  //     .then((res) => res.data)
  //     .catch((err) => {
  //       console.log(err);
  //       return [];
  //     });
  // };

  const fetchTodoList = async () => {
    const res = await fetch("/api/products");
    const data = res.json();
    return data;
  };

  const {
    data: productData,
    error,
    isFetching,
    isFetched,
    isSuccess
  } = useQuery({
    queryKey: ["items"],
    queryFn: fetchTodoList,

    refetchOnMount: true
  });

  const router = useRouter();

  const alertMail = async () => {
    if (isSuccess)
      productData.map((item: any, index: number) => {
        if (item.amount < 50) {
          sendMail({ email: "onyiacypraintochi@gmail.com", item: item.name });
          console.log("mail sent");
        }
      });
  };

  useEffect(() => {
    isFetched ? alertMail() : null;
  }, []);

  if (isSuccess) {
    alertMail();
  }

  // const getProductByQuantity = (arr: Product[], id: string) => {
  //   const item = arr?.find((item) => item.id === id);
  //   return item?.amount;
  // };

  // const name = getProductByQuantity(data, "2");

  const queryClient = useQueryClient();

  const [selected, setselected] = useState("");

  const mutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return axios.patch(`/api/products/${id}`, {
        quantity: quantity
      });
    },

    onError(error, variables, context) {
      console.log(error);
    },

    onSuccess(data, variables, context) {
      console.log("the data is");
      alertMail();
      console.log(data.data);

      /* data.data.map((item: any, index: number) => {
        console.log("it is");
        console.log(item.amount);
        if (item.amount < 50) {
          sendMail({ email: "princolosh@gmail.com", item: item.name });
        }
      }); */

      queryClient.invalidateQueries({ queryKey: ["items"] });
    },

    onSettled(data, error, variables, context) {
      console.log("It is settled");
      alertMail();
      queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });

  const sendMail = ({ email, item }: { email: string; item: string }) => {
    emailjs.send(
      "service_3cs79uj",
      "template_wm40ob8",
      {
        from_name: "Store Analysis",
        to_name: "User",
        message: `The product you posted ( ${item} ) stock is low. Please do replenish your inventory`,
        to_email: email,
        reply_to: "princolosh@gmail.com"
      },
      { publicKey: "lXy3uMKebxhwBPRWt" }
    );
  };

  const getProductByQuantity = (arr: Product[], id: string) => {
    const item = arr?.find((item) => item.id === id);
    return item?.amount;
  };

  const handleSubmit = () => {
    for (let index = 0; index < cart.length; index++) {
      cart.map((item, index) => {
        if (cart != null) {
          mutation.mutate({ id: item.id, quantity: item.quantity });

          // if (item.quantity < 50) {
          //   sendMail({ email: "princolosh@gmail.com", item: item.name });
          // }
        }
      });

      setCart([]);
    }
  };

  const checkOut = () => {};

  return (
    <Transition show={cartOpen}>
      <Dialog className="relative z-10" onClose={setCartOpen}>
        <TransitionChild
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setCartOpen(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {cart.map((product) => (
                              <li key={product.id} className="flex py-6">
                                {/* <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.imageSrc}
                                    alt={product.imageAlt}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div> */}

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a href={product.href}>
                                          {product.name}
                                        </a>
                                      </h3>
                                      <p className="ml-4">{product.price}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {product.color}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Qty {product.quantity}
                                    </p>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>{calculateTotalPrice(cart)}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                      </p>
                      <button onClick={handleSubmit} className="mt-6">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          {mutation.isPending ? (
                            <Loader className=" animate-spin" />
                          ) : null}
                          Checkout
                        </a>
                      </button>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or{" "}
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => setCartOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
