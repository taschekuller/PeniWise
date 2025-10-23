import { TamaguiProvider, YStack } from 'tamagui'
import config from '../tamagui.config'
import { Stack } from 'expo-router'

export default function Layout() {
  return (
    <TamaguiProvider config={config}>
      <YStack f={1} bg="$background">
        <Stack />
      </YStack>
    </TamaguiProvider>
  )
}