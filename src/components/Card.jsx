import React from "react";
import {StyleSheet, Text, TouchableOpacity} from "react-native";

function Card({title, onPress}) {
	return (
		<TouchableOpacity style={styles.card} onPress={onPress}>
			<Text>{title}</Text>
		</TouchableOpacity>
	);
}

export default Card;

const styles = StyleSheet.create({
	card: {
		padding: 16,
		marginTop: 16,
		marginHorizontal: 16,
		flex: 1,
		height: 50,
		borderRadius: 16,
		backgroundColor: "#f5f5f5",
		borderWidth: 1,
		borderColor: "#d5d5d5",
	},
});
