"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Picker } from "@react-native-picker/picker"

export default function ProfileScreen({ formData, onFormChange }) {
    const [atividade, setAtividade] = useState(formData.atividade || "")

    const handleSave = () => {
        onFormChange({ ...formData, atividade })
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seu Perfil</Text>
            <Text style={styles.subtitle}>Ajuste suas preferências abaixo:</Text>

            <Text style={styles.label}>Nível de Atividade Física</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={atividade}
                    onValueChange={(value) => setAtividade(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecione..." value="" />
                    <Picker.Item label="Sedentário" value="sedentario" />
                    <Picker.Item label="Leve (1-2x/semana)" value="leve" />
                    <Picker.Item label="Moderado (3-4x/semana)" value="moderado" />
                    <Picker.Item label="Intenso (5-6x/semana)" value="intenso" />
                    <Picker.Item label="Atleta (2x por dia)" value="atleta" />
                </Picker>
            </View>

            <TouchableOpacity style={styles.btn} onPress={handleSave} activeOpacity={0.8}>
                <Text style={styles.btnText}>Salvar Alterações</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#E0640B",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 10,
    },
    pickerContainer: {
        backgroundColor: "#f5f5f5",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        marginBottom: 30,
        overflow: "hidden",
    },
    picker: {
        height: 50,
    },
    btn: {
        backgroundColor: "#E0640B",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    btnText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
})
