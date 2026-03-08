import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobs, Job, InsertJob, invoices, Invoice, InsertInvoice, properties, InsertProperty, notifications, Notification, InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Jobs queries
export async function getJobsByPropertyId(propertyId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobs).where(eq(jobs.propertyId, propertyId));
}

export async function getJobById(jobId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  return result[0];
}

export async function createJob(data: InsertJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobs).values(data);
  return result;
}

export async function updateJobStatus(jobId: number, status: Job['status']) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(jobs).set({ status }).where(eq(jobs.id, jobId));
}

// Invoices queries
export async function getInvoicesByJobId(jobId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invoices).where(eq(invoices.jobId, jobId));
}

export async function getInvoiceById(invoiceId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
  return result[0];
}

export async function createInvoice(data: InsertInvoice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(invoices).values(data);
  return result;
}

export async function updateInvoiceStatus(invoiceId: number, status: Invoice['status'], approvedBy?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: any = { status };
  if (status === 'paid' && approvedBy) {
    updateData.approvedBy = approvedBy;
    updateData.approvedAt = new Date();
  }
  return db.update(invoices).set(updateData).where(eq(invoices.id, invoiceId));
}

export async function getAllInvoices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invoices);
}

export async function getAllJobs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobs);
}

// Properties queries
export async function getPropertiesByOwnerId(ownerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).where(eq(properties.ownerId, ownerId));
}

export async function createProperty(data: InsertProperty) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(properties).values(data);
  return result;
}

// Notification queries
export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(notifications).values(data);
}

export async function getNotificationsByUserId(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId) && eq(notifications.read, 0))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(notifications).set({ read: 1 }).where(eq(notifications.id, notificationId));
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(notifications).set({ read: 1 }).where(eq(notifications.userId, userId));
}

export async function deleteNotification(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(notifications).where(eq(notifications.id, notificationId));
}

export async function getNotificationById(notificationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(notifications)
    .where(eq(notifications.id, notificationId))
    .limit(1);
  return result[0];
}
