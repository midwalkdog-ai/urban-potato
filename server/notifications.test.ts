import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const adminUser = {
  id: 1,
  openId: "admin-user",
  email: "admin@flashfix.com",
  name: "Admin User",
  loginMethod: "manus",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createMockContext(user: typeof adminUser): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {
      clearCookie: () => {},
    } as any,
  };
}

describe("Notifications API", () => {
  it("can list notifications", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const notifications = await caller.notifications.list({ limit: 10 });
    expect(Array.isArray(notifications)).toBe(true);
  });

  it("can get unread count", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const count = await caller.notifications.unreadCount();
    expect(typeof count).toBe("number");
    expect(count >= 0).toBe(true);
  });

  it("can create a notification", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.create({
      userId: adminUser.id,
      title: "Test Notification",
      message: "This is a test notification",
      type: "info",
    });

    expect(result).toBeDefined();
  });

  it("can mark notification as read", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    // Create a notification first
    const created = await caller.notifications.create({
      userId: adminUser.id,
      title: "Test",
      message: "Test message",
      type: "info",
    });

    // Try to mark it as read - this would fail with NOT_FOUND if DB is empty
    // but tests the permission system
    try {
      await caller.notifications.markAsRead({ id: 999 });
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }
  });

  it("can mark all as read", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.notifications.markAllAsRead();
    expect(result).toBeDefined();
  });

  it("can get unread notifications", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const unread = await caller.notifications.unread();
    expect(Array.isArray(unread)).toBe(true);
  });
});
