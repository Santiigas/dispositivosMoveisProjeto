import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image } from "react-native"
import { StatusBar } from "expo-status-bar"

function FeatureItem({ icon, title, description }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  )
}

export default function Welcome({ onStart }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={require("../assets/salada.jpg")} style={styles.gradient} resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            {/* <Text style={styles.title}>Macros</Text> */}
            <Image source={require("../assets/logo-macros-cores.png")} style={styles.logo} />
            <Text style={styles.subtitle}>Controle suas macros diárias</Text>
          </View>

          <View style={styles.featuresContainer}>
            <FeatureItem icon="📊" title="Acompanhe" description="Monitore suas proteínas, carboidratos e gorduras" />
            <FeatureItem icon="🎯" title="Metas" description="Defina e alcance seus objetivos nutricionais" />
            <FeatureItem icon="📈" title="Progresso" description="Visualize sua evolução ao longo do tempo" />
          </View>

          <TouchableOpacity style={styles.button} onPress={onStart} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Começar</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(187, 77, 0, 0.4)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "space-between",
    position: "relative",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  // logoText: {
  //   fontSize: 48,
  //   fontWeight: "bold",
  //   color: "#fff",
  // },
  logo: {
    width: 140,
    height: 180,
    marginBottom: 20,
    
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
  },
  featuresContainer: {
    gap: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 19,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#FA9E2A",
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 15,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
})
