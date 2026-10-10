"use client";

import Link from "next/link";
import { useState } from "react";

type UserData = {
  id: string;
  name: string;
  email: string;
};

type Feedback = {
  message: string;
  isError: boolean;
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setLoggedInUser(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        user?: UserData;
      };

      if (!response.ok || !data.user) {
        setFeedback({
          message: data.error ?? "Login gagal",
          isError: true,
        });
        return;
      }

      setFeedback({ message: "Login berhasil", isError: false });
      setLoggedInUser(data.user);
    } catch {
      setFeedback({ message: "Tidak dapat terhubung ke server", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f4f6f1] text-[#17231d] md:grid-cols-[minmax(280px,0.85fr)_1.15fr]">
      <aside className="flex min-h-[280px] flex-col justify-between bg-[#173c32] p-7 text-[#f7f8f2] md:min-h-screen md:p-12">
        <Link href="/login" className="flex w-fit items-center gap-3 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-md bg-[#d8f278] text-sm font-bold text-[#173c32]">
            P
          </span>
          PrismaAuth
        </Link>
        <div className="my-10 max-w-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#d8f278]">
            AKSES AKUN
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Senang bertemu lagi.
          </h1>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#d4ded8]">
            Masuk untuk melanjutkan ke akun Anda.
          </p>
        </div>
        <p className="text-xs text-[#b6c8bf]">PrismaAuth · 2026</p>
      </aside>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10 md:px-14">
        <div className="w-full max-w-md">
          <p className="mb-3 text-sm font-medium text-[#547164]">Selamat datang</p>
          <h2 className="text-3xl font-semibold tracking-tight">Masuk ke akun</h2>
          <p className="mt-2 text-sm leading-6 text-[#64736b]">
            Gunakan email dan kata sandi yang terdaftar.
          </p>

          {feedback && (
            <div
              aria-live="polite"
              className={`mt-6 rounded-md border px-4 py-3 text-sm ${
                feedback.isError
                  ? "border-[#efc2b8] bg-[#fff1ed] text-[#9c3d2b]"
                  : "border-[#b9d8bc] bg-[#edf8ed] text-[#28613a]"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="h-12 w-full rounded-md border border-[#cbd4cc] bg-white px-3 text-sm outline-none transition focus:border-[#34745e] focus:ring-2 focus:ring-[#34745e]/20"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Kata sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-12 w-full rounded-md border border-[#cbd4cc] bg-white px-3 text-sm outline-none transition focus:border-[#34745e] focus:ring-2 focus:ring-[#34745e]/20"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-md bg-[#24634e] px-4 text-sm font-semibold text-white transition hover:bg-[#1b513f] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "Memeriksa..." : "Masuk"}
            </button>
          </form>

          {loggedInUser && (
            <div className="mt-6 rounded-md border border-[#cbd4cc] bg-white p-4 text-sm text-[#405047]">
              <p className="mb-2 font-semibold text-[#24634e]">
                Status: berhasil login
              </p>
              <p>ID: {loggedInUser.id}</p>
              <p>Nama: {loggedInUser.name}</p>
              <p>Email: {loggedInUser.email}</p>
            </div>
          )}

          <p className="mt-7 text-center text-sm text-[#64736b]">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#24634e] underline-offset-4 hover:underline"
            >
              Daftar
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}