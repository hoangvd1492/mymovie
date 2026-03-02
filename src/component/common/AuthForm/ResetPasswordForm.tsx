"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/lib/action/user";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirm?: string;
  }>({});
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const validate = () => {
    const newErrors: {
      password?: string;
      confirm?: string;
    } = {};

    if (!password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

      if (!passwordRegex.test(password)) {
        newErrors.password =
          "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
      }
    }

    if (!confirm.trim()) {
      newErrors.confirm = "Vui lòng nhập lại mật khẩu";
    } else if (confirm !== password) {
      newErrors.confirm = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    startTransition(async () => {
      const res = await changePassword(password);

      if (res.error) {
        setMessage(res.message || "Có lỗi xảy ra");
      } else {
        setMessage("Đổi mật khẩu thành công");
        setPassword("");
        setConfirm("");
      }
    });
  };

  return (
    <div className="bg-background rounded p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-lg text-secondary">Đổi mật khẩu</h2>
        <p className="text-sm text-muted-foreground">
          Cập nhật mật khẩu đăng nhập
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Mật khẩu mới"
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.password ? "border-red-500" : ""
          }`}
        />

        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={`w-full border rounded-lg px-4 py-2  ${
            errors.confirm ? "border-red-500" : ""
          }`}
        />

        {errors.confirm && (
          <p className="text-sm text-red-500">{errors.confirm}</p>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="accent-secondary w-4 h-4 cursor-pointer"
          />
          <span className="text-sm text-white">Hiện mật khẩu</span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 mt-4 bg-secondary text-background font-semibold rounded-lg"
        >
          {pending ? "Đang đổi..." : "Đổi mật khẩu"}
        </button>
      </form>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
