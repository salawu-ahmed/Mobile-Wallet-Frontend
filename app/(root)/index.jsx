import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SignOutButton } from '../../components/SignOutButton'
import { Link } from 'expo-router'

const index = () => {
    const { user } = useUser()

    return (
        <View>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                <SignOutButton />
            </SignedIn>
            <SignedOut>
                <Link href='/(auth)/sign-in'>
                    <Text>Sign in</Text>
                </Link>
                <Link href='/(auth)/sign-up'>
                    <Text>Sign up</Text>
                </Link>
            </SignedOut>
        </View>
    )
}

export default index