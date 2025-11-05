"use client"


import React, { useMemo } from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from "react-native"
import { useTheme } from "../context/ThemeContext"

type FormData = {
    nome?: string
    idade?: string | number
    genero?: string
    altura?: string | number
    peso?: string | number
    agua?: string | number
    atividade?: string
}

type Props = {
    formData?: FormData
    onEdit?: () => void
}

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const activityFactor = (nivel?: string) => {
    switch ((nivel || "").toLowerCase()) {
        case "sedentario":
            return 1.2
        case "leve":
            return 1.375
        case "moderado":
            return 1.55
        case "intenso":
            return 1.725
        case "atleta":
            return 1.9
        default:
            return 1.375
    }
}

const parseNumber = (v?: string | number) => {
    if (v == null) return NaN
    if (typeof v === "number") return v
    // aceita vírgula ou ponto
    const normalized = String(v).replace(",", ".").replace(/[^\d.]/g, "")
    const n = Number(normalized)
    return isNaN(n) ? NaN : n
}

const calcIMC = (peso?: string | number, alturaCm?: string | number) => {
    const p = parseNumber(peso)
    const a = parseNumber(alturaCm)
    if (!p || !a) return null
    const m = a / 100
    const imc = p / (m * m)
    return Number(imc.toFixed(1))
}

const imcClassificacao = (imc?: number | null) => {
    if (imc == null) return ""
    if (imc < 18.5) return "Abaixo do peso"
    if (imc < 25) return "Normal"
    if (imc < 30) return "Sobrepeso"
    return "Obesidade"
}

const calcTMB = (peso?: string | number, alturaCm?: string | number, idade?: string | number, genero?: string) => {
    const p = parseNumber(peso)
    const a = parseNumber(alturaCm)
    const i = parseNumber(idade)
    if (!p || !a || !i) return null
    if ((genero || "masculino").toLowerCase() === "feminino") {
        return Math.round(10 * p + 6.25 * a - 5 * i - 161)
    } else {
        return Math.round(10 * p + 6.25 * a - 5 * i + 5)
    }
}

const calcTDEE = (tmb?: number | null, nivel?: string, objetivo: "manter" | "perder" | "ganhar" = "manter") => {
    if (!tmb) return null
    const factor = activityFactor(nivel)
    let tdee = tmb * factor
    if (objetivo === "perder") tdee = tdee - 500
    if (objetivo === "ganhar") tdee = tdee + 300
    return Math.round(tdee)
}

const calcMacrosFromCalories = (tdee?: number | null) => {
    if (!tdee) return null
    const carbsKcal = tdee * 0.4
    const proteinKcal = tdee * 0.3
    const fatKcal = tdee * 0.3
    return {
        carbs: { kcal: Math.round(carbsKcal), g: Math.round(carbsKcal / 4) },
        protein: { kcal: Math.round(proteinKcal), g: Math.round(proteinKcal / 4) },
        fat: { kcal: Math.round(fatKcal), g: Math.round(fatKcal / 9) },
    }
}

const imcColor = (imc?: number | null) => {
    if (imc == null) return "#999"
    if (imc < 18.5) return "#3b82f6"
    if (imc < 25) return "#10b981"
    if (imc < 30) return "#f59e0b"
    return "#ef4444"
}

