var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  invoices: () => invoices,
  jobs: () => jobs,
  notifications: () => notifications,
  properties: () => properties,
  users: () => users
});
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";
var users, properties, jobs, invoices, notifications;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      /**
       * Surrogate primary key. Auto-incremented numeric value managed by the database.
       * Use this for relations between tables.
       */
      id: int("id").autoincrement().primaryKey(),
      /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    properties = mysqlTable("properties", {
      id: int("id").autoincrement().primaryKey(),
      address: varchar("address", { length: 255 }).notNull(),
      city: varchar("city", { length: 100 }).notNull(),
      state: varchar("state", { length: 50 }).notNull(),
      zipCode: varchar("zipCode", { length: 20 }).notNull(),
      ownerId: int("ownerId").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    jobs = mysqlTable("jobs", {
      id: int("id").autoincrement().primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      propertyId: int("propertyId").notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      status: mysqlEnum("status", ["pending", "assigned", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
      assignedToId: int("assignedToId"),
      createdBy: int("createdBy").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    invoices = mysqlTable("invoices", {
      id: int("id").autoincrement().primaryKey(),
      jobId: int("jobId").notNull(),
      amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
      status: mysqlEnum("status", ["draft", "submitted", "payment_declared", "paid", "rejected"]).default("draft").notNull(),
      submittedBy: int("submittedBy").notNull(),
      submittedAt: timestamp("submittedAt"),
      approvedBy: int("approvedBy"),
      approvedAt: timestamp("approvedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    notifications = mysqlTable("notifications", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      message: text("message").notNull(),
      type: mysqlEnum("type", ["info", "success", "warning", "error", "job", "invoice", "payment"]).default("info").notNull(),
      read: int("read").default(0).notNull(),
      actionUrl: varchar("actionUrl", { length: 500 }),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  createInvoice: () => createInvoice,
  createJob: () => createJob,
  createNotification: () => createNotification,
  createProperty: () => createProperty,
  deleteNotification: () => deleteNotification,
  getAllInvoices: () => getAllInvoices,
  getAllJobs: () => getAllJobs,
  getDb: () => getDb,
  getInvoiceById: () => getInvoiceById,
  getInvoicesByJobId: () => getInvoicesByJobId,
  getJobById: () => getJobById,
  getJobsByPropertyId: () => getJobsByPropertyId,
  getNotificationById: () => getNotificationById,
  getNotificationsByUserId: () => getNotificationsByUserId,
  getPropertiesByOwnerId: () => getPropertiesByOwnerId,
  getUnreadNotifications: () => getUnreadNotifications,
  getUserByOpenId: () => getUserByOpenId,
  markAllNotificationsAsRead: () => markAllNotificationsAsRead,
  markNotificationAsRead: () => markNotificationAsRead,
  updateInvoiceStatus: () => updateInvoiceStatus,
  updateJobStatus: () => updateJobStatus,
  upsertUser: () => upsertUser
});
import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
async function getDb() {
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getJobsByPropertyId(propertyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobs).where(eq(jobs.propertyId, propertyId));
}
async function getJobById(jobId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  return result[0];
}
async function createJob(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(jobs).values(data);
  return result;
}
async function updateJobStatus(jobId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(jobs).set({ status }).where(eq(jobs.id, jobId));
}
async function getInvoicesByJobId(jobId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invoices).where(eq(invoices.jobId, jobId));
}
async function getInvoiceById(invoiceId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
  return result[0];
}
async function createInvoice(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(invoices).values(data);
  return result;
}
async function updateInvoiceStatus(invoiceId, status, approvedBy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData = { status };
  if (status === "paid" && approvedBy) {
    updateData.approvedBy = approvedBy;
    updateData.approvedAt = /* @__PURE__ */ new Date();
  }
  return db.update(invoices).set(updateData).where(eq(invoices.id, invoiceId));
}
async function getAllInvoices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invoices);
}
async function getAllJobs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(jobs);
}
async function getPropertiesByOwnerId(ownerId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).where(eq(properties.ownerId, ownerId));
}
async function createProperty(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(properties).values(data);
  return result;
}
async function createNotification(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(notifications).values(data);
}
async function getNotificationsByUserId(userId, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}
async function getUnreadNotifications(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId) && eq(notifications.read, 0)).orderBy(desc(notifications.createdAt));
}
async function markNotificationAsRead(notificationId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(notifications).set({ read: 1 }).where(eq(notifications.id, notificationId));
}
async function markAllNotificationsAsRead(userId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(notifications).set({ read: 1 }).where(eq(notifications.userId, userId));
}
async function deleteNotification(notificationId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(notifications).where(eq(notifications.id, notificationId));
}
async function getNotificationById(notificationId) {
  const db = await getDb();
  if (!db) return void 0;
  const result = await db.select().from(notifications).where(eq(notifications.id, notificationId)).limit(1);
  return result[0];
}
var _db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    _db = null;
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_db();
import { z as z3 } from "zod";
import { TRPCError as TRPCError4 } from "@trpc/server";

