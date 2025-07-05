import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SignOutButton } from '../../components/SignOutButton'
import { Link } from 'expo-router'
import { useTransactions } from '../../hooks/useTransactions'

const index = () => {
    const { user } = useUser()
    const {transactions, summary, isLoading, loadData, deleteTransactions} = useTransactions(user.id)

    React.useEffect(() => {
        loadData
    }, [loadData])

    console.log('transactions',transactions);
    console.log('summary',summary);
    console.log('UserId', user.id);
    
    
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