"use client"

import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { PieChart } from "react-native-chart-kit"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Profile() {
  const { colors } = useTheme()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const saved = await AsyncStorage.getItem("@user_data")
    if (saved) setData(JSON.parse(saved))
  }

  if (!data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Carregando...</Text>
      </View>
    )
  }

  const { nome, idade, peso, altura, genero, agua, macros } = data

  const alturaM = Number(altura) / 100
  const imc = peso / (alturaM * alturaM)

  let imcClass = ""
  if (imc < 18.5) imcClass = "Magreza"
  else if (imc < 25) imcClass = "Normal"
  else if (imc < 30) imcClass = "Sobrepeso"
  else imcClass = "Obesidade"

  const tmb =
    genero === "masculino"
      ? 10 * peso + 6.25 * Number(altura) - 5 * idade + 5
      : 10 * peso + 6.25 * Number(altura) - 5 * idade - 161

  const totalAgua = Number(agua) * 1000
  const ingerido = Number(agua) * 250
  const progresso = Math.min(ingerido / totalAgua, 1)

  const pieData = [
    {
      name: "Carb",
      population: macros?.carbo || 0,
      color: "#FFB703",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: "Prot",
      population: macros?.proteina || 0,
      color: "#219EBC",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: "Gord",
      population: macros?.gordura || 0,
      color: "#FB8500",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
  ]

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Olá, {nome} 👋</Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Seus Dados</Text>
        <Text style={{ color: colors.textSecondary }}>Idade: {idade}</Text>
        <Text style={{ color: colors.textSecondary }}>Peso: {peso}kg</Text>
        <Text style={{ color: colors.textSecondary }}>Altura: {altura}cm</Text>
        <Text style={{ color: colors.textSecondary }}>Gênero: {genero}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>IMC</Text>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold" }}>{imc.toFixed(1)}</Text>
        <Text style={{ color: colors.textSecondary }}>{imcClass}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>TMB</Text>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "bold" }}>{Math.round(tmb)} kcal/dia</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Consumo de Água</Text>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progresso * 100}%` }]} />
        </View>
        <Text style={{ color: colors.textSecondary }}>
          {ingerido}ml / {totalAgua}ml
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Macronutrientes</Text>
        <PieChart
          data={pieData}
          width={Dimensions.get("window").width - 40}
          height={200}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[0, 0]}
          absolute
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  progressBackground: {
    width: "100%",
    height: 12,
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginVertical: 6,
  },
  progressFill: {
    height: 12,
    backgroundColor: "#4CC9F0",
    borderRadius: 6,
  },
})
