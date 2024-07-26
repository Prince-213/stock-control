import prisma from "@/lib/server/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug; // 'a', 'b', or 'c'

  const data = await prisma.products.findUnique({
    where: {
      id: params.slug,
    },
  });

  return Response.json({ data: data });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { id, amount } = await req.json();

  try {
    const upsertUser = await prisma.products.update({
      where: {
        id: id,
      },
      data: {
        amount: {
          increment: amount,
        },
      },
    });

    console.log(upsertUser);

    return Response.json({ id, amount, upsertUser });

    console.log("it worked");
  } catch (error) {
    console.log(error);
    return Response.json({ error });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { quantity } = await req.json();

  const id = params.slug;

  try {
    const upsertUser = await prisma.products.update({
      where: {
        id: id,
      },
      data: {
        amount: {
          decrement: quantity,
        },
      },
    });

    return Response.json({ id, quantity, upsertUser });

    console.log("it worked");
  } catch (error) {
    return Response.json({ error });
  }
}