export default function ProfileScreen({ formData = {}, onEdit }: Props) {
    const { colors } = useTheme ? useTheme() : { colors: { background: "#0b0b0b", text: "#fff", card: "#1e1e1e", border: "#2b2b2b", primary: "#ef4444" } }

    const parsed = useMemo(() => {
        const nome = formData.nome || ""
        const idade = formData.idade || ""
        const genero = formData.genero || ""
        const altura = formData.altura || ""
        const peso = formData.peso || ""
        const agua = formData.agua || ""
        const atividade = formData.atividade || ""

        const imc = calcIMC(peso, altura)
        const classificacao = imc != null ? imcClassificacao(imc) : ""
        const tmb = calcTMB(peso, altura, idade, genero)
        const tdee = calcTDEE(tmb, atividade, "manter")
        const macros = calcMacrosFromCalories(tdee)

        return { nome, idade, genero, altura, peso, agua, atividade, imc, classificacao, tmb, tdee, macros }
    }, [formData])

    // three scenarios
    const tdeeMaintain = parsed.tdee
    const tdeeCut = parsed.tdee ? parsed.tdee - 500 : null
    const tdeeBulk = parsed.tdee ? parsed.tdee + 300 : null

    const macrosMaintain = calcMacrosFromCalories(tdeeMaintain)
    const macrosCut = calcMacrosFromCalories(tdeeCut || undefined)
    const macrosBulk = calcMacrosFromCalories(tdeeBulk || undefined)

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background || "#0b0b0b" }]}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarIcon}>T</Text>
                </View>
                <Text style={[styles.name, { color: colors.text || "#fff" }]}>{parsed.nome || "Usuário"}</Text>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card || "#1e1e1e", borderColor: colors.border || "#2b2b2b" }]}>
                <Text style={[styles.sectionTitle, { color: "#ccc" }]}>Informações Pessoais</Text>

                <View style={styles.item}>
                    <Text style={styles.itemLeft}>🎂 Idade</Text>
                    <Text style={styles.itemRight}>{parsed.idade ? `${parsed.idade} anos` : "-"}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.item}>
                    <Text style={styles.itemLeft}>🚻 Gênero</Text>
                    <Text style={styles.itemRight}>{parsed.genero || "-"}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.item}>
                    <Text style={styles.itemLeft}>📏 Altura</Text>
                    <Text style={styles.itemRight}>{parsed.altura ? `${parsed.altura} cm` : "-"}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.item}>
                    <Text style={styles.itemLeft}>⚖️ Peso</Text>
                    <Text style={styles.itemRight}>{parsed.peso ? `${parsed.peso} kg` : "-"}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.item}>
                    <Text style={styles.itemLeft}>💧 Água</Text>
                    <Text style={styles.itemRight}>{parsed.agua ? `${parsed.agua} L` : "-"}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.item}>
                    <Text style={styles.itemLeft}>🏃 Atividade</Text>
                    <Text style={styles.itemRight}>{parsed.atividade || "-"}</Text>
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card || "#1e1e1e", borderColor: colors.border || "#2b2b2b" }]}>
                <Text style={[styles.sectionTitle, { color: "#ccc" }]}>Índice de Massa Corporal</Text>
                <View style={styles.imcRow}>
                    <Text style={[styles.imcValue, { color: imcColor(parsed.imc) }]}>
                        {parsed.imc != null ? parsed.imc : "-"}
                    </Text>
                    <Text style={styles.imcClass}>
                        {parsed.imc != null ? ` ${parsed.classificacao}` : ""}
                    </Text>
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card || "#1e1e1e", borderColor: colors.border || "#2b2b2b" }]}>
                <View style={styles.calCardRow}>
                    <View style={styles.calLeft}>
                        <Text style={styles.calTitle}>Requisitos Calóricos Diários</Text>
                        <Text style={styles.calValue}>{parsed.tdee ? `${parsed.tdee} kcal` : "-"}</Text>
                    </View>
                    <View style={styles.calArrow}>
                        <Text style={{ color: "#bbb", fontSize: 20 }}>›</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card || "#1e1e1e", borderColor: colors.border || "#2b2b2b" }]}>
                <Text style={[styles.sectionTitle, { color: "#ccc" }]}>Macronutrientes (40/30/30)</Text>

                <View style={styles.macroStack}>
                    <View style={[styles.macroCard, { borderLeftColor: "#ef4444" }]}>
                        <Text style={styles.macroLabel}>Carboidratos</Text>
                        <Text style={styles.macroGr}>{parsed.macros ? `${parsed.macros.carbs.g} g` : "-"}</Text>
                        <Text style={styles.macroKcal}>{parsed.macros ? `${parsed.macros.carbs.kcal} kcal` : "-"}</Text>
                    </View>

                    <View style={[styles.macroCard, { borderLeftColor: "#3b82f6" }]}>
                        <Text style={styles.macroLabel}>Proteína</Text>
                        <Text style={styles.macroGr}>{parsed.macros ? `${parsed.macros.protein.g} g` : "-"}</Text>
                        <Text style={styles.macroKcal}>{parsed.macros ? `${parsed.macros.protein.kcal} kcal` : "-"}</Text>
                    </View>

                    <View style={[styles.macroCard, { borderLeftColor: "#f59e0b" }]}>
                        <Text style={styles.macroLabel}>Gordura</Text>
                        <Text style={styles.macroGr}>{parsed.macros ? `${parsed.macros.fat.g} g` : "-"}</Text>
                        <Text style={styles.macroKcal}>{parsed.macros ? `${parsed.macros.fat.kcal} kcal` : "-"}</Text>
                    </View>
                </View>

                <View style={styles.pizzaRow}>
                    <View style={styles.pizza}>
                        <View style={[styles.pizzaSlice, { backgroundColor: "#ef4444", flex: 4 }]} />
                        <View style={[styles.pizzaSlice, { backgroundColor: "#3b82f6", flex: 3 }]} />
                        <View style={[styles.pizzaSlice, { backgroundColor: "#f59e0b", flex: 3 }]} />
                    </View>

                    <View style={styles.legend}>
                        <Text style={styles.legendText}>● Carboidratos</Text>
                        <Text style={styles.legendText}>● Proteína</Text>
                        <Text style={styles.legendText}>● Gordura</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.section, { backgroundColor: colors.card || "#1e1e1e", borderColor: colors.border || "#2b2b2b" }]}>
                <Text style={[styles.sectionTitle, { color: "#ccc" }]}>Recomendações por objetivo</Text>

                <View style={styles.goalsRow}>
                    <View style={[styles.goalCard, { backgroundColor: "#2b0b0b", borderColor: "#4b0b0b" }]}>
                        <Text style={[styles.goalTitle, { color: "#ff6b6b" }]}>Cutting</Text>
                        <Text style={styles.goalKcal}>{tdeeCut ? `${tdeeCut} kcal` : "-"}</Text>
                        <View style={styles.goalMiniPizza}>
                            <View style={[styles.miniSlice, { backgroundColor: "#ef4444", flex: 4 }]} />
                            <View style={[styles.miniSlice, { backgroundColor: "#3b82f6", flex: 3 }]} />
                            <View style={[styles.miniSlice, { backgroundColor: "#f59e0b", flex: 3 }]} />
                        </View>
                        <Text style={styles.goalMacrosText}>
                            {macrosCut ? `P ${macrosCut.protein.g}g • C ${macrosCut.carbs.g}g • G ${macrosCut.fat.g}g` : "-"}
                        </Text>
                    </View>

                    <View style={[styles.goalCard, { backgroundColor: "#0b172b", borderColor: "#12304b" }]}>
                        <Text style={[styles.goalTitle, { color: "#3b82f6" }]}>Manter</Text>
                        <Text style={styles.goalKcal}>{tdeeMaintain ? `${tdeeMaintain} kcal` : "-"}</Text>
                        <View style={styles.goalMiniPizza}>
                            <View style={[styles.miniSlice, { backgroundColor: "#ef4444", flex: 4 }]} />
                            <View style={[styles.miniSlice, { backgroundColor: "#3b82f6", flex: 3 }]} />
                            <View style={[styles.miniSlice, { backgroundColor: "#f59e0b", flex: 3 }]} />
                        </View>
                        <Text style={styles.goalMacrosText}>
                            {macrosMaintain ? `P ${macrosMaintain.protein.g}g • C ${macrosMaintain.carbs.g}g • G ${macrosMaintain.fat.g}g` : "-"}
                        </Text>
                    </View>

                    <View style={[styles.goalCard, { backgroundColor: "#0b2b0b", borderColor: "#0b4b12" }]}>
                        <Text style={[styles.goalTitle, { color: "#10b981" }]}>Bulking</Text>
                        <Text style={styles.goalKcal}>{tdeeBulk ? `${tdeeBulk} kcal` : "-"}</Text>
                        <View style={styles.goalMiniPizza}>
                            <View style={[styles.miniSlice, { backgroundColor: "#ef4444", flex: 4 }]} />
                            <View style={[styles.miniSlice, { backgroundColor: "#3b82f6", flex: 3 }]} />
                            <View style={[styles.miniSlice, { backgroundColor: "#f59e0b", flex: 3 }]} />
                        </View>
                        <Text style={styles.goalMacrosText}>
                            {macrosBulk ? `P ${macrosBulk.protein.g}g • C ${macrosBulk.carbs.g}g • G ${macrosBulk.fat.g}g` : "-"}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={{ padding: 18 }}>
                <TouchableOpacity
                    style={[styles.editBtn, { backgroundColor: colors.card || "#1e1e1e", borderColor: colors.border || "#2b2b2b" }]}
                    onPress={() => onEdit && onEdit()}
                >
                    <Text style={[styles.editText, { color: colors.text || "#fff" }]}>Editar Dados</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 60 }} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { padding: 18, paddingTop: 36, backgroundColor: "#0b0b0b" },
    header: { alignItems: "center", marginBottom: 12 },
    avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#FF6B35", alignItems: "center", justifyContent: "center" },
    avatarIcon: { fontSize: 32, color: "#fff", fontWeight: "700" },
    name: { color: "#fff", marginTop: 10, fontSize: 20, fontWeight: "800" },

    section: { backgroundColor: "#1e1e1e", borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#2b2b2b" },
    sectionTitle: { color: "#ccc", fontWeight: "700", marginBottom: 10 },

    item: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10 },
    itemLeft: { color: "#ddd" },
    itemRight: { color: "#fff", fontWeight: "700" },

    divider: { height: 1, backgroundColor: "#2b2b2b", marginVertical: 0 },

    imcRow: { alignItems: "center", justifyContent: "center", paddingVertical: 6 },
    imcValue: { fontSize: 52, fontWeight: "900" },
    imcClass: { color: "#ddd", marginTop: 6, fontSize: 16 },

    calCardRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    calLeft: {},
    calTitle: { color: "#bbb", fontWeight: "700", marginBottom: 6 },
    calValue: { color: "#fff", fontSize: 28, fontWeight: "900" },
    calArrow: { justifyContent: "center", alignItems: "center" },

    macroStack: { marginTop: 6 },
    macroCard: { backgroundColor: "#111", padding: 10, borderRadius: 8, borderLeftWidth: 6, marginBottom: 8 },
    macroLabel: { color: "#ddd", fontWeight: "700", marginBottom: 6 },
    macroGr: { color: "#fff", fontWeight: "900", fontSize: 18 },
    macroKcal: { color: "#aaa", marginTop: 4 },

    pizzaRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
    pizza: { width: 120, height: 120, borderRadius: 60, overflow: "hidden", flexDirection: "column" },
    pizzaSlice: { width: "100%" },
    legend: { marginLeft: 18 },
    legendText: { color: "#ddd", marginBottom: 6 },

    goalsRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
    goalCard: { flex: 1, padding: 12, borderRadius: 10, marginHorizontal: 6, borderWidth: 1, alignItems: "center" },
    goalTitle: { fontWeight: "800", fontSize: 16 },
    goalKcal: { fontSize: 18, fontWeight: "900", marginTop: 6, color: "#fff" },
    goalMiniPizza: { width: 60, height: 60, borderRadius: 30, overflow: "hidden", marginTop: 8, flexDirection: "column" },
    miniSlice: { width: "100%" },
    goalMacrosText: { color: "#ddd", marginTop: 8, fontWeight: "700", textAlign: "center" },

    editBtn: { paddingVertical: 14, borderRadius: 12, alignItems: "center", borderWidth: 1 },
    editText: { fontWeight: "800" },
})
