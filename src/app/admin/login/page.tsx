"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {

  const router = useRouter();

  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  async function login(){

    const res = await fetch("/api/admin/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        password,
      }),
    });


    if(res.ok){
      router.push("/admin");
    }else{
      setError("密码错误");
    }

  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-white">

      <div className="w-[360px]">

        <h1 className="text-2xl mb-8">
          后台登录
        </h1>


        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="请输入密码"
          className="w-full border px-4 py-3"
        />


        <button
          onClick={login}
          className="mt-4 w-full border py-3"
        >
          登录
        </button>


        {
          error &&
          <p className="mt-3 text-red-500">
            {error}
          </p>
        }


      </div>

    </main>
  );
}