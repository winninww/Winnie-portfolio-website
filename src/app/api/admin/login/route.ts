import { NextResponse } from "next/server";

export async function POST(request: Request) {

  console.log(
    "密码:",
    process.env.ADMIN_PASSWORD
  );

  const { password } = await request.json();


  if(password !== process.env.ADMIN_PASSWORD){

    return NextResponse.json(
      {
        success:false,
        message:"密码错误"
      },
      {
        status:401
      }
    );

  }


  return NextResponse.json({
    success:true
  });

}