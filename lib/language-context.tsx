"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type AppLanguage = "en" | "hi" | "ta" | "te" | "ml" | "kn" | "mr" | "gu" | "pa" | "bn" | "or" | "sa" | "as"

interface LanguageContextType {
    language: AppLanguage
    setLanguage: (lang: AppLanguage) => void
    t: (key: string) => string
}

const defaultContext: LanguageContextType = {
    language: "en",
    setLanguage: () => { },
    t: (key: string) => key,
}

const LanguageContext = createContext<LanguageContextType>(defaultContext)

import { translations } from "./translations"

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<AppLanguage>("en")

    useEffect(() => {
        // Try to load from local storage
        const saved = localStorage.getItem("agribot_lang") as AppLanguage
        if (saved && translations[saved]) {
            setLanguageState(saved)
        }
    }, [])

    const setLanguage = (lang: AppLanguage) => {
        setLanguageState(lang)
        localStorage.setItem("agribot_lang", lang)
    }

    const t = (key: string): string => {
        const langDict = translations[language] || translations["en"]
        const fallbackDict = translations["en"]

        // Support nested keys like "sidebar.teleop"
        const keys = key.split(".")
        let current: any = langDict
        for (const k of keys) {
            if (current[k] === undefined) {
                // Fallback to English
                let fallback: any = fallbackDict
                for (const fk of keys) {
                    if (fallback[fk] === undefined) return key;
                    fallback = fallback[fk]
                }
                return fallback as string;
            }
            current = current[k]
        }
        return current as string
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)
