import * as db from "./db";

/**
 * Send in-app notifications for key business events
 * These are stored in the database and displayed in the notification center
 */

export async function notifyJobAssignedInApp(jobId: number, jobTitle: string, contractorId: number) {
  try {
    await db.createNotification({
      userId: contractorId,
      title: "New Job Assigned",
      message: `You have been assigned to: ${jobTitle}`,
      type: "job",
      actionUrl: `/jobs/${jobId}`,
    });
  } catch (error) {
    console.error("Failed to send job assigned notification:", error);
  }
}

export async function notifyJobCompletedInApp(jobId: number, jobTitle: string, adminId: number) {
  try {
    await db.createNotification({
      userId: adminId,
      title: "Job Completed",
      message: `${jobTitle} has been marked as completed`,
      type: "job",
      actionUrl: `/jobs/${jobId}`,
    });
  } catch (error) {
    console.error("Failed to send job completed notification:", error);
  }
}

export async function notifyInvoiceSubmittedInApp(invoiceId: number, jobTitle: string, amount: string, adminId: number) {
  try {
    await db.createNotification({
      userId: adminId,
      title: "Invoice Submitted",
      message: `Invoice for $${amount} submitted for ${jobTitle}. Review and approve in the dashboard.`,
      type: "invoice",
      actionUrl: `/invoices/${invoiceId}`,
    });
  } catch (error) {
    console.error("Failed to send invoice submitted notification:", error);
  }
}

export async function notifyPaymentDeclaredInApp(invoiceId: number, amount: string, adminId: number) {
  try {
    await db.createNotification({
      userId: adminId,
      title: "Payment Declared",
      message: `Invoice #${invoiceId} for $${amount} is awaiting payment approval.`,
      type: "payment",
      actionUrl: `/invoices/${invoiceId}`,
    });
  } catch (error) {
    console.error("Failed to send payment declared notification:", error);
  }
}

export async function notifyPaymentApprovedInApp(invoiceId: number, amount: string, contractorId: number) {
  try {
    await db.createNotification({
      userId: contractorId,
      title: "Payment Approved",
      message: `Invoice #${invoiceId} for $${amount} has been approved and marked as paid.`,
      type: "success",
      actionUrl: `/invoices/${invoiceId}`,
    });
  } catch (error) {
    console.error("Failed to send payment approved notification:", error);
  }
}

export async function notifyInvoiceRejectedInApp(invoiceId: number, amount: string, contractorId: number) {
  try {
    await db.createNotification({
      userId: contractorId,
      title: "Invoice Rejected",
      message: `Invoice #${invoiceId} for $${amount} has been rejected. Please review and resubmit.`,
      type: "error",
      actionUrl: `/invoices/${invoiceId}`,
    });
  } catch (error) {
    console.error("Failed to send invoice rejected notification:", error);
  }
}

export async function notifyAllAdminsInApp(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  try {
    // Get all admin users from database
    const db_module = await import("./db");
    const drizzle = await db_module.getDb();
    if (!drizzle) return;

    const { users } = await import("../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    const admins = await drizzle.select().from(users).where(eq(users.role, "admin"));

    for (const admin of admins) {
      await db.createNotification({
        userId: admin.id,
        title,
        message,
        type,
      });
    }
  } catch (error) {
    console.error("Failed to send admin notifications:", error);
  }
}
