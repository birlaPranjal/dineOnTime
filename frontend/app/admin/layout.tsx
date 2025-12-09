import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Don't protect the entire admin layout - let individual pages handle their own protection
  // The login page should not be protected
  return <>{children}</>
}
