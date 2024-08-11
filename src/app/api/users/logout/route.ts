import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    cookies().set("token", "");
    return NextResponse.json({
      messgae: "user log out successfully",
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }
};
