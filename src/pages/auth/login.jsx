import {
	authenticateAsync,
	hasHardwareAsync,
	isEnrolledAsync,
	supportedAuthenticationTypesAsync,
} from "expo-local-authentication";
import React, {useEffect, useState} from "react";
import {Alert, Image, StyleSheet, Text, TextInput, View} from "react-native";
import AppButton from "../../components/Button";
import LockImg from "../../../assets/lock.png";
import { testingPassword } from "../../constants";
import { getItemAsync } from "expo-secure-store";

function Login({navigation}) {
	const [isBiometricSupported, setIsBiometricSupported] = useState(false);
	const [isFallback, setIsFallback] = useState(false);
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	useEffect(() => {
		(async () => {
			const compatible = await hasHardwareAsync();
			setIsBiometricSupported(compatible);
		})();
	}, []);

	const fallBackToPassword = () => {
		setIsFallback(true);
	};

	const alertComponent = (title, message, btn, btnAction) => {
		return Alert.alert(title, message, [{text: btn, onPress: btnAction}]);
	};

	const biometricAuthHandler = async () => {
		setIsAuthenticating(true);
		if (!isBiometricSupported) {
			return alertComponent("Please Enter Password", "Biometric not supported", "OK", () =>
				fallBackToPassword()
			);
		}

		if (isBiometricSupported) {
			await supportedAuthenticationTypesAsync();
		}

		const savedBiometric = await isEnrolledAsync();
		if (!savedBiometric) {
			setIsAuthenticating(false);
			return alertComponent("Biometric not setup", "Please login with password", "OK", () =>
				fallBackToPassword()
			);
		}

		const biometricAuth = await authenticateAsync({
			disableDeviceFallback: true,
			promptMessage: "Login with Biometrics",
			cancelLabel: "Cancel",
		});

		if (biometricAuth) {
			if (biometricAuth.success) {
				setIsAuthenticating(false);
				navigation.navigate("Notes");
			}
			if (biometricAuth.error) {
				setIsAuthenticating(false);
				alertComponent("Not recognized ", "Fail to authenticate", "Enter Password", () =>
					fallBackToPassword()
				);
			}
		}
	};

	const passwordAuthHandler = async () => {
		if (password === testingPassword) {
			setError(null);
			const key = await getItemAsync(password);
			navigation.navigate("Notes", {userKey: key});
		} else setError("Incorrect Password. Please try again!");
	};

	return (
		<View style={styles.container}>
			<View style={{flexDirection: "row", gap: 16, alignItems: "center"}}>
				<Image style={styles.authImg} source={LockImg} resizeMode="contain" />
				<Text style={styles.title}>Verify User</Text>
			</View>
			<View testID="Auth:Wrapper" style={styles.auth}>
				{isFallback ? (
					<>
						<Text>Enter Password</Text>
						<View
							style={{
								marginTop: 8,
								marginBottom: 16,
							}}>
							<TextInput
								style={styles.input}
								secureTextEntry
								onChangeText={setPassword}
								value={password}
								placeholder="Please enter password"
							/>
							{error && <Text style={styles.errorMsg}>{error}</Text>}
						</View>
						<AppButton label="Login" onPress={passwordAuthHandler} />
					</>
				) : (
					<AppButton
						testID="Auth:Button:Biometric"
						disabled={isAuthenticating}
						label="Login with Biometric"
						onPress={biometricAuthHandler}
					/>
				)}
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		display: "flex",
		justifyContent: "center",
	},
	authImg: {width: 46, height: 46},
	title: {
		fontSize: 32,
		fontWeight: "600",
		textTransform: "uppercase",
	},
	input: {
		height: 40,
		borderWidth: 1,
		padding: 10,
		borderRadius: 8,
		marginBottom: 4,
	},
	errorMsg: {fontSize: 12, color: "red"},
	auth: {marginVertical: 16},
});

export default Login;
