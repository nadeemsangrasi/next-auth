import { db, usersTable } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const token = cookies().get("token")?.value;
    if (!token) {
      console.log("token not found");
      return NextResponse.json({ error: "token not found" }, { status: 400 });
    }
    const decodeToken = verify(token, process.env.TOKEN_SECRET!);
    if (!decodeToken) {
      console.log("Error decoding token");
      return NextResponse.json(
        { error: "error decoding token" },
        { status: 400 }
      );
    }

    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, decodeToken.id));

    if (!res[0]) {
      return NextResponse.json({ message: "user not  found" }, { status: 400 });
    }

    return NextResponse.json(
      { status: "success", data: res[0] },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { error: "error geting me data" },
      { status: 4004 }
    );
  }
};
