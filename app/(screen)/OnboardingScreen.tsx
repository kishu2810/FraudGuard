import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { Shield, Eye, Zap, ArrowRight, EyeOff } from 'lucide-react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const OnboardingScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.')
      return
    }

    try {
      const userData = await AsyncStorage.getItem('userData')
      const storedUser = userData ? JSON.parse(userData) : null

      if (isLogin) {
        const isValidStoredUser =
          storedUser?.email === email && storedUser?.password === password

        const isDefaultUser =
          email === 'fraudguard@gmail.com' && password === '12345678'

        if (isValidStoredUser || isDefaultUser) {
          Alert.alert('Success', 'Login successful!')
          onLogin()
        } else {
          Alert.alert('Login Failed', 'Email or password is incorrect or not registered. Please sign up first.')
        }
      } else {
        const newUser = { email, password }
        await AsyncStorage.setItem('userData', JSON.stringify(newUser))
        Alert.alert('Account Created', 'You can now log in.')
        setIsLogin(true)
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.')
    }
  }

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >

      <KeyboardAwareScrollView
        contentContainerStyle={styles.inner}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={0}
        overScrollMode="never"
        bounces={false}

      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Shield color="white" size={40} />
          </View>
          <Text style={styles.title}>FraudGuard</Text>
          <Text style={styles.subtitle}>Advanced fraud detection and response platform</Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Eye color="white" size={20} />
            </View>
            <View>
              <Text style={styles.featureTitle}>Real-time Monitoring</Text>
              <Text style={styles.featureDesc}>24/7 fraud detection across all channels</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Zap color="white" size={20} />
            </View>
            <View>
              <Text style={styles.featureTitle}>Instant Response</Text>
              <Text style={styles.featureDesc}>Automated actions and manual controls</Text>
            </View>
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Login/Signup Toggle */}
          <View style={styles.toggleWrapper}>
            <TouchableOpacity
              style={[styles.toggleBtn, isLogin && styles.toggleActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, !isLogin && styles.toggleActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              ref={emailRef}
              style={[
                styles.input,
                emailFocused && { borderColor: '#667eea' },
              ]}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Enter your email"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={{ position: 'relative' }}>
              <TextInput
                ref={passwordRef}
                style={[
                  styles.input,
                  passwordFocused && { borderColor: '#667eea' },
                  { paddingRight: 44 },
                ]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordIcon}
              >
                {!showPassword ? (
                  <EyeOff color="#6b7280" size={20} />
                ) : (
                  <Eye color="#6b7280" size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.buttonWrapper}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
              <ArrowRight color="white" size={20} />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Demo credentials: fraudguard@gmail.com & 12345678
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  iconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  features: { marginBottom: 40 },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTitle: { fontSize: 16, fontWeight: '600', color: 'white' },
  featureDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  toggleWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleActive: { backgroundColor: 'white' },
  toggleText: { fontWeight: '600', color: '#64748b' },
  toggleTextActive: { color: '#1e293b' },
  formGroup: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  buttonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  hint: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
    color: '#6b7280',
  },
  passwordIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 0,
  }
})

export default OnboardingScreen
