// src/navigation/AppStackNavigator.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '@/views/home'
import CollectionsScreen from '@/views/collections'
import CollectionDetailScreen from '@/views/collections/CollectionDetailScreen'
import PersonalNotesScreen from '@/views/notes'
import UserWordsScreen from '@/views/userWords'
import SettingsScreen from '@/views/settings/SettingsScreen'
import QuizScreen from '@/features/games/flashQuiz/QuizScreen'
import HangmanScreen from '@/features/games/hangman/HangmanScreen'
import MemoScreen from '@/features/games/memorandum/components/MemoScreen'
import FocusScreen from '@/features/focus/components/FocusScreen'
import FocusSetupScreen from '@/features/focus/components/FocusSetupScreen'
import FocusSelectionScreen from '@/features/focus/components/FocusSelectionScreen'
import FocusConfigScreen from '@/features/focus/components/FocusConfigScreen'

export type AppStackParamList = {
    Home: undefined
    Collections: undefined
    CollectionDetail: {
        collectionId: string
        collectionName: string
    }
    PersonalNotes: undefined
    UserWords: undefined
    Settings: undefined
    QuizScreen: undefined
    HangmanScreen: undefined
    MemoScreen: undefined
    FocusScreen: undefined
    FocusSetupScreen: undefined
    FocusSelectionScreen: undefined
    FocusConfigScreen: {
        selection: {
            mode: 'category' | 'manual';
            categories: string[];
            wordIds: string[];
        }
    }
}

const Stack = createNativeStackNavigator<AppStackParamList>()

export default function AppStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Collections" component={CollectionsScreen} />
            <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
            <Stack.Screen name="PersonalNotes" component={PersonalNotesScreen} />
            <Stack.Screen name="UserWords" component={UserWordsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="QuizScreen" component={QuizScreen} />
            <Stack.Screen name="HangmanScreen" component={HangmanScreen} />
            <Stack.Screen name="MemoScreen" component={MemoScreen} />
            <Stack.Screen name="FocusScreen" component={FocusScreen} />
            <Stack.Screen name="FocusSetupScreen" component={FocusSetupScreen} />
            <Stack.Screen name="FocusSelectionScreen" component={FocusSelectionScreen} />
            <Stack.Screen name="FocusConfigScreen" component={FocusConfigScreen} />
        </Stack.Navigator>
    )
}
