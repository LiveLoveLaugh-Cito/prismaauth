import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  const { email, password } = body as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return NextResponse.json(
      { error: "Email dan kata sandi wajib diisi" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !(await compare(password, user.password))) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses login" },
      { status: 500 },
    );
  }
}