import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { Center } from "@repo/ui/center";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

import { P2pTransactions } from "../../../components/P2pTransactions";

async function getP2pTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session?.user?.id),
    },
  });
  console.log(txns);
  return txns.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
    status: t.status,
  }));
}

export default async function () {
  const transactions = await getP2pTransactions();

  return (
    <div className="grid grid-cols-2 mx-auto">
      <div className="flex justify-center items-center w-full mb-1">
        <SendCard />
      </div>
      <div className="flex justify-center items-center w-full mb-36">
        <P2pTransactions transactions={transactions} />
      </div>
    </div>
  );
}
