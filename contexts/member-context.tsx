"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import type { Member } from "@/types/member"
import { getMember, setMember as setStoredMember, removeMember } from "@/lib/storage"

interface MemberContextType {
  member: Member | null
  setMember: (member: Member | null) => void
  isLoading: boolean
}

const MemberContext = createContext<MemberContextType | undefined>(undefined)

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedMember = getMember()
    setMember(storedMember)
    setIsLoading(false)
  }, [])

  const handleSetMember = (newMember: Member | null) => {
    setMember(newMember)
    if (newMember) {
      setStoredMember(newMember)
    } else {
      removeMember()
    }
  }

  return (
    <MemberContext.Provider
      value={{
        member,
        setMember: handleSetMember,
        isLoading
      }}
    >
      {children}
    </MemberContext.Provider>
  )
}

export function useMember() {
  const context = useContext(MemberContext)
  if (context === undefined) {
    throw new Error("useMember must be used within a MemberProvider")
  }
  return context
} 