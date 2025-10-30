// "use client"

import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native"
import { useTheme } from "../context/ThemeContext"

export default function Settings() {
    const { theme, setTheme, colors } = useTheme()

    const themes = [
        { id: "light", name: "Claro", color: "#BB4D00" },
        { id: "dark", name: "Escuro", color: "#FF6B35" },
        { id: "blue", name: "Azul", color: "#1976d2" },
        { id: "green", name: "Verde", color: "#388e3c" },
        { id: "pink", name: "Rosa", color: "#c2185b" },
        { id: "purple", name: "Roxo", color: "#7b1fa2" },

    ]

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Tema do Aplicativo</Text>
                <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                    Escolha o tema que mais combina com você
                </Text>

                <View style={styles.themesContainer}>
                    {themes.map((t) => (
                        <TouchableOpacity
                            key={t.id}
                            style={[
                                styles.themeOption,
                                { borderColor: theme === t.id ? colors.primary : colors.border },
                                theme === t.id && styles.themeOptionActive,
                            ]}
                            onPress={() => setTheme(t.id as any)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.themeColor, { backgroundColor: t.color }]} />
                            <Text style={[styles.themeName, { color: colors.text }]}>{t.name}</Text>
                            {theme === t.id && (
                                <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.checkmarkText}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
                <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
                    Macros App v1.0{"\n"}
                    Aplicativo para acompanhamento de macronutrientes
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
    },
    section: {
        margin: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 20,
    },
    themesContainer: {
        gap: 12,
    },
    themeOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
    },
    themeOptionActive: {
        borderWidth: 2,
    },
    themeColor: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
    },
    themeName: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    checkmarkText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    aboutText: {
        fontSize: 14,
        lineHeight: 20,
    },
})
