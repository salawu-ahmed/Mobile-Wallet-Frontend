import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SignOutButton } from '../../components/SignOutButton'
import { Link, useRouter } from 'expo-router'
import { useTransactions } from '../../hooks/useTransactions'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../styles/home.styles'
import { Ionicons } from '@expo/vector-icons'

const index = () => {
    const { user } = useUser()
    const router = useRouter()
    const { transactions, summary, isLoading, loadData, deleteTransactions } = useTransactions(user.id)

    React.useEffect(() => {
        loadData
    }, [loadData])

    if (isLoading) {
        return <PageLoader />
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* HEADER */}
                <View style={styles.header}>
                    {/* LEFT */}
                    <View style={styles.headerLeft}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.headerLogo}
                            resizeMode='contain'
                        />
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.welcomeText}>Welcome, </Text>
                            <Text style={styles.usernameText}>
                                {user?.emailAddresses[0].emailAddress.split('@')[0]}
                            </Text>
                        </View>
                    </View>
                    {/* RIGHT */}
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
                            <Ionicons name='add' size={20} color='#fff'/>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <SignOutButton></SignOutButton>
                    </View>
                </View>

            </View>

        </View>
    )
}

export default index