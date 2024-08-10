import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db, usersTable } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/helper/mailer";

// export const GET = async (req: NextRequest) => {
//   try {
//     const res = await db.select().from(usersTable);
//     console.log(res);
//     return NextResponse.json(res);
//   } catch (error:any) {
//     console.log(error.message);
//     return NextResponse.json({ error: error.message, statusbar: error.status });
//   }
// };
export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    if (!reqBody) {
      throw new Error("Request body is required");
    }

    const { username, email, password } = reqBody;

    // Validations
    const hasUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (hasUser.length > 0) {
      return NextResponse.json(
        { error: "user already exists" },
        { status: 400 }
      );
    }

    const salts = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salts);

    // Add data to db
    const res = await db
      .insert(usersTable)
      .values({ username, email, password: hashedPassword })
      .returning();

    await sendEmail({ email, emailType: "VERIFY", userId: res[0].id });
    console.log(res);

    return NextResponse.json({ res, message: "success" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      message: "Something went wrong",
      error: error.message,
      status: error.status,
    });
  }
};