// server/notifications.ts
async function notifyJobCompleted(jobTitle, amount) {
  try {
    await notifyOwner({
      title: "Job Completed",
      content: `Job "${jobTitle}" has been marked as completed. Amount: $${amount}`
    });
  } catch (error) {
    console.error("Failed to send job completed notification:", error);
  }
}
async function notifyInvoiceSubmitted(invoiceId, amount, jobTitle) {
  try {
    await notifyOwner({
      title: "Invoice Submitted",
      content: `Invoice #${invoiceId} for $${amount} submitted for job "${jobTitle}". Review and approve in the dashboard.`
    });
  } catch (error) {
    console.error("Failed to send invoice submitted notification:", error);
  }
}
async function notifyPaymentDeclared(invoiceId, amount) {
  try {
    await notifyOwner({
      title: "Payment Declared",
      content: `Invoice #${invoiceId} for $${amount} is awaiting payment approval.`
    });
  } catch (error) {
    console.error("Failed to send payment declared notification:", error);
  }
}
async function notifyPaymentApproved(invoiceId, amount) {
  try {
    await notifyOwner({
      title: "Payment Approved",
      content: `Invoice #${invoiceId} for $${amount} has been approved and marked as paid.`
    });
  } catch (error) {
    console.error("Failed to send payment approved notification:", error);
  }
}
async function notifyInvoiceRejected(invoiceId, amount) {
  try {
    await notifyOwner({
      title: "Invoice Rejected",
      content: `Invoice #${invoiceId} for $${amount} has been rejected. Please review and resubmit.`
    });
  } catch (error) {
    console.error("Failed to send invoice rejected notification:", error);
  }
}

// server/inAppNotifications.ts
init_db();
async function notifyJobCompletedInApp(jobId, jobTitle, adminId) {
  try {
    await createNotification({
      userId: adminId,
      title: "Job Completed",
      message: `${jobTitle} has been marked as completed`,
      type: "job",
      actionUrl: `/jobs/${jobId}`
    });
  } catch (error) {
    console.error("Failed to send job completed notification:", error);
  }
}
async function notifyInvoiceSubmittedInApp(invoiceId, jobTitle, amount, adminId) {
  try {
    await createNotification({
      userId: adminId,
      title: "Invoice Submitted",
      message: `Invoice for $${amount} submitted for ${jobTitle}. Review and approve in the dashboard.`,
      type: "invoice",
      actionUrl: `/invoices/${invoiceId}`
    });
  } catch (error) {
    console.error("Failed to send invoice submitted notification:", error);
  }
}
async function notifyPaymentDeclaredInApp(invoiceId, amount, adminId) {
  try {
    await createNotification({
      userId: adminId,
      title: "Payment Declared",
      message: `Invoice #${invoiceId} for $${amount} is awaiting payment approval.`,
      type: "payment",
      actionUrl: `/invoices/${invoiceId}`
    });
  } catch (error) {
    console.error("Failed to send payment declared notification:", error);
  }
}
async function notifyPaymentApprovedInApp(invoiceId, amount, contractorId) {
  try {
    await createNotification({
      userId: contractorId,
      title: "Payment Approved",
      message: `Invoice #${invoiceId} for $${amount} has been approved and marked as paid.`,
      type: "success",
      actionUrl: `/invoices/${invoiceId}`
    });
  } catch (error) {
    console.error("Failed to send payment approved notification:", error);
  }
}
async function notifyInvoiceRejectedInApp(invoiceId, amount, contractorId) {
  try {
    await createNotification({
      userId: contractorId,
      title: "Invoice Rejected",
      message: `Invoice #${invoiceId} for $${amount} has been rejected. Please review and resubmit.`,
      type: "error",
      actionUrl: `/invoices/${invoiceId}`
    });
  } catch (error) {
    console.error("Failed to send invoice rejected notification:", error);
  }
}

