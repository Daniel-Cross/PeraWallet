const pkgs = require("./package.json");
const BUILD_NUMBER = Math.floor(Date.now() / 1000).toString();

export default {
  expo: {
    name: "Pera Wallet",
    slug: "pera-wallet",
    version: "1.0.0",
    orientation: "portrait",
    owner: "daniel.cross",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.algorand.perawallet",
      buildNumber: BUILD_NUMBER,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: "com.algorand.perawallet",
      versionCode: parseInt(BUILD_NUMBER),
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "429cb879-1ff1-4286-b0f6-342b415f7bd9",
      },
    },
  },
};
