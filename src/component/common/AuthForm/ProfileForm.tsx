"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/action/user";

export function ProfileForm({ currentName }: { currentName: string }) {
  const [displayName, setDisplayName] = useState(currentName);
  const [errors, setErrors] = useState<{ displayName?: string }>({});
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const validate = () => {
    const newErrors: { displayName?: string } = {};

    if (!displayName) {
      newErrors.displayName = "Tên hiển thị không được để trống";
    } else if (displayName.length < 2) {
      newErrors.displayName = "Tên hiển thị phải có ít nhất 2 ký tự";
    } else if (displayName.length > 50) {
      newErrors.displayName = "Tên hiển thị không được quá 50 ký tự";
    } else if (
      !/^[a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF ]+$/.test(displayName)
    ) {
      newErrors.displayName =
        "Tên chỉ được chứa chữ cái, số, dấu gạch dưới và khoảng trắng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    startTransition(async () => {
      const res = await updateProfile(displayName);

      if (res.error) {
        setMessage(res.message || "Có lỗi xảy ra");
      } else {
        setMessage("Cập nhật tên thành công");
      }
    });
  };

  return (
    <div className="bg-background rounded p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-lg text-secondary">Tên hiển thị</h2>
        <p className="text-sm text-muted-foreground">
          Thay đổi tên hiển thị của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={`w-full border rounded-lg px-4 py-2 ${
            errors.displayName ? "border-red-500" : ""
          }`}
        />

        {errors.displayName && (
          <p className="text-sm text-red-500">{errors.displayName}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 mt-4 bg-secondary text-background font-semibold rounded-lg"
        >
          {pending ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
