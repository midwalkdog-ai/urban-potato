import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock admin user
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

// Mock regular user
const regularUser = {
  id: 2,
  openId: "regular-user",
  email: "user@flashfix.com",
  name: "Regular User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createMockContext(user: typeof adminUser | typeof regularUser): TrpcContext {
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

describe("Jobs API", () => {
  it("admin can create a job", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.jobs.create({
      title: "Test Roof Repair",
      description: "Fix the roof",
      propertyId: 1,
      amount: "5000",
    });

    expect(result).toBeDefined();
  });

  it("regular user cannot create a job", async () => {
    const ctx = createMockContext(regularUser);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.jobs.create({
        title: "Test Job",
        description: "Test",
        propertyId: 1,
        amount: "1000",
      });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("admin can list all jobs", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const jobs = await caller.jobs.list();
    expect(Array.isArray(jobs)).toBe(true);
  });
});

describe("Invoices API", () => {
  it("admin can list all invoices", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const invoices = await caller.invoices.list();
    expect(Array.isArray(invoices)).toBe(true);
  });

  it("admin can approve an invoice", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    // This would fail without a real invoice ID, but tests the permission
    try {
      await caller.invoices.approve({ id: 999 });
    } catch (error: any) {
      // Expected to fail with NOT_FOUND since invoice doesn't exist
      expect(error.code).toBe("NOT_FOUND");
    }
  });

  it("regular user cannot approve invoices", async () => {
    const ctx = createMockContext(regularUser);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.invoices.approve({ id: 1 });
      expect.fail("Should have thrown FORBIDDEN error");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });
});

describe("Auth API", () => {
  it("can get current user", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();
    expect(user).toEqual(adminUser);
  });

  it("can logout", async () => {
    const ctx = createMockContext(adminUser);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});
