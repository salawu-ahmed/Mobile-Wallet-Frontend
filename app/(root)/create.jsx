import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useClerk } from '@clerk/clerk-expo'
import { styles } from '../../styles/create.styles'
import { COLORS } from '../../constants/colors'
import { API_URL } from '../../constants/api'
import { Ionicons } from '@expo/vector-icons'

const CATEGORIES = [
    { id: "food", name: "Food & Drinks", icon: "fast-food" },
    { id: "shopping", name: "Shopping", icon: "cart" },
    { id: "transaportation", name: "Transaportation", icon: "car" },
    { id: "Entertainment", name: "Entertainment", icon: "film" },
    { id: "bills", name: "Bills", icon: "receipt" },
    { id: "income", name: "income", icon: "cash" },
    { id: "other", name: "Other", icon: "ellipsis-horizontal" },
]

const CreateScreen = () => {
    const router = useRouter()
    const { user } = useClerk()
    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isExpense, setIsExpense] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    async function handleCreate() {
        //  validations
        if (!title.trim()) return Alert.alert('Error', 'Please enter a transaction title')
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid transaction amount')
            return
        }
        if (!selectedCategory) return Alert.alert('Error', 'Please select a category')

        try {
            // format the amount 
            const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount))
            const response = await fetch(`${API_URL}/api/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user.id,
                    title,
                    amount: formattedAmount,
                    category: selectedCategory
                })
            })
            if (!response) {
                const errorData = response.json()
                throw new Error(errorData || 'Error creating transaction')
            }
            Alert.alert('Success', 'Transaction created successfully')
            router.back()
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create transactions')
            console.error('Error creating the transactions', error);
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name='arrow-back' size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Transactions</Text>
                <TouchableOpacity
                    style={styles.saveButtonContainer}
                    onPress={() => handleCreate}
                    disabled={isLoading}
                >
                    <Text style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}>{isLoading ? 'Saving...' : 'Save'}</Text>
                    {isLoading && <Ionicons name='checkmark' size={18} color={COLORS.primary} />}
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <View style={styles.typeSelector}>
                    {/* EXPENSE */}
                    <TouchableOpacity
                        style={[styles.typeButton, isExpense && styles.typeButtonActive]}
                        onPress={() => setIsExpense(true)}
                    >
                        <Ionicons
                            name='arrow-down-circle'
                            size={22}
                            color={isExpense ? COLORS.white : COLORS.expense}
                            style={styles.typeIcon}
                        />
                        <Text
                            style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}

                        >Expense</Text>
                    </TouchableOpacity>

                    {/* INCOME */}
                    <TouchableOpacity
                        style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
                        onPress={() => setIsExpense(false)}
                    >
                        <Ionicons
                            name='arrow-down-circle'
                            size={22}
                            color={isExpense ? COLORS.white : COLORS.expense}
                            style={styles.typeIcon}
                        />
                        <Text
                            style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}

                        >Expense</Text>
                    </TouchableOpacity>
                </View>

                {/* AMOUNT CONTAINER */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder='0.00'
                        placeholderColor={COLORS.textLight}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType='numeric'
                    />
                </View>


                {/* INPUT CONTAINER */}
                <View>
                    <Ionicons
                        name='create-outline'
                        size={22}
                        color={COLORS.textLight}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder='Transaction Title'
                        placeholderColor={COLORS.textLight}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* TITLE */}
                <Text style={styles.sectionTitle}>
                    <Ionicons name='pricetag-outline' size={16} color={COLORS.text} />Category
                </Text>

                {/* CATEGORIES */}
                <View style={styles.categoryGrid}>
                    {CATEGORIES.map((category) => {
                        <TouchableOpacity
                            key={category.id}
                            style={[styles.categoryButton, selectedCategory === category.name && styles.categoryButtonActive]}
                            size={20}
                            onPress={() => setSelectedCategory(category.name)}
                        >
                            <Ionicons
                                name={category.icon}
                                size={20}
                                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                                style={styles.categoryIcon}
                            />
                            <Text
                                style={[
                                    styles.categoryButtonText,
                                    selectedCategory === category.name && styles.categoryButtonTextActive
                                ]}
                            >{category.name}</Text>

                        </TouchableOpacity>
                    })}
                </View>
            </View>

            {/* ACTIVITY INDICATOR */}
            {
                isLoading &&
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color={COLORS.primary} />
                </View>
            }
        </View>
    )
}

export default CreateScreen