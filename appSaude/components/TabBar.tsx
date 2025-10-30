"use client"

import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { User, UtensilsCrossed, Settings } from "lucide-react-native"

interface TabBarProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
    const { colors } = useTheme()

    const tabs = [
        { id: "profile", label: "Perfil", Icon: User },
        { id: "meals", label: "Refeições", Icon: UtensilsCrossed },
        { id: "settings", label: "Config", Icon: Settings },
    ]

    return (
        <View style={[styles.container, { backgroundColor: colors.tabBar, borderTopColor: colors.border }]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                    <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => onTabChange(tab.id)} activeOpacity={0.7}>
                        <tab.Icon size={24} color={isActive ? colors.tabBarActive : colors.textSecondary} strokeWidth={2} />
                        <Text style={[styles.label, { color: isActive ? colors.tabBarActive : colors.textSecondary }]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        borderTopWidth: 1,
        paddingBottom: 20,
        paddingTop: 8,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 4,
    },
})
