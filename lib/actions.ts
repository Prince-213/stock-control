"use server";

import prisma from "./server/prisma";

// const fetchTodoList = async () => {
//     return axios
//       .get("http://localhost:3000/product")
//       .then((res) => res.data)
//       .catch((err) => {
//         console.log(err);
//         return [];
//       });
// };

export const fetchTodoList = async () => {
  let data = await prisma.products.findMany();

  console.log(data);
  return data;
};
