// src/app/profile/layout.tsx
import React from "react";

export const metadata = {
  title: "User Dashboard | Nexus Tech",
  description: "Manage your investments and track profits on Nexus Tech.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-darkmode text-white min-h-screen">
      {children}
    </div>
  );
}
