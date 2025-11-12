import { useAuth } from '@/hooks/AuthContext';
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Dropdown } from 'react-native-element-dropdown';

const clubs = [
  { label: 'Phi Kappa Alpha', value: 'Phi Kappa Alpha' },
  { label: 'Omega Chi', value: 'Omega Chi' },
  { label: 'Chi Beta Chi', value: 'Chi Beta Chi' },
  { label: 'Sigma Rho', value: 'Sigma Rho' },
  { label: 'Xi Chi Delta', value: 'Xi Chi Delta' },
];

export default function AuthScreen() {
  const {
    user,
    member,
    loading,
    login,
    register,
    logout,
    updateMember,
    refresh,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // only used in register
  const [club, setClub] = useState<"Phi Kappa Alpha"
    | "Omega Chi"
    | "Chi Beta Chi"
    | "Sigma Rho"
    | "Xi Chi Delta">() // only used in register
  const [phone, setPhone] = useState('') // only used in register
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password, name.trim(), phone.trim(), club ?? 'Chi Beta Chi');
      }
    } catch (err: any) {
      // Appwrite throws rich errors (code, message, etc.)
      setError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    // still checking existing session
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Checking session…</Text>
      </View>
    );
  }

  // if logged in, show a simple profile + logout
  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{member?.phone}</Text>
        <Text style={styles.label}>Club</Text>
        <Text style={styles.value}>{member?.club}</Text>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // if logged OUT, show login/register form
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {mode === "login" ? "Login" : "Create Account"}
        </Text>

        {mode === "register" && (
          <>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              placeholder="Jane Doe"
            />

            <Text style={styles.label}>Club</Text>
            <View style={styles.input}>
              <Dropdown
                  data={clubs}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={!isFocus ? 'Select a club...' : '...'}
                  value={club}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={item => {
                    setClub(item.value);
                    setIsFocus(false);
                  }}
                />
            </View>

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="words"
              value={phone}
              onChangeText={setPhone}
              placeholder="123-456-7890"
            />
          </>

          
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>
              {mode === "login" ? "Sign In" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            setMode((m) => (m === "login" ? "register" : "login"))
          }
        >
          <Text style={styles.linkText}>
            {mode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  scrollContent: {
    paddingTop: 96,
    paddingHorizontal: 24,
    paddingBottom: 32
  },
  container: {
    flex: 1
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#a9a9a9",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    color: '#4000ffff',
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 12,
  },
});