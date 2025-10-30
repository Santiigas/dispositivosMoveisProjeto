"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Theme = "light" | "dark" | "blue" | "green" | "pink" | "purple"

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    colors: {
        background: string
        card: string
        text: string
        textSecondary: string
        primary: string
        border: string
        tabBar: string
        tabBarActive: string
    }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const themes = {
    light: {
        background: "#f5f5f5",
        card: "#ffffff",
        text: "#333333",
        textSecondary: "#666666",
        primary: "#BB4D00",
        border: "#e0e0e0",
        tabBar: "#ffffff",
        tabBarActive: "#BB4D00",
    },
    dark: {
        background: "#1a1a1a",
        card: "#2a2a2a",
        text: "#ffffff",
        textSecondary: "#cccccc",
        primary: "#FF6B35",
        border: "#444444",
        tabBar: "#2a2a2a",
        tabBarActive: "#FF6B35",
    },
    blue: {
        background: "#e3f2fd",
        card: "#ffffff",
        text: "#1565c0",
        textSecondary: "#42a5f5",
        primary: "#1976d2",
        border: "#90caf9",
        tabBar: "#ffffff",
        tabBarActive: "#1976d2",
    },
    green: {
        background: "#e8f5e9",
        card: "#ffffff",
        text: "#2e7d32",
        textSecondary: "#66bb6a",
        primary: "#388e3c",
        border: "#a5d6a7",
        tabBar: "#ffffff",
        tabBarActive: "#388e3c",
    },
    pink: {
        background: "#fce4ec",
        card: "#ffffff",
        text: "#880e4f",
        textSecondary: "#ad1457",
        primary: "#c2185b",
        border: "#f48fb1",
        tabBar: "#ffffff",
        tabBarActive: "#c2185b",
    },
    purple: {
        background: "#f3e5f5",
        card: "#ffffff",
        text: "#4a148c",
        textSecondary: "#7b1fa2",
        primary: "#7b1fa2",
        border: "#ce93d8",
        tabBar: "#ffffff",
        tabBarActive: "#7b1fa2",
    },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light")

    useEffect(() => {
        loadTheme()
    }, [])

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem("@app_theme")
            if (savedTheme) {
                setThemeState(savedTheme as Theme)
            }
        } catch (error) {
        }
    }

    const setTheme = async (newTheme: Theme) => {
        try {
            await AsyncStorage.setItem("@app_theme", newTheme)
            setThemeState(newTheme)
        } catch (error) {
        }
    }

    return <ThemeContext.Provider value={{ theme, setTheme, colors: themes[theme] }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    return context
}
