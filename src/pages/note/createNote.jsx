import React, {useEffect, useState} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import AppButton from "../../components/Button";
import {useNavigation, useRoute} from "@react-navigation/native";
import {openDatabase} from "expo-sqlite";
import CryptoJS from 'react-native-crypto-js';

function CreateNote() {
	const {id, userKey} = useRoute().params || {};
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const sqliteDB = openDatabase("notes.db");
	const navigation = useNavigation();

	const {contentStyle, createNoteWrapper, saveBtn, titleStyle} = styles;

	useEffect(() => {
		if (id && userKey) {
			sqliteDB.transaction(trx => {
				trx.executeSql(
					"SELECT * FROM notes WHERE id = ?",
					[id],
					(_, result) => {
						setTitle(result.rows.item(0).title);
						const decrypt = CryptoJS.AES.decrypt(result.rows.item(0).content, userKey).toString(CryptoJS.enc.Utf8);
						setContent(decrypt);
					},
					(_, error) => console.log(error)
				);
			});
		}
	}, [id, userKey]);

	const saveNote = () => {
		const encryptedContent = CryptoJS.AES.encrypt(content, userKey).toString();
		sqliteDB.transaction(trx => {
			trx.executeSql(
				"INSERT INTO notes (title, content) values (?,?)",
				[title, encryptedContent],
				() => navigation.navigate("Notes"),
				(_, error) => console.log(error)
			);
		});
		// sqliteDB.transaction(trx => {
		// 	trx.executeSql(
		// 		"DELETE FROM notes",
		// 		null,
		// 		() => navigation.navigate("Notes"),
		// 		(_, error) => console.log(error)
		// 	)
		// })
	};

	return (
		<>
			<View style={createNoteWrapper}>
				<TextInput
					style={titleStyle}
					defaultValue={title}
					editable={!id}
					placeholder="Title"
					onChangeText={setTitle}
					multiline
				/>
				<TextInput
					style={contentStyle}
					defaultValue={content}
					editable={!id}
					placeholder="Content"
					multiline
					onChangeText={setContent}
				/>
			</View>
			{!id && (
				<View style={saveBtn}>
					<AppButton disabled={!(title && content)} label="Save" onPress={saveNote} />
				</View>
			)}
		</>
	);
}

export default CreateNote;

const styles = StyleSheet.create({
	createNoteWrapper: {fontSize: 36, padding: 8, position: "relative", flex: 1},
	titleStyle: {fontSize: 36},
	contentStyle: {
		flex: 1,
		textAlignVertical: "top",
	},
	saveBtn: {
		position: "absolute",
		marginHorizontal: 16,
		bottom: 20,
		margin: "auto",
		left: 0,
		right: 0,
	},
});
