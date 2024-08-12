import bcrypt from "bcrypt";
import { db, usersTable } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    if (!reqBody) {
      console.log("request body is null");
      return NextResponse.json(
        { error: "reqest is required" },
        { status: 500 }
      );
    }
    const { email, password } = reqBody;
    if (!email || !password) {
      console.log("Email or password is missing");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    // If no user found, or password doesn't match, return 401
    if (user.length === 0) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user[0].password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 401 }
      );
    }

    // If the user exists but is not verified, return 403
    if (!user[0].isVerified) {
      return NextResponse.json(
        { error: "User not verified. Please check your email." },
        { status: 403 }
      );
    }

    const payload = {
      id: user[0].id,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    // Handle successful case
    const nextREs = NextResponse.json({
      message: "User authenticated",
      user: user[0],
    });

    cookies().set("token", token);

    return NextResponse.json({ nextREs }, { status: 200 });
  } catch (error: any) {
    console.log(error.messsage);
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }
};
