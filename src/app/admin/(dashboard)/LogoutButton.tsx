"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", color: "inherit" }}>
      Logout
    </button>
  );
}
