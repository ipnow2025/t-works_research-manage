import type { Member } from "@/types/member"

const STORAGE_KEY = "member"

export function getMember(): Member | null {
  if (typeof window === "undefined") return null
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error("Failed to parse member data from localStorage:", error)
    return null
  }
}

export function setMember(member: Member): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(member))
  } catch (error) {
    console.error("Failed to store member data to localStorage:", error)
  }
}

export function removeMember(): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to remove member data from localStorage:", error)
  }
}

export function hasMember(): boolean {
  if (typeof window === "undefined") return false
  return getMember() !== null
} 