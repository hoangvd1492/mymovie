"use client";
import { createClient } from "@/lib/supabase/client";
import React, { useState } from "react";

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    repeatPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!username) {
      newErrors.username = "Tên người dùng không được để trống";
    } else if (username.length < 3) {
      newErrors.username = "Tên người dùng phải có ít nhất 3 ký tự";
    } else if (username.length > 30) {
      newErrors.username = "Tên người dùng không được quá 30 ký tự";
    } else if (!/^[a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF ]+$/.test(username)) {
      newErrors.username =
        "Tên người dùng chỉ được chứa chữ cái, số, dấu gạch dưới và khoảng trắng";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
      }
    }

    if (!repeatPassword) {
      newErrors.repeatPassword = "Vui lòng nhập lại mật khẩu";
    } else if (repeatPassword !== password) {
      newErrors.repeatPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username.trim() } },
    });

    if (error) {
      setErrors({ email: error.message });
      return;
    }

    console.log("Register success:", data);
    alert("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
    onSuccess();
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
        <label className="text-sm font-bold text-background/80">
          Tên người dùng
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          autoComplete="off"
          placeholder="Nhập tên hiển thị của bạn"
          className="bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white"
        />
        {errors.username && (
          <span className="text-xs text-red-400">{errors.username}</span>
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

      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-background/80">
          Nhập lại mật khẩu
        </label>
        <input
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          placeholder="Xác nhận mật khẩu của bạn"
          className="bg-white/5 border border-white/10 rounded-md px-4 py-2 text-white"
        />
        {errors.repeatPassword && (
          <span className="text-xs text-red-400">{errors.repeatPassword}</span>
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

      <button
        type="submit"
        className="bg-secondary text-background font-bold py-2 rounded-md mt-2 hover:opacity-90 transition-opacity"
      >
        TẠO TÀI KHOẢN
      </button>
    </form>
  );
}
