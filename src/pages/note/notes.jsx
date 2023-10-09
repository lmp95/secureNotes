import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Card from "../../components/Card";
import AppButton from "../../components/Button";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {openDatabase} from "expo-sqlite";

function Notes() {
	const {userKey} = useRoute().params || {};
	const navigation = useNavigation();
	const [notes, setNotes] = useState([]);
	const sqliteDB = openDatabase("notes.db");

	useFocusEffect(
		useCallback(() => {
			if(!userKey) { 
				navigation.goBack()
			}
			else{
				sqliteDB.transaction(trx => {
					trx.executeSql(
						"SELECT * FROM notes",
						null,
						(_, result) => setNotes(result.rows._array),
						(_, error) => console.log(error)
					);
				});
			}
		}, [])
	);

	return (
		<>
			{notes.length > 0 ? (
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					{notes.map(({id, title}) => (
						<Card
							key={id}
							title={title}
							onPress={() =>
								navigation.navigate("CreateNote", {
									id,
									userKey,
								})
							}
						/>
					))}
				</ScrollView>
			) : (
				<View
					style={{
						alignSelf: "center",
						flex: 1,
						justifyContent: "center",
					}}>
					<Text>Empty</Text>
				</View>
			)}
			<View style={styles.floatingBtn}>
				<AppButton label="Add New Note" onPress={() => navigation.navigate("CreateNote", {userKey: userKey})} />
			</View>
		</>
	);
}

export default Notes;

const styles = StyleSheet.create({
	floatingBtn: {
		position: "absolute",
		bottom: 20,
		margin: "auto",
		width: 150,
		right: 20,
		justifyContent: "center",
	},
});
