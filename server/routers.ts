import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import * as notificationHelpers from "./notifications";
import * as inAppNotifications from "./inAppNotifications";
import { notificationsRouter } from "./routers/notifications";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Jobs router
  jobs: router({
    list: protectedProcedure.query(async () => {
      return db.getAllJobs();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getJobById(input.id);
      }),

    getByProperty: protectedProcedure
      .input(z.object({ propertyId: z.number() }))
      .query(async ({ input }) => {
        return db.getJobsByPropertyId(input.propertyId);
      }),

    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        propertyId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createJob({
          title: input.title,
          description: input.description,
          propertyId: input.propertyId,
          amount: input.amount as any,
          status: "pending",
          createdBy: ctx.user.id,
        });
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "assigned", "in_progress", "completed", "cancelled"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const job = await db.getJobById(input.id);
        if (!job) throw new TRPCError({ code: "NOT_FOUND" });
        
        // Only admin or assigned user can update
        if (ctx.user.role !== "admin" && job.assignedToId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const result = await db.updateJobStatus(input.id, input.status);
        
        // Send notifications for completed jobs
        if (input.status === "completed") {
          await notificationHelpers.notifyJobCompleted(job.title, job.amount.toString());
          // Also send in-app notification to admin
          await inAppNotifications.notifyJobCompletedInApp(input.id, job.title, ctx.user.id);
        }
        
        return result;
      }),

    assignToUser: adminProcedure
      .input(z.object({
        jobId: z.number(),
        userId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db_module = await import("./db");
        const drizzle = await db_module.getDb();
        if (!drizzle) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        
        const { jobs } = await import("../drizzle/schema");
        return drizzle.update(jobs).set({ assignedToId: input.userId }).where(
          (await import("drizzle-orm")).eq(jobs.id, input.jobId)
        );
      }),
  }),

  // Invoices router
  invoices: router({
    list: protectedProcedure.query(async () => {
      return db.getAllInvoices();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getInvoiceById(input.id);
      }),

    getByJob: protectedProcedure
      .input(z.object({ jobId: z.number() }))
      .query(async ({ input }) => {
        return db.getInvoicesByJobId(input.jobId);
      }),

    create: protectedProcedure
      .input(z.object({
        jobId: z.number(),
        amount: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createInvoice({
          jobId: input.jobId,
          amount: input.amount as any,
          status: "draft",
          submittedBy: ctx.user.id,
        });
      }),

    submit: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const invoice = await db.getInvoiceById(input.id);
        if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });
        
        // Only creator can submit
        if (invoice.submittedBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const result = await db.updateInvoiceStatus(input.id, "submitted");
        
        // Send notifications
        const job = await db.getJobById(invoice.jobId);
        if (job) {
          await notificationHelpers.notifyInvoiceSubmitted(input.id, invoice.amount.toString(), job.title);
          // Send in-app notification to admin
          await inAppNotifications.notifyInvoiceSubmittedInApp(input.id, job.title, invoice.amount.toString(), ctx.user.id);
        }
        
        return result;
      }),

    declarePayment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const invoice = await db.getInvoiceById(input.id);
        if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });
        
        // Only creator can declare payment
        if (invoice.submittedBy !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }

        const result = await db.updateInvoiceStatus(input.id, "payment_declared");
        
        // Send notifications
        await notificationHelpers.notifyPaymentDeclared(input.id, invoice.amount.toString());
        // Send in-app notification to admin
        await inAppNotifications.notifyPaymentDeclaredInApp(input.id, invoice.amount.toString(), ctx.user.id);
        
        return result;
      }),

    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const invoice = await db.getInvoiceById(input.id);
        if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });
        
        const result = await db.updateInvoiceStatus(input.id, "paid", ctx.user.id);
        
        // Send notifications
        await notificationHelpers.notifyPaymentApproved(input.id, invoice.amount.toString());
        // Send in-app notification to contractor
        await inAppNotifications.notifyPaymentApprovedInApp(input.id, invoice.amount.toString(), invoice.submittedBy);
        
        return result;
      }),

    reject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const invoice = await db.getInvoiceById(input.id);
        if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });
        
        const result = await db.updateInvoiceStatus(input.id, "rejected");
        
        // Send notifications
        await notificationHelpers.notifyInvoiceRejected(input.id, invoice.amount.toString());
        // Send in-app notification to contractor
        await inAppNotifications.notifyInvoiceRejectedInApp(input.id, invoice.amount.toString(), invoice.submittedBy);
        
        return result;
      }),
  }),

  // Notifications router
  notifications: notificationsRouter,

  // Properties router
  properties: router({
    getByOwner: protectedProcedure
      .input(z.object({ ownerId: z.number() }))
      .query(async ({ input }) => {
        return db.getPropertiesByOwnerId(input.ownerId);
      }),

    create: adminProcedure
      .input(z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        ownerId: z.number(),
      }))
      .mutation(async ({ input }) => {
        return db.createProperty(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
