import { Card } from "@repo/ui/card";

type Transaction = {
  time: Date;
  amount: number;
  status: "Received" | "Sent"; // Specific types for status
};

export const P2pTransactions = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-left pb-8 pt-8 pr-40">No Recent transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-2 pl-2">
        {transactions.map((t, index) => (
          <div className="flex justify-between " key={index}>
            <div>
              <div className="text-sm">
                {t.status == "Received" ? "Received INR" : "Sent INR"}
              </div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center ml-28">
              + Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
