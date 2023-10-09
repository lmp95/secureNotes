import {render, fireEvent} from "@testing-library/react-native";
import Login from "../src/pages/auth/login";

describe("App", () => {
	it("has login button with biometric", () => {
		const {queryByTestId} = render(<Login />);
		const biometricBtn = queryByTestId("Auth:Button:Biometric");
		expect(biometricBtn).not.toBeNull();
	});

	it("on press login with biometric function should called", () => {
		const onPressMock = jest.fn();

		const {getByTestId} = render(<Login />);
		const biometricBtn = getByTestId("Auth:Button:Biometric");

		fireEvent.press(biometricBtn);
		expect(onPressMock).toBeCalledWith(1);
	});
});
