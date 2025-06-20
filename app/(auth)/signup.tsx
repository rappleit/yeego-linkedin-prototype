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

export default function SignupScreen() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("SignupScreen must be used within an AuthProvider");
  }
  const { register } = authContext;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const handleSignup = async () => {
    if (!displayName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, {
        username: username,
        display_name: displayName,
      });
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error instanceof Error
          ? error.message
          : "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
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
              Create Account
            </ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Join us today
            </ThemedText>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Display Name
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
              placeholder="Enter your display name"
              placeholderTextColor={useThemeColor({}, "icon")}
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Username
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
              placeholder="Choose a username"
              placeholderTextColor={useThemeColor({}, "icon")}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
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
                  borderColor: useThemeColor({}, "icon"),
                },
              ]}
              placeholder="Create a password"
              placeholderTextColor={useThemeColor({}, "icon")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              Confirm Password
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
              placeholder="Confirm your password"
              placeholderTextColor={useThemeColor({}, "icon")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <ThemedButton
            title="Create Account"
            onPress={handleSignup}
            loading={isLoading}
            style={styles.signupButton}
            size="large"
          />

          <View style={styles.footer}>
            <ThemedText type="default" style={styles.footerText}>
              Already have an account?
              {" "}
            </ThemedText>
            <ThemedText
              type="link"
              style={styles.signInLink}
              onPress={() => router.push("/(auth)/login")}
            >
              Log In
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
    marginBottom: 30,
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
  signupButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
  },
  signInLink: {
    textDecorationLine: "underline",
  },
});
