"use client";

import { LogOut, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AuthForm } from "../AuthForm/AuthForm";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { UserDropdown } from "../UserDropdown/UserDropdown";
import { createClient } from "@/lib/supabase/client";

export const Header: React.FC<{
  genres: Array<{ slug: string; title: string }>;
  countries: Array<{ slug: string; title: string }>;
}> = ({ genres, countries }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const user = useCurrentUser();

  const supabase = createClient();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);

  const goToGenres = (slug: string) => {
    router.push(`/explore/${slug}`);
  };

  const goToSearch = () => {
    router.push(`/search`);
  };

  const goToCountry = (slug: string) => {
    router.push(`/country/${slug}`);
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };
  return (
    <>
      <header className="header">
        <div className="container h-full">
          {/* ===== Desktop (lg+) ===== */}
          <div className="hidden lg:flex items-center justify-between h-full">
            <div className="flex items-center">
              <Link href="/" className="logo select-none me-6">
                <img src="/logo.webp" alt="logo" />
              </Link>

              <div className="menu">
                <Link href="/phim-bo" className="menu-item px-4 py-2">
                  Phim Bộ
                </Link>
                <Link href="/phim-le" className="menu-item px-4 py-2">
                  Phim Lẻ
                </Link>
                <div className="menu-item dropdown">
                  <div className="label px-4 py-2">Khám Phá</div>
                  <div className="list-items">
                    {genres.map((g: any) => (
                      <div
                        key={g.slug}
                        className="dropdown-item"
                        onClick={() => goToGenres(g.slug)}
                      >
                        {g.title}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="menu-item dropdown">
                  <div className="label px-4 py-2">Quốc Gia</div>
                  <div className="list-items">
                    {countries.map((g: any) => (
                      <div
                        key={g.slug}
                        className="dropdown-item"
                        onClick={() => goToCountry(g.slug)}
                      >
                        {g.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="cursor-pointer" onClick={goToSearch}>
                <Search />
              </button>
              {user ? <UserDropdown user={user} /> : <AuthForm />}
            </div>
          </div>

          {/* ===== Mobile (< lg) ===== */}
          <div className="flex lg:hidden items-center justify-between h-full">
            <Link href="/" className="logo select-none">
              <img src="/logo.webp" alt="logo" />
            </Link>

            <div className="flex items-center gap-4">
              <button onClick={goToSearch}>
                <Search />
              </button>
              {user ? <UserDropdown user={user} /> : <AuthForm />}
              <button
                className="bg-primary px-3 py-2 text-white rounded"
                onClick={() => setMenuOpen((p) => !p)}
              >
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Mobile menu ===== */}
      {menuOpen &&
        createPortal(
          <div className="mobile-menu">
            <nav className="mobile-nav">
              {user && (
                <div className="mobile-section my-2">
                  <p className="text-2xl font-semibold">
                    Xin chào {user.display_name}
                  </p>
                </div>
              )}
              <div className="mobile-section">
                <Link href="/phim-bo" onClick={() => setMenuOpen(false)}>
                  Thư viện
                </Link>
              </div>

              <div className="mobile-section">
                <Link href="/phim-bo" onClick={() => setMenuOpen(false)}>
                  Phim Bộ
                </Link>
              </div>
              <div className="mobile-section">
                <Link href="/phim-le" onClick={() => setMenuOpen(false)}>
                  Phim Lẻ
                </Link>
              </div>
              <div className="mobile-section">
                <div className="mobile-title">Khám phá</div>
                <div className="mobile-list">
                  {genres.map((g: any) => (
                    <div
                      key={g.slug}
                      className="mobile-item"
                      onClick={() => {
                        setMenuOpen(false);
                        goToGenres(g.slug);
                      }}
                    >
                      {g.title}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mobile-section">
                <div className="mobile-title">Quốc gia</div>
                <div className="mobile-list">
                  {countries.map((g: any) => (
                    <div
                      key={g.slug}
                      className="mobile-item"
                      onClick={() => {
                        setMenuOpen(false);
                        goToCountry(g.slug);
                      }}
                    >
                      {g.title}
                    </div>
                  ))}
                </div>
              </div>

              {user && (
                <div className="mobile-section">
                  <Link href="/phim-bo" onClick={() => setMenuOpen(false)}>
                    <div
                      className="flex flex-row items-center gap-1"
                      onClick={handleLogout}
                    >
                      <LogOut /> Đăng xuất
                    </div>
                  </Link>
                </div>
              )}
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
};