// server/routers/notifications.ts
init_db();
import { z as z2 } from "zod";
import { TRPCError as TRPCError3 } from "@trpc/server";
var notificationsRouter = router({
  list: protectedProcedure.input(z2.object({ limit: z2.number().default(50) }).optional()).query(async ({ input, ctx }) => {
    return getNotificationsByUserId(ctx.user.id, input?.limit || 50);
  }),
  unread: protectedProcedure.query(async ({ ctx }) => {
    return getUnreadNotifications(ctx.user.id);
  }),
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const unread = await getUnreadNotifications(ctx.user.id);
    return unread.length;
  }),
  markAsRead: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
    const notification = await getNotificationById(input.id);
    if (!notification) throw new TRPCError3({ code: "NOT_FOUND" });
    if (notification.userId !== ctx.user.id) {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    return markNotificationAsRead(input.id);
  }),
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return markAllNotificationsAsRead(ctx.user.id);
  }),
  delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ input, ctx }) => {
    const notification = await getNotificationById(input.id);
    if (!notification) throw new TRPCError3({ code: "NOT_FOUND" });
    if (notification.userId !== ctx.user.id) {
      throw new TRPCError3({ code: "FORBIDDEN" });
    }
    return deleteNotification(input.id);
  }),
  create: protectedProcedure.input(z2.object({
    userId: z2.number(),
    title: z2.string(),
    message: z2.string(),
    type: z2.enum(["info", "success", "warning", "error", "job", "invoice", "payment"]),
    actionUrl: z2.string().optional()
  })).mutation(async ({ input }) => {
    return createNotification({
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      actionUrl: input.actionUrl
    });
  })
});

