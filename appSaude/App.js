"use client"

import { useState } from "react"
import { View } from "react-native"
import { ThemeProvider } from "./context/ThemeContext"
import Welcome from "./telas/Welcome"
import Form from "./telas/Form"
import Meals from "./telas/Meals"
import SettingsScreen from "./telas/Settings"
import TabBar from "./components/TabBar"
import Objectives from "./telas/Objectives"

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState("welcome")
  const [activeTab, setActiveTab] = useState("meals")
  const [formData, setFormData] = useState({
    nome: "",
    altura: "",
    peso: "",
    idade: "",
    genero: "masculino",
  })

  if (currentScreen === "welcome") {
    return (
      <Welcome
        onStart={() => {
          setCurrentScreen("form")
        }}
      />
    )
  }

  if (currentScreen === "form") {
    return (
      <Form
        formData={formData}
        onFormChange={setFormData}
        onSubmit={() => {
          setCurrentScreen("Objectives")
        }}
      />
    )
  }

  if (currentScreen === "Objectives") {
    return (
      <Objectives
        onFormChange={setFormData}
        onSubmit={() => {
          setCurrentScreen("meals")
        }}
      />
    )
  }

  if (currentScreen === "meals") {
    return (
      <View style={{ flex: 1 }}>
        {activeTab === "profile" && <ProfileScreen formData={formData} />}
        {activeTab === "meals" && <Meals userName={formData.nome} />}
        {activeTab === "settings" && <SettingsScreen />}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    )
  }

  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
