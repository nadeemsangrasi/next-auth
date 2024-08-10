import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

import { pgTable, serial, boolean, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", {
    length: 255,
  })
    .unique()
    .notNull(),
  email: varchar("email", {
    length: 255,
  })
    .unique()
    .notNull(),
  password: varchar("password", {
    length: 100,
  }).notNull(),
  isVerified: boolean("isverified").default(false),
  isAdmin: boolean("isadmin").default(false),
  forgotPasswordToken: varchar("forgotpasswordtoken", { length: 255 }),
  forgotPasswordTokenExpiry: varchar("forgotpasswordtokenexpiry", {
    length: 255,
  }),
  verifyToken: varchar("verifytoken", { length: 255 }),
  verifyTokenExpiry: varchar("verifytokenexpiry", { length: 255 }),
});

export const db = drizzle(sql);
