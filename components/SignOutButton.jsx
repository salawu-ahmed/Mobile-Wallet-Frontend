import { useClerk } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import * as Linking from 'expo-linking'
import { Alert, Text, TouchableOpacity } from "react-native"
import { styles } from "../styles/home.styles"
import { COLORS } from "../constants/colors"
import { useState } from "react"

export const SignOutButton = () => {
    //  use useClerk() to access the signOut() function 
    const {signOut} = useClerk()
    // const [loggingOut, setIsLoggingOut] = useState(false)
    const handleSignOut = async () => {
        Alert.alert(
            'Confirm Logout Action',
            'Are you sure you want to log out?',
            [
                {
                    text: 'Sign out',
                    style: 'destructive',
                    onPress: signOut
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        )
    }


    return (
        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.text}/>
        </TouchableOpacity>
    )
}