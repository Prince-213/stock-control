import prisma from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const data = await prisma.products.findMany();

  return Response.json({ data });
}
