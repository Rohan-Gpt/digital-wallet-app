import express from "express";
import client from "@repo/db/client";
const app = express();
app.use(express.json());

app.post("/hdfcWebhook", (req, res) => {
  //TODO: Add zod validation here?
  const paymentInformation: {
    token: string;
    userId: string;
    amount: string;
  } = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };
  console.log("the token is:", paymentInformation.token);
  // Update balance in db, add txn
  try {
    client.$transaction([
      client.balance.update({
        where: {
          userId: Number(paymentInformation.userId),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      client.onRampTransaction.update({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.json({ message: "captured" });
  } catch (error) {
    console.log(error);
    res.status(411).send("Error while processing webhook");
  }
});

app.listen(4000);
