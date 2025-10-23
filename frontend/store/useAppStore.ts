import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Define the shape of our global state
interface AppState {
  // User related state
  user: {
    id: string | null
    name: string | null
    email: string | null
    isAuthenticated: boolean
  }

  // App settings
  settings: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    language: string
  }

  // Calendar related state
  calendar: {
    selectedDate: string | null
    events: Array<{
      id: string
      title: string
      date: string
      time?: string
      description?: string
    }>
  }

  // Loading states
  loading: {
    user: boolean
    calendar: boolean
    api: boolean
  }

  // Actions
  setUser: (user: Partial<AppState['user']>) => void
  updateSettings: (settings: Partial<AppState['settings']>) => void
  setSelectedDate: (date: string | null) => void
  addEvent: (event: Omit<AppState['calendar']['events'][0], 'id'>) => void
  removeEvent: (eventId: string) => void
  setLoading: (key: keyof AppState['loading'], loading: boolean) => void
  logout: () => void
}

// Create the store with persistence
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        id: null,
        name: null,
        email: null,
        isAuthenticated: false,
      },

      settings: {
        theme: 'system',
        notifications: true,
        language: 'en',
      },

      calendar: {
        selectedDate: null,
        events: [],
      },

      loading: {
        user: false,
        calendar: false,
        api: false,
      },

      // Actions
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      setSelectedDate: (date) =>
        set((state) => ({
          calendar: { ...state.calendar, selectedDate: date },
        })),

      addEvent: (event) =>
        set((state) => ({
          calendar: {
            ...state.calendar,
            events: [
              ...state.calendar.events,
              { ...event, id: Date.now().toString() },
            ],
          },
        })),

      removeEvent: (eventId) =>
        set((state) => ({
          calendar: {
            ...state.calendar,
            events: state.calendar.events.filter((event) => event.id !== eventId),
          },
        })),

      setLoading: (key, loading) =>
        set((state) => ({
          loading: { ...state.loading, [key]: loading },
        })),

      logout: () =>
        set(() => ({
          user: {
            id: null,
            name: null,
            email: null,
            isAuthenticated: false,
          },
          calendar: {
            selectedDate: null,
            events: [],
          },
        })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain parts of the state
      partialize: (state) => ({
        user: state.user,
        settings: state.settings,
        calendar: state.calendar,
      }),
    }
  )
)

// Selector hooks for better performance
export const useUser = () => useAppStore((state) => state.user)
export const useSettings = () => useAppStore((state) => state.settings)
export const useCalendar = () => useAppStore((state) => state.calendar)
export const useLoading = () => useAppStore((state) => state.loading)
