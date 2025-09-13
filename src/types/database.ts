// src/types/database.ts
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

export interface Database {
    public: {
        Tables: {
            user_settings: {
                Row: {
                    user_id: string
                    background: string
                    nickname: string
                    motivational: string
                    categories: string[]
                    timezone: string
                    weekly_words_target: 10 | 30 | 40 | 50
                    bursts_per_day: 1 | 2 | 3
                    active_windows: ('morning' | 'afternoon' | 'evening')[]
                    window_times: {
                        morning?: string
                        afternoon?: string
                        evening?: string
                    }
                    streak_goal_days: number
                    daily_words: number
                    words_per_burst: number
                    wizard_completed: boolean
                }
                Insert: {
                    user_id: string
                    background: string
                    nickname: string
                    motivational: string
                    categories: string[]
                    timezone: string
                    weekly_words_target: 10 | 30 | 40 | 50
                    bursts_per_day: 1 | 2 | 3
                    active_windows: ('morning' | 'afternoon' | 'evening')[]
                    window_times: {
                        morning?: string
                        afternoon?: string
                        evening?: string
                    }
                    streak_goal_days: number
                    daily_words: number
                    words_per_burst: number
                    wizard_completed: boolean
                }
                Update: Partial<{
                    background: string
                    nickname: string
                    motivational: string
                    categories: string[]
                    timezone: string
                    weekly_words_target: 10 | 30 | 40 | 50
                    bursts_per_day: 1 | 2 | 3
                    active_windows: ('morning' | 'afternoon' | 'evening')[]
                    window_times: {
                        morning?: string
                        afternoon?: string
                        evening?: string
                    }
                    streak_goal_days: number
                    daily_words: number
                    words_per_burst: number
                    wizard_completed: boolean
                }>
            }
        }
        Views: {}
        Functions: {}
        Enums: {}
        CompositeTypes: {}
    }
}
