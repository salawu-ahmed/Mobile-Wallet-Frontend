import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from '../../styles/auth.styles.js'
import { COLORS } from './../../constants/colors.js'
import { Ionicons } from '@expo/vector-icons'


export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')

    // handle submission of the sign-in form 
    const onSignInPress = async () => {
        // a boolean value that checks whether the signIn object is loaded.
        if (!isLoaded) return

        // start the sign-in process using the email and password provided 
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
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
            if(error.errors?.[0]?.code === 'form_password_incorrect') {
                setError('Password is incorrect, please try again.')
            } else {
                setError('An error has occured, please try again.')
            }
        }
    }


    return (
        <KeyboardAwareScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={100}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <Image source={require('../../assets/images/revenue-i4.png')} style={styles.illustration} />
                <Text style={styles.title}>Welcome Back!</Text>

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

                <TouchableOpacity onPress={onSignInPress} style={styles.button} >
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don&apos;t have an account?</Text>
                    <Link href='/sign-up' asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}