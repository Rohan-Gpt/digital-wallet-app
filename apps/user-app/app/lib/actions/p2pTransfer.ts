"use server";

import { getServerSession } from "next-auth/next"; // For Next.js 13+

import { authOptions } from "../auth";
import client from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;
  if (!from) {
    return {
      message: "user not authorised",
    };
  }
  const toUser = await client.user.findFirst({
    where: {
      number: to,
    },
  });
  if (!toUser) {
    return {
      message: "user doesn't exist",
    };
  }
  await client.$transaction(async (tx) => {
    await tx.$queryRaw`
        SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE;
      `;

    const fromBalance = await tx.balance.findUnique({
      where: {
        userId: Number(from),
      },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }
    await tx.balance.update({
      where: {
        userId: Number(from),
      },
      data: {
        amount: {
          decrement: amount * 100,
        },
      },
    });
    await tx.balance.update({
      where: {
        userId: Number(toUser.id),
      },
      data: {
        amount: {
          increment: amount * 100,
        },
      },
    });
    await tx.p2pTransfer.create({
      data: {
        status: "Sent",
        fromUserId: Number(from),
        toUserId: Number(toUser.id),
        amount: amount * 100,
        timestamp: new Date(),
      },
    });
    console.log("transaction complete");
  });
}
