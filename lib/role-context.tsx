"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "Admin" | "Manager" | "Employee"

export const ROLE_PASSCODES: Record<UserRole, string> = {
  Admin: "admin123",
  Manager: "manager123",
  Employee: "employee123",
}

interface RoleContextType {
  role: UserRole | null
  isAuthenticated: boolean
  login: (selectedRole: UserRole, passcode: string) => boolean
  logout: () => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Hydrate from localStorage on client load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("blueprint_auth_role") as UserRole | null
      const savedAuth = localStorage.getItem("blueprint_is_authenticated") === "true"
      if (savedRole && savedAuth && (savedRole === "Admin" || savedRole === "Manager" || savedRole === "Employee")) {
        setRole(savedRole)
        setIsAuthenticated(true)
      }
    }
  }, [])

  const login = (selectedRole: UserRole, passcode: string): boolean => {
    const expected = ROLE_PASSCODES[selectedRole]
    if (passcode === expected) {
      setRole(selectedRole)
      setIsAuthenticated(true)
      if (typeof window !== "undefined") {
        localStorage.setItem("blueprint_auth_role", selectedRole)
        localStorage.setItem("blueprint_is_authenticated", "true")
      }
      return true
    }
    return false
  }

  const logout = () => {
    setRole(null)
    setIsAuthenticated(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("blueprint_auth_role")
      localStorage.removeItem("blueprint_is_authenticated")
    }
  }

  return (
    <RoleContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}