"use client"

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    Pressable,
    Animated,
    PanResponder,
} from "react-native"
import { useState, useEffect, useRef } from "react"
import { StatusBar } from "expo-status-bar"
import DateTimePicker from "react-native-ui-datepicker"
import dayjs, { type Dayjs } from "dayjs"
import "dayjs/locale/pt-br"
import AddFoods from "./AddFoods"
import { useTheme } from "../context/ThemeContext"

dayjs.locale("pt-br")

type MealItem = {
    nome: string
    calorias: number
    proteinas: number
    carboidratos: number
    gorduras: number
}

type MealsData = {
    cafe: MealItem[]
    lancheManha: MealItem[]
    almoco: MealItem[]
    lancheTarde: MealItem[]
    jantar: MealItem[]
    ceia: MealItem[]
}

interface MealsProps {
    userName: string
    mealsData: Record<string, MealsData>
    onMealsUpdate: (meals: Record<string, MealsData>) => void
}

const SwipeableItem = ({ children, onDelete, colors }) => {
    const pan = useRef(new Animated.ValueXY()).current
    const [isDeleting, setIsDeleting] = useState(false)

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 5,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx < 0) {
                    pan.setValue({ x: gestureState.dx, y: 0 })
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -100) {
                    setIsDeleting(true)
                    Animated.timing(pan, {
                        toValue: { x: -500, y: 0 },
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => {
                        onDelete()
                    })
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start()
                }
            },
        }),
    ).current

    const opacity = pan.x.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
    })

    return (
        <View style={styles(colors).swipeableContainer}>
            <Animated.View style={[styles(colors).deleteBackground, { opacity }]}>
                <Text style={styles(colors).deleteIcon}>🗑️</Text>
            </Animated.View>
            <Animated.View
                style={[
                    styles(colors).swipeableContent,
                    { transform: [{ translateX: pan.x }] },
                ]}
                {...panResponder.panHandlers}
            >
                {children}
            </Animated.View>
        </View>
    )
}

