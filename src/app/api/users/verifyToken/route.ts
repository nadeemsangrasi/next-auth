import { db, usersTable } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const url = req.nextUrl;
    if (!url.searchParams.has("token")) {
      return NextResponse.json({
        message: "token is required",
        status: "error",
      });
    }
    const token: string | null = url.searchParams.get("token");
    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.verifyToken, token as string));

    if (!res[0]) {
      return NextResponse.json({ message: "Token not found" }, { status: 404 });
    }
    if (res) {
      const isNotExpired = Number(res[0].verifyTokenExpiry) > Date.now();

      if (isNotExpired) {
        const updatedUser = await db
          .update(usersTable)
          .set({
            isVerified: true,
            verifyToken: null,
            verifyTokenExpiry: null,
          })
          .where(eq(usersTable.id, res[0].id))
          .returning();

        return NextResponse.json({ message: "success", updatedUser });
      } else {
        return NextResponse.json({ message: "Token expired" }, { status: 400 });
      }
    }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message, status: error.status });
  }
};
