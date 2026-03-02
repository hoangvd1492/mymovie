"use client";
import { createClient } from "@/lib/supabase/client";
import React, { useState } from "react";

interface ResetFormProps {
  onBack: () => void;
}

export function ResetForm({ onBack }: ResetFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email không được để trống");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/nguoi-dung`,
      },
    );

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-white text-sm">
          Đã gửi email đặt lại mật khẩu tới <strong>{email}</strong>. Vui lòng
          kiểm tra hộp thư.
        </p>
        <button
          onClick={onBack}
          className="text-xs text-white hover:underline hover:text-secondary"
        >
          ← Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-sm text-white/70 mb-2">
        Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
      </p>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-background/80">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="off"
          placeholder="Nhập email của bạn"
          className="bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white"
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>

      <div className="mt-4" />

      <button
        type="submit"
        className="bg-secondary text-background font-bold py-2 rounded-md mt-2 hover:opacity-90 transition-opacity"
      >
        GỬI LIÊN KẾT
      </button>

      <button
        type="button"
        onClick={onBack}
        className="text-xs text-white hover:underline hover:text-secondary mt-1"
      >
        ← Quay lại đăng nhập
      </button>
    </form>
  );
}
