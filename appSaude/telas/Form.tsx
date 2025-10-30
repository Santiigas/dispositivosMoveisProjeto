"use client"

import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Picker } from "@react-native-picker/picker"

export default function Form({ formData, onFormChange, onSubmit }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        <Text style={styles.formTitle}>Conte-nos sobre você</Text>
        <Text style={styles.formSubtitle}>Precisamos de algumas informações para personalizar sua experiência</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
            value={formData.nome}
            onChangeText={(text) => onFormChange({ ...formData, nome: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Altura (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 170"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={formData.altura}
            onChangeText={(text) => onFormChange({ ...formData, altura: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Peso (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 70"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={formData.peso}
            onChangeText={(text) => onFormChange({ ...formData, peso: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Idade</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 25"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={formData.idade}
            onChangeText={(text) => onFormChange({ ...formData, idade: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gênero</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.genero}
              onValueChange={(value) => onFormChange({ ...formData, genero: value })}
              style={styles.picker}
            >
              <Picker.Item label="Masculino" value="masculino" />
              <Picker.Item label="Feminino" value="feminino" />
              <Picker.Item label="Outro" value="outro" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Qual a sua quantidade de água que você ingere por dia?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.agua}
                onValueChange={(value) => onFormChange({ ...formData, agua: value })}
                style={styles.picker}
              >
                <Picker.Item label="1 litro" value="1" />
                <Picker.Item label="2 litros" value="2" />
                <Picker.Item label="3 litros" value="3" />
                <Picker.Item label="4 litros" value="4" />
              </Picker>
            </View>

        </View>

        <TouchableOpacity style={styles.submitButton} onPress={onSubmit} activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContent: {
    padding: 24,
    paddingTop: 60,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E0640B",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: "#E0640B",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 40,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
})
