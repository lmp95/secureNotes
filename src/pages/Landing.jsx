import React, { useEffect } from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import Note3DImg from "../../assets/note-3d.png";
import AppButton from "../components/Button";
import { setItemAsync } from "expo-secure-store";
import { sha256 } from "react-native-sha256";
import { testingPassword } from "../constants";

function Landing({navigation}) {

	useEffect(() => {
		sha256(testingPassword).then(async (hash) => {
			await setItemAsync(testingPassword, hash)
		});
	}, []);


	return (
		<View style={styles.wrapper}>
			<View style={styles.container}>
				<Image style={styles.noteImg} source={Note3DImg} resizeMode="contain" />
				<Text style={styles.title}>Welcome</Text>
				<Text style={styles.subtitle}>The best encrypted note taking app</Text>
			</View>
			<AppButton label="Login" onPress={() => navigation.navigate("Login")} />
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		padding: 24,
	},
	container: {
		flex: 1,
		display: "flex",
		justifyContent: "center",
	},
	noteImg: {width: 200, height: 200},
	title: {
		fontSize: 42,
		fontWeight: "bold",
	},
	subtitle: {
		paddingTop: 16,
		fontSize: 20,
	},
});

export default Landing;
