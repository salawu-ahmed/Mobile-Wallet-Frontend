import * as React from 'react'
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { SignOutButton } from '../../components/SignOutButton'
import { Link, useRouter } from 'expo-router'
import { useTransactions } from '../../hooks/useTransactions'
import PageLoader from '../../components/PageLoader'
import { styles } from '../../styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import BalanceCard from '../../components/BalanceCard'
import TransactionItem from '../../components/TransactionItem'
import NoTransactionsFound from '../../components/NoTransactionsFound'

const index = () => {
    const { user } = useUser()
    const router = useRouter()
    const { transactions, summary, isLoading, loadData, deleteTransactions } = useTransactions(user.id)
    const [refreshing, setRefreshing] = React.useState(false)
    console.log(transactions);
    
    async function onRefresh(){
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    React.useEffect(() => {
        loadData()
    }, [loadData])

    if (isLoading && !refreshing) {
        return <PageLoader />
    }

    function handleDelete(id) {
        Alert.alert(
            'Confirm Delete Action',
            'Are you sure you want to delete this transaction?',
            [
                {
                    title: 'Cancel',
                    style:'cancel',
                },
                {
                    title: 'Delete',
                    style:'destructive',
                    onPress: () => deleteTransactions(id)
                }
            ]
        )
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
                            <Ionicons name='add' size={20} color='#fff' />
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <SignOutButton></SignOutButton>
                    </View>
                </View>

                {/* BALANCE CARD */}
                <BalanceCard summary={summary} />

                <View style={styles.transactionsHeaderContainer}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                </View>
            </View>


        {/* flatlist is a performant way to render long lists in react native */}
        {/* It renders lists lazily - only items on the screeen */}
            <FlatList
                style={styles.transactionsList}
                contentContainerStyle={styles.transactionsListContent}
                data={transactions}
                renderItem={(item) => {
                    <TransactionItem item={item} onDelete={handleDelete}/>
                }}
                ListEmptyComponent={<NoTransactionsFound />}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    )
}

export default index