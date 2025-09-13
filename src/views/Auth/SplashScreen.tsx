// src/views/SplashScreen.tsx
import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native'
import { useNavigation, StackActions } from '@react-navigation/native'
import { useAppSelector } from '@/store/hooks'
import { RootState } from '@/store/store'

export default function SplashScreen() {
    const navigation = useNavigation()
    const { initialized } = useAppSelector((s: RootState) => s.auth)

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>

        if (initialized) {
            // Espera 3 segundos antes de reemplazar la pantalla
            timer = setTimeout(() => {
                navigation.dispatch(
                    StackActions.replace('Main' as never)
                )
            }, 3000)
        }

        return () => {
            // Limpia el timeout si el componente se desmonta o `initialized` cambia
            if (timer) clearTimeout(timer)
        }
    }, [initialized, navigation])

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/logob.png')}
                resizeMode="contain"
                style={{ width: 450, height: 450 }}
            />
            <ActivityIndicator size="large" color="#fff" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
})