// server/routers.ts
var adminProcedure2 = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError4({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Jobs router
  jobs: router({
    list: protectedProcedure.query(async () => {
      return getAllJobs();
    }),
    getById: protectedProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getJobById(input.id);
    }),
    getByProperty: protectedProcedure.input(z3.object({ propertyId: z3.number() })).query(async ({ input }) => {
      return getJobsByPropertyId(input.propertyId);
    }),
    create: adminProcedure2.input(z3.object({
      title: z3.string(),
      description: z3.string().optional(),
      propertyId: z3.number(),
      amount: z3.string()
    })).mutation(async ({ input, ctx }) => {
      return createJob({
        title: input.title,
        description: input.description,
        propertyId: input.propertyId,
        amount: input.amount,
        status: "pending",
        createdBy: ctx.user.id
      });
    }),
    updateStatus: protectedProcedure.input(z3.object({
      id: z3.number(),
      status: z3.enum(["pending", "assigned", "in_progress", "completed", "cancelled"])
    })).mutation(async ({ input, ctx }) => {
      const job = await getJobById(input.id);
      if (!job) throw new TRPCError4({ code: "NOT_FOUND" });
      if (ctx.user.role !== "admin" && job.assignedToId !== ctx.user.id) {
        throw new TRPCError4({ code: "FORBIDDEN" });
      }
      const result = await updateJobStatus(input.id, input.status);
      if (input.status === "completed") {
        await notifyJobCompleted(job.title, job.amount.toString());
        await notifyJobCompletedInApp(input.id, job.title, ctx.user.id);
      }
      return result;
    }),
    assignToUser: adminProcedure2.input(z3.object({
      jobId: z3.number(),
      userId: z3.number()
    })).mutation(async ({ input }) => {
      const db_module = await Promise.resolve().then(() => (init_db(), db_exports));
      const drizzle2 = await db_module.getDb();
      if (!drizzle2) throw new TRPCError4({ code: "INTERNAL_SERVER_ERROR" });
      const { jobs: jobs2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      return drizzle2.update(jobs2).set({ assignedToId: input.userId }).where(
        (await import("drizzle-orm")).eq(jobs2.id, input.jobId)
      );
    })
  }),
  // Invoices router
  invoices: router({
    list: protectedProcedure.query(async () => {
      return getAllInvoices();
    }),
    getById: protectedProcedure.input(z3.object({ id: z3.number() })).query(async ({ input }) => {
      return getInvoiceById(input.id);
    }),
    getByJob: protectedProcedure.input(z3.object({ jobId: z3.number() })).query(async ({ input }) => {
      return getInvoicesByJobId(input.jobId);
    }),
    create: protectedProcedure.input(z3.object({
      jobId: z3.number(),
      amount: z3.string()
    })).mutation(async ({ input, ctx }) => {
      return createInvoice({
        jobId: input.jobId,
        amount: input.amount,
        status: "draft",
        submittedBy: ctx.user.id
      });
    }),
    submit: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input, ctx }) => {
      const invoice = await getInvoiceById(input.id);
      if (!invoice) throw new TRPCError4({ code: "NOT_FOUND" });
      if (invoice.submittedBy !== ctx.user.id) {
        throw new TRPCError4({ code: "FORBIDDEN" });
      }
      const result = await updateInvoiceStatus(input.id, "submitted");
      const job = await getJobById(invoice.jobId);
      if (job) {
        await notifyInvoiceSubmitted(input.id, invoice.amount.toString(), job.title);
        await notifyInvoiceSubmittedInApp(input.id, job.title, invoice.amount.toString(), ctx.user.id);
      }
      return result;
    }),
    declarePayment: protectedProcedure.input(z3.object({ id: z3.number() })).mutation(async ({ input, ctx }) => {
      const invoice = await getInvoiceById(input.id);
      if (!invoice) throw new TRPCError4({ code: "NOT_FOUND" });
      if (invoice.submittedBy !== ctx.user.id) {
        throw new TRPCError4({ code: "FORBIDDEN" });
      }
      const result = await updateInvoiceStatus(input.id, "payment_declared");
      await notifyPaymentDeclared(input.id, invoice.amount.toString());
      await notifyPaymentDeclaredInApp(input.id, invoice.amount.toString(), ctx.user.id);
      return result;
    }),
    approve: adminProcedure2.input(z3.object({ id: z3.number() })).mutation(async ({ input, ctx }) => {
      const invoice = await getInvoiceById(input.id);
      if (!invoice) throw new TRPCError4({ code: "NOT_FOUND" });
      const result = await updateInvoiceStatus(input.id, "paid", ctx.user.id);
      await notifyPaymentApproved(input.id, invoice.amount.toString());
      await notifyPaymentApprovedInApp(input.id, invoice.amount.toString(), invoice.submittedBy);
      return result;
    }),
    reject: adminProcedure2.input(z3.object({ id: z3.number() })).mutation(async ({ input }) => {
      const invoice = await getInvoiceById(input.id);
      if (!invoice) throw new TRPCError4({ code: "NOT_FOUND" });
      const result = await updateInvoiceStatus(input.id, "rejected");
      await notifyInvoiceRejected(input.id, invoice.amount.toString());
      await notifyInvoiceRejectedInApp(input.id, invoice.amount.toString(), invoice.submittedBy);
      return result;
    })
  }),
  // Notifications router
  notifications: notificationsRouter,
  // Properties router
  properties: router({
    getByOwner: protectedProcedure.input(z3.object({ ownerId: z3.number() })).query(async ({ input }) => {
      return getPropertiesByOwnerId(input.ownerId);
    }),
    create: adminProcedure2.input(z3.object({
      address: z3.string(),
      city: z3.string(),
      state: z3.string(),
      zipCode: z3.string(),
      ownerId: z3.number()
    })).mutation(async ({ input }) => {
      return createProperty(input);
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
