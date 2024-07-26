"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const ProductPage = () => {
  const [indomie, setIndomie] = useState(0);
  const [meat, setMeat] = useState(0);
  const [bread, setBread] = useState(0);
  const [rice, setRice] = useState(0);

  const router = useRouter();

  const fetchTodoList = async () => {
    const res = await fetch("/api/products");
    const data = res.json();
    return data;
  };

  const {
    data: productData,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["items"],
    queryFn: fetchTodoList,
  });

  interface NewItem {
    id: string;
    email: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    initial: number;
    active: boolean;
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      return axios.post(`/api/products/${id}`, {
        id: id,
        amount: amount,
      });
    },
    onError(error, variables, context) {
      console.log(error);
    },

    onSuccess(data, variables, context) {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["items"] });
      router.refresh();
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    mutation.mutate({ id: "669fe8417031846bf168953c", amount: indomie });
    mutation.mutate({ id: "669fe8807031846bf168953d", amount: meat });
    mutation.mutate({ id: "669fe88f7031846bf168953e", amount: bread });
    mutation.mutate({ id: "669fe8a07031846bf168953f", amount: rice });
  };

  return (
    <form onSubmit={handleSubmit} className=" w-[80%] mx-auto">
      <div className=" grid grid-cols-2 gap-10">
        <div className=" space-y-2">
          <Label className=" font-medium" htmlFor="indomie">
            Indomie
          </Label>
          <Input
            className=" py-4"
            placeholder=""
            defaultValue={1}
            id="indomie"
            type="number"
            onChange={(e) => setIndomie(Number(e.target.value))}
          />
        </div>
        <div className=" space-y-2">
          <Label className=" font-medium" htmlFor="meat">
            Meat
          </Label>
          <Input
            className=" py-4"
            placeholder=""
            defaultValue={1}
            id="meat"
            type="number"
            onChange={(e) => setMeat(Number(e.target.value))}
          />
        </div>
      </div>

      <br />
      <div className=" grid grid-cols-2 gap-10">
        <div className=" space-y-2">
          <Label className=" font-medium" htmlFor="bread">
            Bread
          </Label>
          <Input
            className=" py-4"
            placeholder=""
            type="number"
            defaultValue={1}
            id="bread"
            onChange={(e) => setBread(Number(e.target.value))}
          />
        </div>
        <div className=" space-y-2">
          <Label className=" font-medium" htmlFor="rice">
            Rice
          </Label>
          <Input
            className=" py-4"
            placeholder=""
            id="rice"
            type="number"
            defaultValue={1}
            onChange={(e) => setRice(Number(e.target.value))}
          />
        </div>
      </div>

      <br />
      <Button type="submit" className=" flex items-center space-x-2">
        {" "}
        <p>Submit</p>{" "}
        {mutation.isPending && <Loader className=" animate-spin" />}
      </Button>
    </form>
  );
};

export default ProductPage;
