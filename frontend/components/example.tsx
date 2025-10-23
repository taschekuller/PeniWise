import React, { useState } from 'react'
import { ScrollView, Alert } from 'react-native'
import { YStack, XStack, Text, Button, Input, Card, Separator } from 'tamagui'
import { CalendarView } from './CalendarView'
import { useAppStore, useUser, useSettings, useCalendar, useLoading } from '../store/useAppStore'
import { ApiService, useApiCall, handleApiError } from '../services/api'

export default function ExampleScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')

  // Global state hooks
  const user = useUser()
  const settings = useSettings()
  const calendar = useCalendar()
  const loading = useLoading()
  const { setUser, updateSettings, addEvent, logout } = useAppStore()
  const { callApi } = useApiCall()

  // Example API calls
  const handleLogin = async () => {
    try {
      const result = await callApi(() =>
        ApiService.login(email, password)
      )

      setUser({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        isAuthenticated: true,
      })

      Alert.alert('Success', 'Logged in successfully!')
    } catch (error: any) {
      Alert.alert('Error', handleApiError(error))
    }
  }

  const handleRegister = async () => {
    try {
      const result = await callApi(() =>
        ApiService.register({
          name: 'Test User',
          email,
          password,
        })
      )

      setUser({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        isAuthenticated: true,
      })

      Alert.alert('Success', 'Registered successfully!')
    } catch (error: any) {
      Alert.alert('Error', handleApiError(error))
    }
  }

  const handleAddEvent = async () => {
    if (!calendar.selectedDate || !eventTitle) {
      Alert.alert('Error', 'Please select a date and enter event title')
      return
    }

    try {
      // Add to local state
      addEvent({
        title: eventTitle,
        date: calendar.selectedDate!,
        description: eventDescription,
      })

      // Also save to server (if API is available)
      await callApi(() =>
        ApiService.createEvent({
          title: eventTitle,
          date: calendar.selectedDate!,
          description: eventDescription,
        })
      )

      setEventTitle('')
      setEventDescription('')
      Alert.alert('Success', 'Event added successfully!')
    } catch (error: any) {
      Alert.alert('Error', handleApiError(error))
    }
  }

  const handleLogout = () => {
    logout()
    Alert.alert('Success', 'Logged out successfully!')
  }

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    updateSettings({ theme: newTheme })
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack padding="$4" space="$4">
        <Text fontSize="$8" fontWeight="bold" textAlign="center">
          PeniWise Example Screen
        </Text>

        {/* User Authentication Section */}
        <Card padding="$4" backgroundColor="$background">
          <YStack space="$3">
            <Text fontSize="$6" fontWeight="bold">
              Authentication Demo
            </Text>

            {user.isAuthenticated ? (
              <YStack space="$2">
                <Text>Welcome, {user.name}!</Text>
                <Text>Email: {user.email}</Text>
                <Button onPress={handleLogout}>
                  Logout
                </Button>
              </YStack>
            ) : (
              <YStack space="$3">
                <Input
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Input
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <XStack space="$2">
                  <Button flex={1} onPress={handleLogin} disabled={loading.api}>
                    Login
                  </Button>
                  <Button flex={1} onPress={handleRegister} disabled={loading.api}>
                    Register
                  </Button>
                </XStack>
              </YStack>
            )}
          </YStack>
        </Card>

        {/* Settings Section */}
        <Card padding="$4" backgroundColor="$background">
          <YStack space="$3">
            <Text fontSize="$6" fontWeight="bold">
              Settings Demo
            </Text>

            <YStack space="$2">
              <Text>Current Theme: {settings.theme}</Text>
              <Text>Notifications: {settings.notifications ? 'On' : 'Off'}</Text>
              <Text>Language: {settings.language}</Text>

              <XStack space="$2">
                <Button flex={1} onPress={toggleTheme}>
                  Toggle Theme
                </Button>
                <Button
                  flex={1}
                  onPress={() => updateSettings({ notifications: !settings.notifications })}
                >
                  Toggle Notifications
                </Button>
              </XStack>
            </YStack>
          </YStack>
        </Card>

        {/* Calendar Section */}
        <Card padding="$4" backgroundColor="$background">
          <YStack space="$3">
            <Text fontSize="$6" fontWeight="bold">
              Calendar Demo
            </Text>

            <CalendarView
              onDateSelect={(date) => console.log('Selected date:', date)}
              showEvents={true}
            />

            <Separator />

            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600">
                Add New Event
              </Text>
              <Input
                placeholder="Event Title"
                value={eventTitle}
                onChangeText={setEventTitle}
              />
              <Input
                placeholder="Event Description (optional)"
                value={eventDescription}
                onChangeText={setEventDescription}
                multiline
                numberOfLines={3}
              />
              <Button onPress={handleAddEvent} disabled={loading.api}>
                Add Event
              </Button>
            </YStack>
          </YStack>
        </Card>

        {/* Loading States */}
        <Card padding="$4" backgroundColor="$background">
          <YStack space="$3">
            <Text fontSize="$6" fontWeight="bold">
              Loading States
            </Text>

            <YStack space="$2">
              <Text>API Loading: {loading.api ? 'Yes' : 'No'}</Text>
              <Text>User Loading: {loading.user ? 'Yes' : 'No'}</Text>
              <Text>Calendar Loading: {loading.calendar ? 'Yes' : 'No'}</Text>
            </YStack>
          </YStack>
        </Card>

        {/* Global State Debug */}
        <Card padding="$4" backgroundColor="$background">
          <YStack space="$3">
            <Text fontSize="$6" fontWeight="bold">
              Global State Debug
            </Text>

            <YStack space="$2">
              <Text fontSize="$3" color="$gray10">
                Selected Date: {calendar.selectedDate || 'None'}
              </Text>
              <Text fontSize="$3" color="$gray10">
                Total Events: {calendar.events.length}
              </Text>
              <Text fontSize="$3" color="$gray10">
                User Authenticated: {user.isAuthenticated ? 'Yes' : 'No'}
              </Text>
            </YStack>
          </YStack>
        </Card>
      </YStack>
    </ScrollView>
  )
}