export default function Meals({ userName, mealsData, onMealsUpdate }: MealsProps) {
    const { colors } = useTheme()

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs())
    const [showAddModal, setShowAddModal] = useState(false)
    const [selectedMealKey, setSelectedMealKey] = useState<keyof MealsData | null>(null)

    const [meals, setMeals] = useState<MealsData>({
        cafe: [],
        lancheManha: [],
        almoco: [],
        lancheTarde: [],
        jantar: [],
        ceia: [],
    })

    useEffect(() => {
        const dateKey = selectedDate.toDateString()
        const safeMealsData = mealsData || {}

        if (safeMealsData[dateKey]) {
            setMeals(safeMealsData[dateKey])
        } else {
            setMeals({
                cafe: [],
                lancheManha: [],
                almoco: [],
                lancheTarde: [],
                jantar: [],
                ceia: [],
            })
        }
    }, [selectedDate, mealsData])

    useEffect(() => {
        const dateKey = selectedDate.toDateString()
        const safeMealsData = mealsData || {}

        const currentData = JSON.stringify(safeMealsData[dateKey] || {})
        const newData = JSON.stringify(meals)

        if (currentData !== newData && typeof onMealsUpdate === "function") {
            const updatedMealsData = {
                ...safeMealsData,
                [dateKey]: meals,
            }
            onMealsUpdate(updatedMealsData)
        }
    }, [meals, selectedDate])

    const goToPreviousDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() - 1)
        setSelectedDate(newDate)
        setCalendarDate(dayjs(newDate))
    }

    const goToNextDay = () => {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() + 1)
        setSelectedDate(newDate)
        setCalendarDate(dayjs(newDate))
    }

    const goToToday = () => {
        const today = new Date()
        setSelectedDate(today)
        setCalendarDate(dayjs(today))
        setShowDatePicker(false)
    }

    const formatHeaderDate = (date) => {
        const today = new Date()
        if (date.toDateString() === today.toDateString()) return "Hoje"
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        if (date.toDateString() === yesterday.toDateString()) return "Ontem"
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        if (date.toDateString() === tomorrow.toDateString()) return "Amanhã"
        return dayjs(date).format("D [de] MMMM")
    }

    const calculateTotals = () => {
        const totals = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 }
        Object.values(meals).forEach((mealList: MealItem[]) => {
            mealList.forEach((meal) => {
                totals.calorias += meal.calorias
                totals.proteinas += meal.proteinas
                totals.carboidratos += meal.carboidratos
                totals.gorduras += meal.gorduras
            })
        })
        return totals
    }

    const totals = calculateTotals()

    const handleAddFood = (food: MealItem) => {
        if (!selectedMealKey) return
        const updated = {
            ...meals,
            [selectedMealKey]: [...meals[selectedMealKey], food],
        }
        setMeals(updated)
        setShowAddModal(false)
    }

    const handleDeleteFood = (mealKey: keyof MealsData, index: number) => {
        const updated = {
            ...meals,
            [mealKey]: meals[mealKey].filter((_, i) => i !== index),
        }
        setMeals(updated)
    }

    const renderMealSection = (title: string, mealKey: keyof MealsData) => {
        const mealList = meals[mealKey]
        return (
            <View style={styles(colors).mealSection}>
                <Text style={styles(colors).mealTitle}>{title}</Text>
                {mealList.length === 0 ? (
                    <Text style={styles(colors).emptyMealText}>Nenhum alimento adicionado</Text>
                ) : (
                    mealList.map((meal, index) => (
                        <SwipeableItem key={index} onDelete={() => handleDeleteFood(mealKey, index)} colors={colors}>
                            <View style={styles(colors).mealItem}>
                                <View style={styles(colors).mealInfo}>
                                    <Text style={styles(colors).mealName}>{meal.nome}</Text>
                                    <Text style={styles(colors).mealDetails}>
                                        {meal.calorias} kcal • P: {meal.proteinas}g • C: {meal.carboidratos}g • G: {meal.gorduras}g
                                    </Text>
                                </View>
                            </View>
                        </SwipeableItem>
                    ))
                )}
                <TouchableOpacity
                    style={styles(colors).addButton}
                    onPress={() => {
                        setSelectedMealKey(mealKey)
                        setShowAddModal(true)
                    }}
                >
                    <Text style={styles(colors).addButtonText}>+ Adicionar alimentos</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles(colors).container}>
            <StatusBar style="light" />

            <View style={styles(colors).header}>
                <Text style={styles(colors).headerTitle}>Minhas Refeições</Text>
                <View style={styles(colors).dateNavigation}>
                    <TouchableOpacity onPress={goToPreviousDay} style={styles(colors).arrowButton}>
                        <Text style={styles(colors).arrowText}>‹</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles(colors).dateButton}>
                        <Text style={styles(colors).headerDate}>{formatHeaderDate(selectedDate)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={goToNextDay} style={styles(colors).arrowButton}>
                        <Text style={styles(colors).arrowText}>›</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
                <Pressable style={styles(colors).modalOverlay} onPress={() => setShowDatePicker(false)}>
                    <View style={styles(colors).calendarContainer}>
                        <Text style={styles(colors).modalTitle}>Selecione uma data</Text>
                        <DateTimePicker
                            mode="single"
                            date={calendarDate}
                            onChange={(params) => {
                                const newDate = params.date as Dayjs
                                if (newDate) {
                                    setCalendarDate(newDate)
                                    setSelectedDate(newDate.toDate())
                                    setShowDatePicker(false)
                                }
                            }}
                        />
                        <TouchableOpacity style={styles(colors).todayButton} onPress={goToToday}>
                            <Text style={styles(colors).todayButtonText}>Hoje</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            <View style={styles(colors).summaryCard}>
                <Text style={styles(colors).summaryTitle}>Resumo do Dia</Text>
                <View style={styles(colors).summaryGrid}>
                    <View style={styles(colors).summaryItem}>
                        <Text style={styles(colors).summaryValue}>{totals.calorias}</Text>
                        <Text style={styles(colors).summaryLabel}>Calorias</Text>
                    </View>
                    <View style={styles(colors).summaryItem}>
                        <Text style={styles(colors).summaryValue}>{totals.proteinas}g</Text>
                        <Text style={styles(colors).summaryLabel}>Proteínas</Text>
                    </View>
                    <View style={styles(colors).summaryItem}>
                        <Text style={styles(colors).summaryValue}>{totals.carboidratos}g</Text>
                        <Text style={styles(colors).summaryLabel}>Carboidratos</Text>
                    </View>
                    <View style={styles(colors).summaryItem}>
                        <Text style={styles(colors).summaryValue}>{totals.gorduras}g</Text>
                        <Text style={styles(colors).summaryLabel}>Gorduras</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles(colors).mealsContainer} showsVerticalScrollIndicator={false}>
                {renderMealSection("Café da Manhã", "cafe")}
                {renderMealSection("Lanche da Manhã", "lancheManha")}
                {renderMealSection("Almoço", "almoco")}
                {renderMealSection("Lanche da Tarde", "lancheTarde")}
                {renderMealSection("Jantar", "jantar")}
                {renderMealSection("Ceia", "ceia")}
            </ScrollView>

            <AddFoods visible={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddFood} />
        </View>
    )
}

