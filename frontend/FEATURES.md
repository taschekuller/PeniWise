# PeniWise Frontend Features

This document explains how to use the implemented features in your Expo app.

## 🗂️ Global State Management (Zustand)

### Setup
The global state is managed using Zustand with persistence via AsyncStorage.

### Usage

```typescript
import { useAppStore, useUser, useSettings, useCalendar } from '../store/useAppStore'

// In your component
const user = useUser()
const settings = useSettings()
const calendar = useCalendar()
const { setUser, updateSettings, addEvent } = useAppStore()

// Update user data
setUser({ name: 'John Doe', email: 'john@example.com', isAuthenticated: true })

// Update settings
updateSettings({ theme: 'dark', notifications: false })

// Add calendar event
addEvent({
  title: 'Meeting',
  date: '2024-01-15',
  time: '10:00 AM',
  description: 'Team meeting'
})
```

### Available State
- **User**: Authentication state, profile data
- **Settings**: Theme, notifications, language preferences
- **Calendar**: Selected date, events list
- **Loading**: Loading states for different operations

## 📅 Calendar View

### Components Available
- `CalendarView`: Full-featured calendar with events
- `CompactCalendarView`: Minimal calendar for smaller spaces

### Usage

```typescript
import { CalendarView } from '../components/CalendarView'

<CalendarView
  onDateSelect={(date) => console.log('Selected:', date)}
  showEvents={true}
  height={400}
/>
```

### Features
- Date selection with visual feedback
- Event markers on dates
- Event management (add/remove)
- Integration with global state
- Customizable styling

## 🌐 HTTP Client (Axios)

### Setup
Axios is configured with interceptors for authentication and error handling.

### Usage

```typescript
import { ApiService, useApiCall, handleApiError } from '../services/api'

// Using the service class
const result = await ApiService.login(email, password)
const events = await ApiService.getEvents()

// Using the hook for loading states
const { callApi } = useApiCall()
const result = await callApi(() => ApiService.getUserProfile(), 'user')

// Error handling
try {
  await ApiService.createEvent(eventData)
} catch (error) {
  const message = handleApiError(error)
  Alert.alert('Error', message)
}
```

### Available API Methods
- **Authentication**: `login()`, `register()`, `getUserProfile()`
- **Events**: `getEvents()`, `createEvent()`, `updateEvent()`, `deleteEvent()`
- **Files**: `uploadFile()` with progress tracking
- **Generic**: `get()`, `post()`, `put()`, `patch()`, `delete()`

### Features
- Automatic token handling
- Request/response interceptors
- Loading state management
- Error handling with user-friendly messages
- File upload with progress tracking

## 🚀 Getting Started

1. **Run the app**: `pnpm start`
2. **Navigate to Example**: Tap "Step 3: Try the Features" on the home screen
3. **Test Features**:
   - Try authentication (login/register)
   - Select dates on the calendar
   - Add events
   - Toggle settings

## 📁 File Structure

```
frontend/
├── store/
│   └── useAppStore.ts          # Global state management
├── components/
│   └── CalendarView.tsx        # Calendar components
├── services/
│   └── api.ts                  # HTTP client setup
└── app/
    ├── example.tsx             # Example usage screen
    └── (tabs)/
        └── index.tsx           # Updated home screen
```

## 🔧 Configuration

### Environment Variables
Set `EXPO_PUBLIC_API_URL` in your `.env` file:
```
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Dependencies Added
- `zustand`: State management
- `@react-native-async-storage/async-storage`: Persistence
- `react-native-calendars`: Calendar components
- `date-fns`: Date utilities
- `axios`: HTTP client

## 🎨 Customization

### Calendar Styling
Modify the `theme` prop in `CalendarView.tsx` to customize colors and fonts.

### API Configuration
Update `API_BASE_URL` in `services/api.ts` to point to your backend.

### State Structure
Extend the `AppState` interface in `store/useAppStore.ts` to add more global state.

## 🐛 Troubleshooting

### Common Issues
1. **Calendar not showing**: Ensure `react-native-calendars` is properly installed
2. **API errors**: Check your backend is running and `EXPO_PUBLIC_API_URL` is set
3. **State not persisting**: Verify AsyncStorage is working on your platform

### Debug Mode
Enable console logs by checking the browser/device console for API request/response logs.
