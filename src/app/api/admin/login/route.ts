import { NextResponse } from "next/server";

export async function POST(request: Request) {

  

  const { password } = await request.json();


  if(password?.trim() !== process.env.ADMIN_PASSWORD?.trim()){

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