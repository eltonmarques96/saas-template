import Button from "@/components/Button";
import api from "@/services/api";
import {
  Container,
  FormField,
  LinksButtons,
  PageTitle,
  SubButtonsContainer,
  Subtitle,
} from "@/styles/App";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, Alert } from "react-native";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = async () => {
    try {
      if (!email) {
        Alert.alert("Error", "Please enter your email address.");
        return;
      }
      const response = await api.post("/user/forgot-password", {
        email,
      });
      if (response.status === 200) {
        alert("Please check your email");
      } else {
        throw new Error(response.data);
      }
    } catch (error) {
      alert("Error on reset your password, please try again");
      console.error(error);
    }
  };

  return (
    <Container>
      <PageTitle>Forgot Password</PageTitle>
      <Subtitle>
        Enter your email address below to receive a password reset link.
      </Subtitle>
      <FormField
        placeholder="Email Address"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Reset Password" onPress={() => handleResetPassword()} />
      <SubButtonsContainer>
        <TouchableOpacity onPress={() => router.navigate("/")}>
          <LinksButtons>Login</LinksButtons>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate("/register")}>
          <LinksButtons>Register</LinksButtons>
        </TouchableOpacity>
      </SubButtonsContainer>
    </Container>
  );
};

export default ForgotPassword;
