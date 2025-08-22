import React, { useContext, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Modal,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { login } from "../../services/authService";
import { AuthContext } from "@/contexts/AuthContext";

const LoginScreen = () => {
  const navigation = useNavigation() as any;
  const [correo_institucional, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const { login: loginToContext } = useContext(AuthContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login(correo_institucional, password);
      setErrorMessage("");

      await loginToContext(response.user, response.access_token);

      navigation.navigate("Main");
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      const msg = error.response?.data?.message || "Error al iniciar sesión.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../../assets/img/logo_udc.png")}
            style={styles.logo}
          />

          <TextInput
            label="Correo Institucional"
            value={correo_institucional}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
            textColor="#000"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureText}
              style={[styles.input, { flex: 1 }]}
              theme={{ colors: { primary: "#1D61E7", outline: "#adaba3" } }}
              mode="outlined"
              textColor="#000"
            />
            <TouchableOpacity
              onPress={() => setSecureText(!secureText)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={secureText ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#1D61E7"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.infoText}>
                Usa tus credenciales institucionales del sistema SICEUC para registrarte.
              </Text>
            </View>
          </View>

          {errorMessage !== "" && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error al iniciar sesión porfavor revisa tus credenciales.</Text>
            </View>
          )}

          <Button
            mode="contained"
            style={styles.button}
            textColor="white"
            onPress={handleLogin}
            disabled={loading} 
          >
            Iniciar Sesión
          </Button>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{" "}
              <Text
                style={styles.registerLink}
                onPress={() => navigation.navigate("Register")}
              >
                Regístrate aquí
              </Text>
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Developed by</Text>
            <Text style={styles.footerText}>@MartinFits & @arielrosasc</Text>
          </View>

          {/* Loader modal */}
          {loading && (
            <Modal
              transparent
              animationType="fade"
              visible={loading}
            >
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#1D61E7" />
              </View>
            </Modal>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 30,
    backgroundColor: "white",
    justifyContent: "center",
  },
  logo: { width: 120, height: 120, marginBottom: 50 },
  input: { width: "100%", marginBottom: 15, backgroundColor: "white", borderRadius: 10 },
  passwordContainer: { flexDirection: "row", alignItems: "center", width: "100%" },
  eyeIcon: { position: "absolute", right: 15 },
  infoBox: { width: "100%", marginBottom: 12, backgroundColor: "#E8F0FE", padding: 10, borderRadius: 8 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoText: { color: "#1D61E7", fontSize: 15, fontWeight: "600", flex: 1 },
  errorContainer: { flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", marginTop: 5 },
  errorText: { color: "red", fontSize: 14, marginBottom: 10, alignSelf: "flex-start" },
  button: { width: "100%", paddingVertical: 8, backgroundColor: "#1D61E7", borderRadius: 10, marginTop: 5 },
  footer: { marginTop: 40, alignItems: "center" },
  footerText: { color: "#999", fontSize: 13 },
  registerContainer: { marginTop: 15, alignItems: "center" },
  registerText: { color: "#555", fontSize: 14 },
  registerLink: { color: "#1D61E7", fontWeight: "bold" },
  loaderContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", 
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoginScreen;
