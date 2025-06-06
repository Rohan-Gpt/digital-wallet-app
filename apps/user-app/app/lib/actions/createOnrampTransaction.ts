"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  // Ideally the token should come from the banking provider (hdfc/axis)
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const token = (Math.random() * 1000).toString();
  await prisma.$transaction([
    prisma.onRampTransaction.create({
      data: {
        provider,
        status: "Success",
        startTime: new Date(),
        token: token,
        userId: Number(session?.user?.id),
        amount: amount * 100,
      },
    }),
    prisma.balance.update({
      where: {
        userId: Number(session?.user?.id),
      },
      data: {
        amount: {
          increment: amount * 100,
        },
      },
    }),
  ]);

  return {
    message: "Done",
  };
}
