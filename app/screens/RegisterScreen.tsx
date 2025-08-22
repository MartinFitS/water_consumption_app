import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { registerUserService } from "../../services/registerUserService";

const RegisterScreen = () => {
  const navigation = useNavigation() as any;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const base64Img = result.assets[0].base64;
      setImageBase64(`data:image/jpeg;base64,${base64Img}` as any);
    }
  };

  const handleRegister = async () => {
    const emailRegex = /^[\w\.-]+@ucol\.mx$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, usa un correo institucional @ucol.mx.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true); // activar loader
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("correo_institucional", email);
      formData.append("password", password);

      if (imageBase64) {
        formData.append("img", {
          uri: imageBase64,
          name: "profile.jpg",
          type: "image/jpeg",
        } as any);
      }

      await registerUserService(formData);

      alert("Registro exitoso. Revisa tu correo para activar tu cuenta.");
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Error en el registro:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
        "Ocurrió un error al registrarte. Intenta nuevamente."
      );
    } finally {
      setLoading(false); // desactivar loader
    }
  };


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Crear cuenta</Text>

          <TouchableOpacity onPress={handlePickImage} style={styles.avatarWrapper}>
            {imageBase64 ? (
              <Image source={{ uri: imageBase64 }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>+</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.changePhoto}>Subir Foto</Text>

          <TextInput
            label="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            mode="outlined"
            textColor="#000"
          />

          <TextInput
            label="Correo institucional"
            value={email}
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
              mode="outlined"
              textColor="#000"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setSecureText(!secureText)}
            >
              <Ionicons
                name={secureText ? "eye-off" : "eye"}
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirm}
              style={[styles.input, { flex: 1 }]}
              mode="outlined"
              textColor="#000"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setSecureConfirm(!secureConfirm)}
            >
              <Ionicons
                name={secureConfirm ? "eye-off" : "eye"}
                size={24}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            style={styles.button}
            textColor="white"
            onPress={handleRegister}
          >
            Registrarse
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>
              ¿Ya tienes cuenta?{" "}
              <Text style={styles.loginBold}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <Modal transparent animationType="fade" visible={loading}>
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#1D61E7" />
            </View>
          </Modal>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  container: { width: "100%", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#333" },
  avatarWrapper: { marginBottom: 10 },
  avatar: { width: 100, height: 100, borderRadius: 60, borderWidth: 2, borderColor: "#ccc" },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 60, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" },
  avatarText: { fontSize: 32, color: "#555" },
  changePhoto: { color: "#555", fontSize: 14, marginBottom: 20 },
  input: { width: "100%", marginBottom: 16, backgroundColor: "white" },
  passwordContainer: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 5 },
  eyeIcon: { position: "absolute", right: 15 },
  button: { width: "100%", marginTop: 10, backgroundColor: "#1D61E7", paddingVertical: 10, borderRadius: 30 },
  loginLink: { marginTop: 20, fontSize: 14, color: "#333" },
  loginBold: { color: "#1D61E7", fontWeight: "bold" },
  loaderContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // que quede sobre todo
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});


export default RegisterScreen;
