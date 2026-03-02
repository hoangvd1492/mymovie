"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useScrollLock } from "usehooks-ts";
import { LoginForm } from "./LogInForm";
import { ResetForm } from "./ResetForm";
import { RegisterForm } from "./RegisterForm";

type Mode = "login" | "register" | "reset";

export function AuthForm({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("login");

  useScrollLock({ autoLock: open });

  const handleClose = () => setOpen(false);
  const handleModeChange = (newMode: Mode) => setMode(newMode);

  useEffect(() => {
    setMode("login");
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger ?? <button className="text-sm font-[900]">ĐĂNG NHẬP</button>}
      </div>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-[380px] rounded-xl bg-background px-8 py-12 shadow-xl"
            >
              {/* CLOSE */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white"
              >
                ✕
              </button>

              {/* TABS */}
              {mode !== "reset" && (
                <div className="flex mb-8">
                  <div className="m-auto flex bg-white/10 rounded-lg p-1">
                    <button
                      onClick={() => handleModeChange("login")}
                      className={`p-2 rounded-md text-sm font-bold w-[128px] ${
                        mode === "login"
                          ? "bg-secondary text-background"
                          : "text-background/60"
                      }`}
                    >
                      ĐĂNG NHẬP
                    </button>
                    <button
                      onClick={() => handleModeChange("register")}
                      className={`p-2 rounded-md text-sm font-bold w-[128px] ${
                        mode === "register"
                          ? "bg-secondary text-background"
                          : "text-background/60"
                      }`}
                    >
                      ĐĂNG KÝ
                    </button>
                  </div>
                </div>
              )}

              {/* FORMS */}
              {mode === "login" && (
                <LoginForm
                  onForgotPassword={() => handleModeChange("reset")}
                  onSuccess={handleClose}
                />
              )}
              {mode === "register" && (
                <RegisterForm onSuccess={() => handleModeChange("login")} />
              )}
              {mode === "reset" && (
                <ResetForm onBack={() => handleModeChange("login")} />
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
