import { NextResponse } from "next/server";
import { saveUploadBuffer } from "@/data/serverUploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((item): item is File => item instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "没有收到图片文件。" }, { status: 400 });
    }

    const paths = await Promise.all(
      files.map(async (file) => {
        if (!file.type.startsWith("image/")) {
          throw new Error(`不支持的文件类型：${file.type || file.name}`);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        return saveUploadBuffer(buffer, file.type, file.name);
      })
    );

    return NextResponse.json({ paths });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: `图片保存失败：${message}` }, { status: 500 });
  }
}
