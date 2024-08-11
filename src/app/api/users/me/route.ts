import { db, usersTable } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { verify, JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      console.log("token not found");
      return NextResponse.json({ error: "token not found" }, { status: 400 });
    }

    const decodeToken = verify(token, process.env.TOKEN_SECRET!);
    if (!decodeToken || typeof decodeToken === "string") {
      console.log("Error decoding token");
      return NextResponse.json(
        { error: "error decoding token" },
        { status: 400 }
      );
    }

    const userId = (decodeToken as JwtPayload).id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in token" },
        { status: 400 }
      );
    }

    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!res[0]) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    return NextResponse.json(
      { status: "success", data: res[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { error: "error getting me data" },
      { status: 400 }
    );
  }
};
