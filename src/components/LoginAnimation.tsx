// src/components/LoginAnimation.tsx
import React from 'react'
import { View, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

const LoginAnimation = ({ mirrored = false }: { mirrored?: boolean }) => (
    <View style={styles.container}>
        <LottieView
            source={require('../assets/dog1.json')}
            autoPlay
            loop
            style={[
                styles.animation,
                mirrored && { transform: [{ scaleX: -1 }] },
            ]}
        />
    </View>
)

export default LoginAnimation

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 16,
    },
    animation: {
        width: 200,
        height: 200,
    },
})
