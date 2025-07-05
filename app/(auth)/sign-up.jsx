import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as React from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    // handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // start sign-up process using email and password provided 
        try {
            await signUp.create({
                emailAddress,
                password
            })

            // send user an email verification code 
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // set 'pendingVerification' to true to display the second form 
            // and capture OTP code
            setPendingVerification(true)
        } catch (error) {
            console.error(JSON.stringify(error, null, 2));
        }
    }

    // handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt the verification 
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code
            })

            // if the verification was completed, set the session to active and
            // redirect the user 
            if (signUpAttempt.status === - 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If status is not complete, check why. user may need to
                // complete further steps
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (error) {
            console.error(JSON.stringify(signUpAttempt, null, 2))

        }
    }

    if (pendingVerification) {
        return (
            <>
                <Text>Verify your email</Text>
                <TextInput
                    value={code}
                    placeholder='Enter your verification code'
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity onPress={onVerifyPress}>
                    <Text>Verify</Text>
                </TouchableOpacity>
            </>
        )
    }

    return (
        <View>
            <>
                <Text>Sign Up</Text>
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
                <View style={{display: 'flex', flexDirection: 'row', gap: 3}}>
                    <Text>Already have an account?</Text>
                    <Link href='/sign-in'>
                        <Text>Sign in</Text>
                    </Link>
                </View>
            </>
        </View>
    )
}