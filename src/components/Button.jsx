import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";

function AppButton({label, onPress, testID, disabled = false}) {
	return (
		<TouchableOpacity
			testID={testID}
			disabled={disabled}
			style={styles.btn(disabled)}
			onPress={onPress}>
			<Text style={styles.btnText}>{label}</Text>
		</TouchableOpacity>
	);
}
const styles = StyleSheet.create({
	btn: disabled => ({
		backgroundColor: disabled ? "#adb5bd" : "#2ec4b6",
		borderRadius: 20,
		paddingVertical: 12,
		paddingHorizontal: 12,
	}),
	btnText: {
		color: "#fff",
		alignSelf: "center",
		textTransform: "uppercase",
		fontWeight: "600",
	},
});

export default AppButton;
