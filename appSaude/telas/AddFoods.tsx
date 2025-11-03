"use client"

import { useEffect, useState } from "react"
import { Modal, View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from "react-native"
import { loadAlimentos, addAlimento } from "../utils/storage"

export default function AddFoods({ visible, onClose, onAdd }) {
    const [busca, setBusca] = useState("")
    const [alimentos, setAlimentos] = useState([])
    const [novoAlimento, setNovoAlimento] = useState({
        nome: "",
        calorias: "",
        carboidratos: "",
        proteinas: "",
        gorduras: "",
    })
    const [modoAdicionar, setModoAdicionar] = useState(false)

    useEffect(() => {
        if (visible) carregarAlimentos()
    }, [visible])

    const carregarAlimentos = async () => {
        const data = await loadAlimentos()
        setAlimentos(data)
    }

    const handleSalvarAlimento = async () => {
        if (!novoAlimento.nome || !novoAlimento.calorias) return
        const alimento = {
            nome: novoAlimento.nome,
            calorias: Number.parseFloat(novoAlimento.calorias),
            carboidratos: Number.parseFloat(novoAlimento.carboidratos) || 0,
            proteinas: Number.parseFloat(novoAlimento.proteinas) || 0,
            gorduras: Number.parseFloat(novoAlimento.gorduras) || 0,
        }
        const atualizados = await addAlimento(alimento)
        setAlimentos(atualizados)
        setModoAdicionar(false)
        setNovoAlimento({ nome: "", calorias: "", carboidratos: "", proteinas: "", gorduras: "" })
    }

    const alimentosFiltrados = alimentos.filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()))

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{modoAdicionar ? "Novo Alimento" : "Procurar"}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {!modoAdicionar ? (
                        <>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar alimento"
                                placeholderTextColor="#aaa"
                                value={busca}
                                onChangeText={setBusca}
                            />

                            <FlatList
                                data={alimentosFiltrados}
                                keyExtractor={(item) => item.nome}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.foodItem}
                                        onPress={() => {
                                            onAdd(item)
                                            onClose()
                                        }}
                                    >
                                        <View style={styles.foodItemRow}>
                                            <Text style={styles.foodName}>{item.nome}</Text>
                                            <Text style={styles.foodCalories}>{item.calorias} kcal</Text>
                                        </View>
                                        <Text style={styles.foodMacros}>
                                            C: {item.carboidratos} • P: {item.proteinas} • G: {item.gorduras}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />

                            <TouchableOpacity onPress={() => setModoAdicionar(true)} style={styles.addManualButton}>
                                <Text style={styles.addManualText}>+ Cadastrar novo alimento</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome do alimento"
                                placeholderTextColor="#aaa"
                                value={novoAlimento.nome}
                                onChangeText={(t) => setNovoAlimento({ ...novoAlimento, nome: t })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Calorias"
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                                value={novoAlimento.calorias}
                                onChangeText={(t) => setNovoAlimento({ ...novoAlimento, calorias: t })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Carboidratos"
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                                value={novoAlimento.carboidratos}
                                onChangeText={(t) => setNovoAlimento({ ...novoAlimento, carboidratos: t })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Proteínas"
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                                value={novoAlimento.proteinas}
                                onChangeText={(t) => setNovoAlimento({ ...novoAlimento, proteinas: t })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Gorduras"
                                keyboardType="numeric"
                                placeholderTextColor="#aaa"
                                value={novoAlimento.gorduras}
                                onChangeText={(t) => setNovoAlimento({ ...novoAlimento, gorduras: t })}
                            />

                            <TouchableOpacity onPress={handleSalvarAlimento} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Salvar alimento</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setModoAdicionar(false)}>
                                <Text style={styles.cancelText}>Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "flex-end",
    },
    container: {
        backgroundColor: "#222",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
        height: "85%",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    closeText: {
        color: "#fff",
        fontSize: 22,
    },
    searchInput: {
        backgroundColor: "#333",
        color: "#fff",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
    },
    foodItem: {
        backgroundColor: "#111",
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    foodItemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    foodName: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    foodCalories: {
        color: "#4fc3f7",
        fontWeight: "600",
    },
    foodMacros: {
        color: "#aaa",
        fontSize: 14,
    },
    addManualButton: {
        borderColor: "#BB4D00",
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        marginTop: 10,
    },
    addManualText: {
        color: "#BB4D00",
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#333",
        color: "#fff",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: "#BB4D00",
        borderRadius: 10,
        padding: 14,
        alignItems: "center",
        marginTop: 8,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    cancelText: {
        color: "#ccc",
        textAlign: "center",
        marginTop: 12,
        fontSize: 15,
    },
})
