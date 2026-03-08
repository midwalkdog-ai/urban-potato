import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";
import { TRPCError } from "@trpc/server";

export const notificationsRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }).optional())
    .query(async ({ input, ctx }) => {
      return db.getNotificationsByUserId(ctx.user.id, input?.limit || 50);
    }),

  unread: protectedProcedure.query(async ({ ctx }) => {
    return db.getUnreadNotifications(ctx.user.id);
  }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const unread = await db.getUnreadNotifications(ctx.user.id);
    return unread.length;
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const notification = await db.getNotificationById(input.id);
      if (!notification) throw new TRPCError({ code: "NOT_FOUND" });
      
      // Verify ownership
      if (notification.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return db.markNotificationAsRead(input.id);
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return db.markAllNotificationsAsRead(ctx.user.id);
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const notification = await db.getNotificationById(input.id);
      if (!notification) throw new TRPCError({ code: "NOT_FOUND" });
      
      // Verify ownership
      if (notification.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return db.deleteNotification(input.id);
    }),

  create: protectedProcedure
    .input(z.object({
      userId: z.number(),
      title: z.string(),
      message: z.string(),
      type: z.enum(["info", "success", "warning", "error", "job", "invoice", "payment"]),
      actionUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return db.createNotification({
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        actionUrl: input.actionUrl,
      });
    }),
});
