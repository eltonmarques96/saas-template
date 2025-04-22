import Button from "@/components/Button";
import {
  Container,
  FormField,
  LinksButtons,
  PageTitle,
  SubButtonsContainer,
} from "@/styles/App";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login with:", email, password);
  };

  const handleRegister = () => {
    router.navigate("/register");
  };

  const handleForgotPassword = () => {
    router.navigate("/forgot-password");
  };

  return (
    <Container>
      <PageTitle>Login</PageTitle>
      <FormField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handleLogin} title={"Login"} />
      <SubButtonsContainer>
        <TouchableOpacity onPress={handleRegister}>
          <LinksButtons>Register</LinksButtons>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword}>
          <LinksButtons>Forgot Password</LinksButtons>
        </TouchableOpacity>
      </SubButtonsContainer>
    </Container>
  );
};

export default Login;
