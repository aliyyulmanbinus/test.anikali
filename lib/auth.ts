import type { User } from "firebase/auth"
import { serverTimestamp } from "firebase/firestore"

export interface UserProfile {
  uid: string
  email: string
  fullName: string
  role: "admin" | "user"
  createdAt: any
  updatedAt: any
}

// Mock data for demo purposes
const mockUsers: Record<string, UserProfile> = {
  "admin@demo.com": {
    uid: "admin-uid",
    email: "admin@demo.com",
    fullName: "Admin Demo",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "user@demo.com": {
    uid: "user-uid",
    email: "user@demo.com",
    fullName: "User Demo",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  fullName: string,
  role: "admin" | "user" = "user",
) => {
  try {
    // For demo purposes, simulate user creation
    const mockUser: User = {
      uid: `${role}-${Date.now()}`,
      email: email,
      emailVerified: false,
      displayName: fullName,
      isAnonymous: false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
      providerData: [],
      refreshToken: "",
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => "",
      getIdTokenResult: async () => ({}) as any,
      reload: async () => {},
      toJSON: () => ({}),
    }

    // Create user profile
    const userProfile: UserProfile = {
      uid: mockUser.uid,
      email: mockUser.email!,
      fullName,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // Store in mock data for demo
    mockUsers[email] = userProfile

    return { user: mockUser, userProfile }
  } catch (error: any) {
    throw new Error(error.message || "Registration failed")
  }
}

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    // For demo purposes, check mock users
    const userProfile = mockUsers[email]

    if (!userProfile) {
      throw new Error("User not found")
    }

    // Simulate password check (in real app, Firebase handles this)
    if (password.length < 6) {
      throw new Error("Invalid password")
    }

    const mockUser: User = {
      uid: userProfile.uid,
      email: userProfile.email,
      emailVerified: false,
      displayName: userProfile.fullName,
      isAnonymous: false,
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
      providerData: [],
      refreshToken: "",
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => "",
      getIdTokenResult: async () => ({}) as any,
      reload: async () => {},
      toJSON: () => ({}),
    }

    return { user: mockUser, userProfile }
  } catch (error: any) {
    throw new Error(error.message || "Login failed")
  }
}

// Logout user
export const logoutUser = async () => {
  try {
    // For demo purposes, just resolve
    return Promise.resolve()
  } catch (error: any) {
    throw new Error(error.message || "Logout failed")
  }
}

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    // For demo purposes, find user by uid in mock data
    const userProfile = Object.values(mockUsers).find((user) => user.uid === uid)
    return userProfile || null
  } catch (error: any) {
    throw new Error(error.message || "Failed to get user profile")
  }
}
