"use server";
import { db, usersTable } from "@/lib/drizzle";
import { eq } from "drizzle-orm";

export const getUserDataById = async (id: number) => {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!user.length) {
      throw new Error(`User with ID ${id} not found.`);
    }

    return user[0];
  } catch (error: any) {
    console.error(`Error fetching user with ID ${id}:`, error.message);
    throw new Error(`Unable to fetch user data: ${error.message}`);
  }
};
