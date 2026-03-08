import { notifyOwner } from "./_core/notification";

export async function notifyJobAssigned(jobTitle: string, contractorEmail: string) {
  try {
    await notifyOwner({
      title: "Job Assigned",
      content: `Job "${jobTitle}" has been assigned to ${contractorEmail}`,
    });
  } catch (error) {
    console.error("Failed to send job assigned notification:", error);
  }
}

export async function notifyJobCompleted(jobTitle: string, amount: string) {
  try {
    await notifyOwner({
      title: "Job Completed",
      content: `Job "${jobTitle}" has been marked as completed. Amount: $${amount}`,
    });
  } catch (error) {
    console.error("Failed to send job completed notification:", error);
  }
}

export async function notifyInvoiceSubmitted(invoiceId: number, amount: string, jobTitle: string) {
  try {
    await notifyOwner({
      title: "Invoice Submitted",
      content: `Invoice #${invoiceId} for $${amount} submitted for job "${jobTitle}". Review and approve in the dashboard.`,
    });
  } catch (error) {
    console.error("Failed to send invoice submitted notification:", error);
  }
}

export async function notifyPaymentDeclared(invoiceId: number, amount: string) {
  try {
    await notifyOwner({
      title: "Payment Declared",
      content: `Invoice #${invoiceId} for $${amount} is awaiting payment approval.`,
    });
  } catch (error) {
    console.error("Failed to send payment declared notification:", error);
  }
}

export async function notifyPaymentApproved(invoiceId: number, amount: string) {
  try {
    await notifyOwner({
      title: "Payment Approved",
      content: `Invoice #${invoiceId} for $${amount} has been approved and marked as paid.`,
    });
  } catch (error) {
    console.error("Failed to send payment approved notification:", error);
  }
}

export async function notifyInvoiceRejected(invoiceId: number, amount: string) {
  try {
    await notifyOwner({
      title: "Invoice Rejected",
      content: `Invoice #${invoiceId} for $${amount} has been rejected. Please review and resubmit.`,
    });
  } catch (error) {
    console.error("Failed to send invoice rejected notification:", error);
  }
}
