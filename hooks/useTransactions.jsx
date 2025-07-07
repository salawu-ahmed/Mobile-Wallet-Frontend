import { useCallback, useState } from 'react'
import {Alert} from 'react-native'

const API_URL = 'https://mobile-wallet-backend.onrender.com/api'

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([])
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0
    })

    const [isLoading, setIsLoading] = useState(false)

    // useCallback is used for performance optimization
    // useCallback will cache the result of the function and only recreate or 
    // call it when the dependencies change.
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json()
            setTransactions(() => data)
        } catch (error) {
            console.error('Error fetching transactions', error);
        }
    }, [userId])

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json()
            setSummary(() => data)
        } catch (error) {
            console.error('Error fetching the transaction summary', error);
        }
    }, [userId])

    const loadData = useCallback(async () => {
        if (!userId) return

        setIsLoading(true)

        try {
            // Promise.all allows our functions to be called simultaenously
            await Promise.all([fetchTransactions(), fetchSummary()])
        } catch (error) {
            console.error('Error loading data', error);
        } finally {
            setIsLoading(false)
        }
    }, [fetchSummary, fetchTransactions, userId])

    const deleteTransaction = useCallback(async (transactionId) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete transaction')

            //refresh data after deletion 
            loadData()
            Alert.alert('Success, transaction deleted successfully')
        } catch (error) {
            console.error('Failed to delete transaction', error);
            Alert.alert('Error, failed to delete transaction', error.message)
            
        }
    })

    return { transactions, summary, isLoading, loadData, deleteTransaction}
}