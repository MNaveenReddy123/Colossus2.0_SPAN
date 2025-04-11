import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase - with safeguards to prevent errors
let app
try {
  // Check if all required config values are present
  const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "appId"]
  const missingKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key])

  if (missingKeys.length > 0) {
    console.error(`Firebase initialization error: Missing required config keys: ${missingKeys.join(", ")}`)
    // Provide fallback values for development only
    app = initializeApp({
      apiKey: "DEMO-API-KEY-FOR-DEVELOPMENT-ONLY",
      authDomain: "demo-app.firebaseapp.com",
      projectId: "demo-project",
      storageBucket: "demo-app.appspot.com",
      messagingSenderId: "123456789012",
      appId: "1:123456789012:web:a1b2c3d4e5f6a7b8c9d0e1",
    })
    console.warn("Using demo Firebase configuration for development. Authentication features will be limited.")
  } else {
    app = initializeApp(firebaseConfig)
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  // Fallback initialization with minimal config
  app = initializeApp({
    apiKey: "DEMO-API-KEY-FOR-DEVELOPMENT-ONLY",
    authDomain: "demo-app.firebaseapp.com",
    projectId: "demo-project",
  })
  console.warn("Using fallback Firebase configuration. Authentication features will be limited.")
}

const auth = getAuth(app)

// Authentication functions
export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const registerWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const logoutUser = () => {
  return signOut(auth)
}

export const getCurrentUser = () => {
  return auth.currentUser
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

export { auth }
