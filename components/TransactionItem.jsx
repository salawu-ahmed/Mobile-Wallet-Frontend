import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '../styles/home.styles'
import { COLORS } from '../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { formatDate } from '../lib/utils'

//  Map categories to their respective icons 
const CATEGORY_ICONS = {
    "food & drinks": "fast-food",
    Shoppiing: "cart",
    Transportation: "car",
    Entertainment: "film",
    Bills: "receipt",
    Income: "cash",
    Other: "ellipsis-horizontal"
}

const TransactionItem = ({item, onDelete}) => {
    const isIncome = parseFloat(item.amount) > 0
    const iconName = CATEGORY_ICONS[item.category] || 'pricetag-outline'

  return (
    <View style={styles.transactionCard}>
        <TouchableOpacity style={styles.transactionContent}>
            <View style={styles.categoryIconContainer}>
                <Ionicon name={iconName} size={22} color={isIncome? COLORS.income: COLORS.expense}/>
            </View>
            <View style={styles.transactionLeft}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
            </View>
            <View style={styles.transactionRight}>
                <Text style={[styles.transactionAmount, {color: isIncome? COLORS.income : COLORS.expense}]}>
                    {isIncome ? "+" : "-"}$Math.abs(parseFloat(item.amount)).toFixed(2)
                </Text>
                <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
            </View>
        </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        <Ionicons name='trash-oultine' size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  )
}

export default TransactionItem