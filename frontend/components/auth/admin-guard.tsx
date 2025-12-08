"use client"

import { RoleGuard } from "./role-guard"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  return <RoleGuard allowedRoles={["admin"]} redirectTo="/admin/login">{children}</RoleGuard>
}

