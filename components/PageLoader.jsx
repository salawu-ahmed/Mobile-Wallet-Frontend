import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import {styles} from '../styles/home.styles'
import {COLORS}  from '../constants/colors.js'

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size='large' color={COLORS.primary} />
    </View>
  )
}

export default PageLoader