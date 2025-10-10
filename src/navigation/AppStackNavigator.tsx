// src/navigation/AppStackNavigator.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '@/views/home'
import CollectionsScreen from '@/views/collections'
import CollectionDetailScreen from '@/views/collections/CollectionDetailScreen'
import PersonalNotesScreen from '@/views/notes'
import NoteEditorScreen from '@/views/notes/NoteEditorScreen'
import UserWordsScreen from '@/views/userWords'
import SettingsScreen from '@/views/settings/SettingsScreen'
import UserWordsSettingsScreen from '@/views/settings/UserWordsSettingsScreen'
import CategoriesSettingsScreen from '@/views/settings/CategoriesSettingsScreen'
import QuizScreen from '@/features/games/flashQuiz/QuizScreen'
import HangmanScreen from '@/features/games/hangman/HangmanScreen'
import MemoScreen from '@/features/games/memorandum/components/MemoScreen'
import FocusScreen from '@/features/focus/components/FocusScreen'
import FocusSetupScreen from '@/features/focus/components/FocusSetupScreen'
import FocusSelectionScreen from '@/features/focus/components/FocusSelectionScreen'
import FocusConfigScreen from '@/features/focus/components/FocusConfigScreen'
import type { PersonalNote } from '@/features/notes/models/types'

export type AppStackParamList = {
    Home: undefined
    Collections: undefined
    CollectionDetail: {
        collectionId: string
        collectionName: string
    }
    PersonalNotes: undefined
    NoteEditor: {
        note: PersonalNote
    }
    UserWords: undefined
    Settings: undefined
    UserWordsSettings: undefined
    CategoriesSettings: undefined
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
            screenOptions={{
                headerShown: true,
                headerTintColor: '#333',
                headerStyle: {
                    backgroundColor: '#F5F5DC',
                },
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                },
                statusBarBackgroundColor: '#F5F5DC',
                statusBarStyle: 'dark',
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Collections"
                component={CollectionsScreen}
                options={{
                   
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="CollectionDetail"
                component={CollectionDetailScreen}
                options={{ title: 'Detalle de Colección' }}
            />
            <Stack.Screen
                name="PersonalNotes"
                component={PersonalNotesScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="NoteEditor"
                component={NoteEditorScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UserWords"
                component={UserWordsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UserWordsSettings"
                component={UserWordsSettingsScreen}
               options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CategoriesSettings"
                component={CategoriesSettingsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="QuizScreen"
                component={QuizScreen}
                options={{

                    headerShown: false
                }}
            />
            <Stack.Screen
                name="HangmanScreen"
                component={HangmanScreen}
                options={{
                   
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="MemoScreen"
                component={MemoScreen}
                options={{
                   
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="FocusScreen"
                component={FocusScreen}
                options={{
                   
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="FocusSetupScreen"
                component={FocusSetupScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FocusSelectionScreen"
                component={FocusSelectionScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="FocusConfigScreen"
                component={FocusConfigScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}
