import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

export type User = {
  id: string
  name: string
  email: string
}

type AuthState = {
  user: User | null
  token: string | null
  remember: boolean
  isAuthenticated: boolean
  setAuth: (data: { user: User; token: string; remember?: boolean }) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
}

const authStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const remember = JSON.parse(value)?.state?.remember !== false
    const [target, other] = remember
      ? [localStorage, sessionStorage]
      : [sessionStorage, localStorage]
    target.setItem(name, value)
    other.removeItem(name)
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
    sessionStorage.removeItem(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      remember: true,
      isAuthenticated: false,
      setAuth: ({ user, token, remember = true }) =>
        set({ user, token, remember, isAuthenticated: true }),
      updateUser: (data) =>
        set((state) => (state.user ? { user: { ...state.user, ...data } } : state)),
      logout: () => set({ user: null, token: null, remember: true, isAuthenticated: false }),
    }),
    {
      name: 'financy-auth',
      storage: createJSONStorage(() => authStorage),
      partialize: ({ user, token, remember, isAuthenticated }) => ({
        user,
        token,
        remember,
        isAuthenticated,
      }),
    }
  )
)
