import { useClerk } from "@clerk/clerk-expo"
import * as Linking from 'expo-linking'
import { Text, TouchableOpacity } from "react-native"

export const SignOutButton = () => {
    //  use useClerk() to access the signOut() function 
    const {signOut} = useClerk()
    const handleSignOut = async () => {
        try {
            await signOut()
            // redirect user to your desired page after sign-out
            Linking.openURL(Linking.createURL('/'))
        } catch (error) {
            
        }
    }

    return (
        <TouchableOpacity onPress={handleSignOut}>
            <Text>Sign out</Text>
        </TouchableOpacity>
    )
}