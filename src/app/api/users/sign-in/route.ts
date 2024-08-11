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

    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    const validPassword = await bcrypt.compare(res[0].password, password);

    if (res.length === 0 && !validPassword) {
      return NextResponse.json(
        { error: "check your credentials" },
        { status: 401 }
      );
    }
    if (!res[0].isVerified) {
      return NextResponse.json({ error: "user not verified" }, { status: 401 });
    }

    const payload = {
      id: res[0].id,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    // Handle successful case
    const nextREs = NextResponse.json({
      message: "User authenticated",
      user: res[0],
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
