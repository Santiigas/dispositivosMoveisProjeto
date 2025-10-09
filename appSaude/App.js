"use client"

import { useState } from "react"
import Welcome from "./telas/Welcome"
import Form from "./telas/Form"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome")
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
          setCurrentScreen("main")
        }}
      />
    )
  }
}
