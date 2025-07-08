import { Stack } from "expo-router";
import SafeScreen from '../components/SafeScreen'
import { Slot } from "expo-router";
import {ClerkProvider} from '@clerk/clerk-expo'
import {tokenCache} from '@clerk/clerk-expo/token-cache'
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return <ClerkProvider tokenCache={tokenCache}>
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }}/>
    </SafeScreen>
    <StatusBar style='dark'/>
  </ClerkProvider>
}