const styles = (colors) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            backgroundColor: colors.primary,
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: 24,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: "bold",
            color: "#fff",
            marginBottom: 12,
        },
        dateNavigation: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        arrowButton: {
            padding: 8,
            width: 40,
            alignItems: "center",
        },
        arrowText: {
            fontSize: 32,
            color: "#fff",
            fontWeight: "300",
        },
        dateButton: {
            flex: 1,
            alignItems: "center",
        },
        headerDate: {
            fontSize: 18,
            fontWeight: "600",
            color: "#fff",
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
        },
        calendarContainer: {
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 20,
            width: "90%",
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 16,
            textAlign: "center",
        },
        todayButton: {
            backgroundColor: colors.primary,
            paddingVertical: 14,
            borderRadius: 12,
            marginTop: 16,
            alignItems: "center",
        },
        todayButtonText: {
            color: "#fff",
            fontSize: 16,
            fontWeight: "600",
        },
        summaryCard: {
            backgroundColor: colors.card,
            margin: 16,
            padding: 20,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        summaryTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 16,
        },
        summaryGrid: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        summaryItem: {
            alignItems: "center",
        },
        summaryValue: {
            fontSize: 20,
            fontWeight: "bold",
            color: colors.text,
            marginBottom: 4,
        },
        summaryLabel: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        mealsContainer: {
            flex: 1,
            paddingHorizontal: 16,
        },
        mealSection: {
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        mealTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 12,
        },
        emptyMealText: {
            fontSize: 14,
            color: colors.textSecondary,
            fontStyle: "italic",
            marginBottom: 12,
        },
        mealItem: {
            paddingVertical: 12,
            backgroundColor: colors.card,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        mealInfo: {
            flex: 1,
        },
        mealName: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 4,
        },
        mealDetails: {
            fontSize: 12,
            color: colors.textSecondary,
        },
        addButton: {
            marginTop: 12,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 8,
            borderWidth: 2,
            borderColor: colors.primary,
            borderStyle: "dashed",
        },
        addButtonText: {
            fontSize: 14,
            fontWeight: "600",
            color: colors.primary,
        },
        deleteBackground: {
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "#ff3b30",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: 20,
            width: "100%",
        },
        deleteIcon: {
            fontSize: 28,
        },
        swipeableContainer: {
            position: "relative",
            marginBottom: 1,
        },
        swipeableContent: {
            backgroundColor: colors.card,
        },
    })
