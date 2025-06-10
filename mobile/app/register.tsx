import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import {
	Container,
	FormField,
	LinksButtons,
	PageTitle,
	SubButtonsContainer,
} from "@/styles/App";
import * as Crypto from "expo-crypto";
import api from "@/services/api";

const Register = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleLogin = () => {
		router.navigate("/");
	};

	const handleForgotPassword = () => {
		router.navigate("/forgot-password");
	};

	const handleSubmit = async () => {
		try {
			const { firstName, lastName, email, password, confirmPassword } = formData;

			if (password !== confirmPassword) {
				alert("Passwords do not match!");
				return;
			}

			const hashedPassword = await Crypto.digestStringAsync(
				Crypto.CryptoDigestAlgorithm.MD5,
				password
			);

			const response = await api.post("/user/register", {
				firstName,
				lastName,
				email,
				password: hashedPassword,
			});

			if (response.status === 201) {
				alert(
					"Registration successful! Please Check your e-mail account and verify your account"
				);
			} else if (response.status === 409) {
				alert("User account already exists");
			}
		} catch (error) {
			console.error(error);
			alert("An error occurred during registration.");
		}
	};

	return (
		<Container>
			<PageTitle>Register</PageTitle>
			<FormField
				placeholder="First Name"
				value={formData.firstName}
				onChangeText={(value: string) => handleInputChange("firstName", value)}
			/>
			<FormField
				placeholder="Last Name"
				value={formData.lastName}
				onChangeText={(value: string) => handleInputChange("lastName", value)}
			/>
			<FormField
				placeholder="Email"
				inputMode="email"
				value={formData.email}
				onChangeText={(value: string) => handleInputChange("email", value)}
				keyboardType="email-address"
			/>
			<FormField
				placeholder="Password"
				value={formData.password}
				onChangeText={(value: string) => handleInputChange("password", value)}
				secureTextEntry
			/>
			<FormField
				placeholder="Confirm Password"
				value={formData.confirmPassword}
				onChangeText={(value: string) =>
					handleInputChange("confirmPassword", value)
				}
				secureTextEntry
			/>
			<Button onPress={handleSubmit} title="Register" />
			<SubButtonsContainer>
				<TouchableOpacity onPress={handleLogin}>
					<LinksButtons>Login</LinksButtons>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleForgotPassword}>
					<LinksButtons>Forgot Password</LinksButtons>
				</TouchableOpacity>
			</SubButtonsContainer>
		</Container>
	);
};

export default Register;
