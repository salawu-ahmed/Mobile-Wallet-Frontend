import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../../styles/auth.styles.js'
import { COLORS } from './../../constants/colors.js'
import { Ionicons } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [error, setError] = React.useState('')

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
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If status is not complete, check why. user may need to
                // complete further steps
                console.error(JSON.stringify(error, signUpAttempt, null, 2))
            }
        } catch (error) {      
            console.error(JSON.stringify(signUpAttempt, null, 2))
            if (error.errors?.[0]?.code === 'form_identifier_exists') {
                setError('This email address is already in use.')
            } else {
                setError('An error has occured, please try again.')
            }
        }        
    }

    if (pendingVerification) {
        return (
            <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>Verify your email</Text>

                {
                    error ? (
                        <View style={styles.errorBox}>
                            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity onPress={() => setError('')}>
                                <Ionicons name='close' />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        null
                    )
                }

                <TextInput
                    style={[styles.verificationInput, error && styles.errorInput]}
                    value={code}
                    placeholder='Enter your verification code'
                    placeholderTextColor='#9A8478'
                    onChangeText={(code) => setCode(code)}
                />
                <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            showsVerticalScrollIndicator={false}
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                <Image source={require('../../assets/images/revenue-i2.png')} style={styles.illustration} />
                <Text style={styles.title}>Create Account</Text>

                {
                    error ? (
                        <View style={styles.errorBox}>
                            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
                            <Text style={styles.errorText}>{error}</Text>
                            <TouchableOpacity onPress={() => setError('')}>
                                <Ionicons name='close' />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        null
                    )
                }

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    autoCapitalize='none'
                    value={emailAddress}
                    placeholder='Enter email'
                    placeholderTextColor='#9A8478'
                    onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                />

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    value={password}
                    placeholder='Enter password'
                    placeholderTextColor='#9A8478'
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />

                <TouchableOpacity onPress={onSignUpPress} style={styles.button}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.back()} href='/sign-in'>
                        <Text style={styles.linkText}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}