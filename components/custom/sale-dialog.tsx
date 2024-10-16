"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import emailjs from "@emailjs/browser";

export function DialogDemo({
  id,
  name,
  price,
  quantity,
  status,
  email,
  initial
}: {
  id: string;
  name: string;

  price: number;
  quantity: number;
  status: boolean;
  email: string;
  initial: number;
}) {
  interface NewItem {
    id: string;
    email: string;
    name: string;

    price: number;
    quantity: number;
    active: boolean;
    initial: number;
  }

  const [amount, setAmount] = useState(0);
  const queryClient = useQueryClient();
  const router = useRouter();
  const useEmail = "onyiacypraintochi@gmail.com";

  const sendMail = ({ email, item }: { email: string; item: string }) => {
    emailjs.send(
      "service_bo6pfco",
      "template_hpf5gt9",
      {
        from_name: "Store Analysis",
        to_name: "User",
        message: `The product you posted ( ${item} ) stock is low. Please do replenish your inventory`,
        to_email: email,
        reply_to: "onyiacypraintochi@gmail.com"
      },
      { publicKey: "sVrqItToyCiN-irs3" }
    );
  };

  const mutation = useMutation({
    mutationFn: (newItem: NewItem) => {
      return fetch(`http://localhost:3000/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newItem)
      }).then((response) => response.json());
    },
    onError(error, variables, context) {
      console.log(error);
    },

    onSuccess(data, variables, context) {
      console.log(data);

      queryClient.invalidateQueries({ queryKey: ["items"] });

      router.refresh();
    },

    onSettled(data, error, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (initial / 2 > quantity - amount) {
      sendMail({ email: email, item: name });
      console.log("mail sent");
    }

    mutation.mutate({
      id: id,
      email: useEmail,
      name: name,

      price: price,
      quantity: quantity - amount,
      active: initial / 2 > quantity - amount ? false : true,
      initial: initial
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sell</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Sale</DialogTitle>
            <p>{id}</p>
            <DialogDescription>
              {
                " Make changes to your profile here. Click sell when you're done."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className=" flex items-center space-x-2">
              <h1 className=" font-medium">Product:</h1>
              <p>Rice</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                defaultValue="1"
                onChange={(e) => setAmount(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div> */}
          </div>
          <DialogFooter>
            <Button type="submit" className=" flex items-center space-x-2">
              {" "}
              <p>Sell</p>{" "}
              {mutation.isPending && <Loader className=" animate-spin" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
