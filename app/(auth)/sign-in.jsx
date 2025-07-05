import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'


export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    // handle submission of the sign-in form 
    const onSignInPress = async () => {
        if (!isLoaded) return

        // start the sign-in process using the email and password provided 
        try {
            const signInAttempt = await signIn.create({
                emailAddress,
                password
            })

            // If sign-in process is complete, set the created session as active 
            // and redirect the user 
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. user might need to
                // complete further steps
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
    }


    return (
        <View>
            <Text>Sign in</Text>
            <TextInput
                autoCapitalize='none'
                value={emailAddress}
                placeholder='Enter email'
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <TextInput
                value={password}
                placeholder='Enter password'
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />
            <TouchableOpacity onPress={onSignUpPress}>
                <Text>Continue</Text>
            </TouchableOpacity>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                <Text>Already have an account?</Text>
                <Link href='/sign-in'>
                    <Text>Sign in</Text>
                </Link>
            </View>
        </View>
    )
}