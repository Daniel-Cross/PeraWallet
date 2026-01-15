import "@testing-library/react-native/extend-expect";

// Mock expo-asset first
jest.mock("expo-asset", () => ({
  Asset: {
    fromModule: jest.fn(() => ({ downloadAsync: jest.fn() })),
    loadAsync: jest.fn(),
  },
}));

// Mock expo-font
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

// Mock Expo Vector Icons
jest.mock("@expo/vector-icons/FontAwesome", () => {
  const React = require("react");
  return React.forwardRef((props, ref) =>
    React.createElement("FontAwesome", { ...props, ref })
  );
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
