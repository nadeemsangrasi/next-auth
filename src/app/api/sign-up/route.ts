import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db, usersTable } from "@/lib/drizzle";
export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    if (!reqBody) {
      throw new Error("request body is required");
    }
    const { username, email, password } = reqBody;
    //validations
    const salts = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salts);
    //add data in db
    const res = await db
      .insert(usersTable)
      .values({ username: username, email: email, password: hashedPassword });
  } catch (error: any) {
    return NextResponse.json({
      message: "something went wrong",
      error: error.message,
      status: error.status,
    });
  }
};
