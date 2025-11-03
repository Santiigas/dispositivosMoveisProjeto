import AsyncStorage from "@react-native-async-storage/async-storage"

const USER_DATA_KEY = "@macros_user_data"
const MEALS_DATA_KEY = "@macros_meals_data"
const ALIMENTOS_KEY = "@macros_alimentos"

// Salvar dados do usuário
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
  } catch (error) {
  }
}

// Carregar dados do usuário
export const loadUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    return null
  }
}

// Salvar refeições
export const saveMeals = async (meals) => {
  try {
    await AsyncStorage.setItem(MEALS_DATA_KEY, JSON.stringify(meals))
  } catch (error) {
  }
}

// Carregar refeições
export const loadMeals = async () => {
  try {
    const data = await AsyncStorage.getItem(MEALS_DATA_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    return {}
  }
}

// Carregar lista de alimentos cadastrados
export const loadAlimentos = async () => {
  try {
    const data = await AsyncStorage.getItem(ALIMENTOS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    return []
  }
}

// Adicionar novo alimento à lista
export const addAlimento = async (alimento) => {
  try {
    const alimentos = await loadAlimentos()
    const novosAlimentos = [...alimentos, alimento]
    await AsyncStorage.setItem(ALIMENTOS_KEY, JSON.stringify(novosAlimentos))
    return novosAlimentos
  } catch (error) {
    return []
  }
}

// Limpar todos os dados
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([USER_DATA_KEY, MEALS_DATA_KEY, ALIMENTOS_KEY])
  } catch (error) {
  }
}
