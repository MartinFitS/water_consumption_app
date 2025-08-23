import React, { useContext, useState } from "react";
import { StyleSheet, ScrollView, Image, ActivityIndicator, Modal } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@/contexts/AuthContext";

const PerfilScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // <- loader

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setLoading(true); // activar loader
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" as never }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false); // desactivar loader
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Image
            source={{
              uri:
                user.imageUrl ||
                "https://i.pinimg.com/736x/d6/cd/f2/d6cdf2a5daaf96462127cc31fb621851.jpg",
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.email}>{user.correo_institucional}</Text>

          <View style={styles.buttonContainer}>
            <Button
              textColor="red"
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </View>
        </View>
      </ScrollView>

      {/* Loader modal */}
      {loading && (
        <Modal transparent animationType="fade" visible={loading}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1D61E7" />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 16, paddingTop: 40 },
  card: {
    marginTop: 40,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    width: "90%",
    minHeight: "85%",
  },
  profileImage: { width: 150, height: 150, borderRadius: 90, marginTop: 40, marginBottom: 25 },
  name: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 12 },
  email: { fontSize: 16, color: "#555", marginBottom: 15 },
  buttonContainer: { width: "100%", padding: 16, marginTop: 190, marginBottom: 30, alignItems: "center" },
  logoutButton: {
    backgroundColor: "white",
    borderColor: "red",
    width: "60%",
    borderWidth: 2,
    borderRadius: 40,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default PerfilScreen;