import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db, usersTable } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/helper/mailer";

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    if (!reqBody) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const { username, email, password } = reqBody;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const result = await db
      .insert(usersTable)
      .values({ username, email, password: hashedPassword })
      .returning();

    // Send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: result[0].id });

    return NextResponse.json(
      { message: "Success", user: result[0] },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
};
