import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native"
import { Picker } from "@react-native-picker/picker"
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Objectives({ onFormChange, onSubmit }) {
  const [atividadeFisica, setAtividadeFisica] = useState("");
  const [objetivoPrincipal, setObjetivoPrincipal] = useState("");
  const [urgencia, setUrgencia] = useState("");
  const [restricoesAlimentares, setRestricoesAlimentares] = useState("");
  const [alergias, setAlergias] = useState("");
  const [refeicoesPorDia, setRefeicoesPorDia] = useState("");
  const [condicoesSaude, setCondicoesSaude] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('ObjectivesData');
      if (savedData !== null) {
        const data = JSON.parse(savedData);
        setAtividadeFisica(data.atividadeFisica || "");
        setObjetivoPrincipal(data.objetivoPrincipal || "");
        setUrgencia(data.urgencia || "");
        setRestricoesAlimentares(data.restricoesAlimentares || "");
        setAlergias(data.alergias || "");
        setRefeicoesPorDia(data.refeicoesPorDia || "");
        setCondicoesSaude(data.condicoesSaude || "");
        setMedicamentos(data.medicamentos || "");
      }
    } catch (error) {
      // Tratar erro se necessário
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    const data = {
      atividadeFisica,
      objetivoPrincipal,
      urgencia,
      restricoesAlimentares,
      alergias,
      refeicoesPorDia,
      condicoesSaude,
      medicamentos,
    };

    const timeout = setTimeout(() => {
      AsyncStorage.setItem('ObjectivesData', JSON.stringify(data));
      if (onFormChange) onFormChange((prev) => ({ ...prev, ...data }));
    }, 600);

    return () => clearTimeout(timeout);
  }, [atividadeFisica, objetivoPrincipal, urgencia, restricoesAlimentares, alergias, refeicoesPorDia, condicoesSaude, medicamentos, isLoading]);

  const handleSubmit = async () => {
    if (!atividadeFisica || !objetivoPrincipal || !urgencia || !refeicoesPorDia) {
      Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha pelo menos os campos: Atividade Física, Objetivo Principal, Urgência e Refeições por Dia.',
        [{ text: 'OK' }]
      );
      return;
    }

    const data = {
      atividadeFisica,
      objetivoPrincipal,
      urgencia,
      restricoesAlimentares,
      alergias,
      refeicoesPorDia,
      condicoesSaude,
      medicamentos,
    };

    try {
      await AsyncStorage.setItem('ObjectivesData', JSON.stringify(data));
      if (onFormChange) onFormChange((prev) => ({ ...prev, ...data }));
      if (onSubmit) onSubmit();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar os dados.", [{ text: "OK" }]);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        <Text style={styles.formTitle}>Defina seu Objetivo</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Você pratica atividade física? *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={atividadeFisica}
              style={styles.picker}
              onValueChange={setAtividadeFisica}
              dropdownIconColor="#754f44"
            >
              <Picker.Item label="Selecione..." value="" />
              <Picker.Item label="Sedentário (pouco ou nenhum exercício)" value="sedentario" />
              <Picker.Item label="Levemente ativo (1–3x por semana)" value="levemente_ativo" />
              <Picker.Item label="Moderadamente ativo (3–5x por semana)" value="moderadamente_ativo" />
              <Picker.Item label="Muito ativo (6–7x por semana)" value="muito_ativo" />
              <Picker.Item label="Extremamente ativo (duas vezes por dia ou atleta)" value="extremamente_ativo" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Qual é seu principal objetivo? *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={objetivoPrincipal}
              style={styles.picker}
              onValueChange={setObjetivoPrincipal}
              dropdownIconColor="#754f44"
            >
              <Picker.Item label="Selecione..." value="" />
              <Picker.Item label="Perder peso / gordura" value="perder_peso" />
              <Picker.Item label="Manter peso" value="manter_peso" />
              <Picker.Item label="Ganhar massa muscular" value="ganhar_massa" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Com que urgência? *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={urgencia}
              style={styles.picker}
              onValueChange={setUrgencia}
              dropdownIconColor="#754f44"
            >
              <Picker.Item label="Selecione..." value="" />
              <Picker.Item label="Devagar (mais sustentável)" value="devagar" />
              <Picker.Item label="Moderado" value="moderado" />
              <Picker.Item label="Rápido (maior déficit/superávit)" value="rapido" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Alimentos que você não consome / tem restrição?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Descreva suas restrições alimentares"
            placeholderTextColor="#999"
            multiline={true}
            value={restricoesAlimentares}
            onChangeText={setRestricoesAlimentares}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tem alergias alimentares? Quais?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Descreva suas alergias"
            placeholderTextColor="#999"
            multiline={true}
            value={alergias}
            onChangeText={setAlergias}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantas refeições faz por dia? *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={refeicoesPorDia}
              style={styles.picker}
              onValueChange={setRefeicoesPorDia}
              dropdownIconColor="#754f44"
            >
              <Picker.Item label="Selecione..." value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Você tem alguma condição de saúde? (diabetes, hipertensão, etc.)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Descreva suas condições de saúde"
            placeholderTextColor="#999"
            multiline={true}
            value={condicoesSaude}
            onChangeText={setCondicoesSaude}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Faz uso frequente de medicamento?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Liste os medicamentos que utiliza frequentemente"
            placeholderTextColor="#999"
            multiline={true}
            value={medicamentos}
            onChangeText={setMedicamentos}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit} 
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Continuar</Text>
        </TouchableOpacity>

      </ScrollView>
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
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E0640B",
    marginBottom: 8,
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
  textInput: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 15,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#5e9c8a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})
