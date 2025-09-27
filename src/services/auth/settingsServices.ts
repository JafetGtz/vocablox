// src/services/settingsService.ts
import { supabase } from "../supebase"

export type TimeWindowId = 'morning' | 'afternoon' | 'evening'

export interface UserSettings {
    user_id: string
    background: string
    nickname: string
    motivational: string
    categories: string[]
    timezone: string
    weekly_words_target: 10 | 30 | 40 | 50
    bursts_per_day: 1 | 2 | 3
    active_windows: TimeWindowId[]
    window_times: {
        morning?: string
        afternoon?: string
        evening?: string
    }
    streak_goal_days: number
    daily_words: number
    words_per_burst: number
    wizard_completed: boolean
    // Text customization settings (stored locally)
    text_colors?: {
        word: string
        meaning: string
        example: string
    }
    text_sizes?: {
        word: 'small' | 'medium' | 'large'
        meaning: 'small' | 'medium' | 'large'
        example: 'small' | 'medium' | 'large'
    }
    text_visibility?: {
        word: boolean
        meaning: boolean
        example: boolean
    }
}

export async function fetchSettings(user_id: string): Promise<UserSettings> {
    const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user_id)
        .single()
    if (error) throw error
    return data!
}

function calculateDerivedValues(
    weekly_words_target: number,
    bursts_per_day: number,
    active_windows: TimeWindowId[]
): { daily_words: number; words_per_burst: number } {
    // Validate that active_windows.length === bursts_per_day
    if (active_windows.length !== bursts_per_day) {
        throw new Error(`Active windows (${active_windows.length}) must match bursts per day (${bursts_per_day})`)
    }
    
    // daily_words = ceil(weekly_words_target / 7)
    const daily_words = Math.ceil(weekly_words_target / 7)
    
    // words_per_burst = ceil(daily_words / bursts_per_day)
    const words_per_burst = Math.ceil(daily_words / bursts_per_day)
    
    return { daily_words, words_per_burst }
}

export async function upsertSettings(
    settings: UserSettings
): Promise<UserSettings> {
    try {
        console.log('upsertSettings called with:', JSON.stringify(settings, null, 2))
        
        // Validate required fields
        if (!settings.user_id) {
            throw new Error('user_id is required')
        }
        
        // Calculate derived values
        const derived = calculateDerivedValues(
            settings.weekly_words_target || 10,
            settings.bursts_per_day || 1,
            settings.active_windows || ['morning']
        )
        
        // Ensure all required fields have default values
        const settingsToSave = {
            user_id: settings.user_id,
            background: settings.background || '',
            nickname: settings.nickname || '',
            motivational: settings.motivational || '',
            categories: settings.categories || [],
            timezone: settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            weekly_words_target: settings.weekly_words_target || 10,
            bursts_per_day: settings.bursts_per_day || 1,
            active_windows: settings.active_windows || ['morning'],
            window_times: settings.window_times || { morning: '08:00' },
            streak_goal_days: settings.streak_goal_days || 7,
            daily_words: derived.daily_words,
            words_per_burst: derived.words_per_burst,
            wizard_completed: settings.wizard_completed || false,
        }
        
        console.log('Saving to Supabase:', JSON.stringify(settingsToSave, null, 2))
        
        const { data, error } = await supabase
            .from('user_settings')
            .upsert(settingsToSave, { onConflict: 'user_id' })
            .select()
            .single()
            
        if (error) {
            console.error('Supabase error:', error)
            throw new Error(`Database error: ${error.message}`)
        }
        
        if (!data) {
            throw new Error('No data returned from upsert operation')
        }
        
        console.log('Successfully saved settings:', data)
        return data
    } catch (error) {
        console.error('Error in upsertSettings:', error)
        throw error
    }
}
