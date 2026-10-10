"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Feedback = {
  message: string;
  isError: boolean;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setFeedback({
          message: data.error ?? "Pendaftaran gagal",
          isError: true,
        });
        return;
      }

      setFeedback({
        message: "Akun berhasil dibuat. Mengalihkan ke login...",
        isError: false,
      });
      window.setTimeout(() => router.push("/login"), 1000);
    } catch {
      setFeedback({ message: "Tidak dapat terhubung ke server", isError: true });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f4f6f1] text-[#17231d] md:grid-cols-[minmax(280px,0.85fr)_1.15fr]">
      <aside className="flex min-h-[280px] flex-col justify-between bg-[#173c32] p-7 text-[#f7f8f2] md:min-h-screen md:p-12">
        <Link href="/register" className="flex w-fit items-center gap-3 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-md bg-[#d8f278] text-sm font-bold text-[#173c32]">
            P
          </span>
          PrismaAuth
        </Link>
        <div className="my-10 max-w-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#d8f278]">
            AKUN BARU
          </p>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
            Mulai dari sini.
          </h1>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[#d4ded8]">
            Buat akun untuk menyimpan akses Anda dengan aman.
          </p>
        </div>
        <p className="text-xs text-[#b6c8bf]">PrismaAuth · 2026</p>
      </aside>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10 md:px-14">
        <div className="w-full max-w-md">
          <p className="mb-3 text-sm font-medium text-[#547164]">Daftar</p>
          <h2 className="text-3xl font-semibold tracking-tight">Buat akun</h2>
          <p className="mt-2 text-sm leading-6 text-[#64736b]">
            Isi detail di bawah untuk mendaftar.
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
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Nama lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                className="h-12 w-full rounded-md border border-[#cbd4cc] bg-white px-3 text-sm outline-none transition focus:border-[#34745e] focus:ring-2 focus:ring-[#34745e]/20"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </div>
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
                maxLength={254}
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
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                className="h-12 w-full rounded-md border border-[#cbd4cc] bg-white px-3 text-sm outline-none transition focus:border-[#34745e] focus:ring-2 focus:ring-[#34745e]/20"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
              />
              <p className="mt-2 text-xs text-[#64736b]">Minimal 8 karakter.</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-md bg-[#24634e] px-4 text-sm font-semibold text-white transition hover:bg-[#1b513f] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmitting ? "Memproses..." : "Daftar sekarang"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[#64736b]">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#24634e] underline-offset-4 hover:underline"
            >
              Masuk
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}