// jobs/recurring.job.js
import cron from "node-cron";
import RecurringPlan from "../models/RecurringPlan.js";
import Invoice from "../models/Invoice.js";

cron.schedule("0 0 * * *", async () => {
  const today = new Date();

  const plans = await RecurringPlan.find({
    status: "Active",
    nextRun: { $lte: today },
  });

  for (let plan of plans) {
    const invoice = await Invoice.create({
      invoiceNo: "INV-" + Date.now(),
      customerName: plan.customerName,
      customerEmail: plan.customerEmail,
      items: plan.items,
      gstRate: plan.gstRate,
      date: new Date(),

      isRecurring: true,
      recurringPlanId: plan._id,

      status: "Draft",
    });

    /* 🔁 NEXT RUN DATE */
    let next = new Date(plan.nextRun);
    if (plan.frequency === "Monthly") next.setMonth(next.getMonth() + 1);
    if (plan.frequency === "Quarterly") next.setMonth(next.getMonth() + 3);
    if (plan.frequency === "Yearly") next.setFullYear(next.getFullYear() + 1);

    plan.nextRun = next;
    await plan.save();

    console.log("Recurring Invoice Created:", invoice.invoiceNo);
  }
});
