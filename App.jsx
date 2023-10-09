import { useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Landing from "./src/pages/Landing";
import {SafeAreaView, StatusBar, StyleSheet, View, useColorScheme} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";
import Login from "./src/pages/auth/login";
import Notes from "./src/pages/note/notes";
import CreateNote from "./src/pages/note/createNote";
import {openDatabase} from "expo-sqlite";

const Stack = createNativeStackNavigator();

function App() {
	const isDarkMode = useColorScheme() === "dark";
	const sqliteDB = openDatabase("notes.db");

	useEffect(() => {
		sqliteDB.transaction(trx => {
			trx.executeSql(
				"CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)"
			);
		});
	}, []);

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	return (
		<SafeAreaView style={backgroundStyle}>
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<View style={styles.main}>
				<NavigationContainer>
					<Stack.Navigator
						initialRouteName="Landing"
						screenOptions={{
							headerStyle: {
								backgroundColor: Colors.lighter,
							},
						}}>
						<Stack.Screen
							name="Landing"
							component={Landing}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="Login"
							component={Login}
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="Notes"
							component={Notes}
							options={{
								headerShadowVisible: false,
								title: "Notes",
							}}
						/>
						<Stack.Screen name="CreateNote" component={CreateNote} />
					</Stack.Navigator>
				</NavigationContainer>
			</View>
		</SafeAreaView>
	);
}

export default App;

const styles = StyleSheet.create({
	main: {width: "100%", height: "100%"},
});
