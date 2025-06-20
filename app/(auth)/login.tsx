import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { PageContainer } from "@/components/PageContainer";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ui/ThemedButton";
import { AuthContext } from "@/contexts/AuthContext";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("LoginScreen must be used within an AuthProvider");
  }
  const { login } = authContext;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error
          ? error.message
          : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset functionality will be implemented here"
    );
  };

  return (
    <PageContainer
      style={[styles.container, { backgroundColor }]}
      scrollable={false}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Welcome!
            </ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Log in to your account
            </ThemedText>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Email
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: useThemeColor({}, "cardBackground"),
                  color: textColor,
                  borderColor: useThemeColor({}, "icon"),
                },
              ]}
              placeholder="Enter your email"
              placeholderTextColor={useThemeColor({}, "icon")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Password
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: useThemeColor({}, "cardBackground"),
                  color: textColor,
                },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={useThemeColor({}, "icon")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <ThemedButton
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
            size="large"
          />

          <View style={styles.footer}>
            <ThemedText type="default" style={styles.footerText}>
              Don't have an account?{" "}
            </ThemedText>
            <ThemedText
              type="link"
              style={styles.signUpLink}
              onPress={() => router.push("/(auth)/signup")}
            >
              Sign Up
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 50,

    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
  },
  signUpLink: {
    textDecorationLine: "underline",
  },
});
