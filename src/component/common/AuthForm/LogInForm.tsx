"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface LoginFormProps {
  onForgotPassword: () => void;
  onSuccess: () => void;
}

export function LoginForm({ onForgotPassword, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors({ password: "Email hoặc mật khẩu không đúng" });
      return;
    }

    console.log("Login success:", data);
    onSuccess();
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
        {errors.email && (
          <span className="text-xs text-red-400">{errors.email}</span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-background/80">Mật khẩu</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          placeholder="Nhập mật khẩu của bạn"
          className="bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white"
        />
        {errors.password && (
          <span className="text-xs text-red-400">{errors.password}</span>
        )}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
          className="accent-secondary w-4 h-4 cursor-pointer"
        />
        <span className="text-sm text-white">Hiện mật khẩu</span>
      </label>

      <div className="mt-4" />

      <div
        className="cursor-pointer text-xs text-white hover:underline hover:text-secondary"
        onClick={onForgotPassword}
      >
        Quên mật khẩu?
      </div>

      <button
        type="submit"
        className="bg-secondary text-background font-bold py-2 rounded-md mt-2 hover:opacity-90 transition-opacity"
      >
        ĐĂNG NHẬP
      </button>
    </form>
  );
}
