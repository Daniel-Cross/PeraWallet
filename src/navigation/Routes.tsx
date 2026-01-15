import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndividualRepoScreen from "../screens/IndividualRepoScreen";
import TabNavigation from "./TabStack";
import { ROUTES } from "../types/constants";

export type MainStackParamList = {
  Tabs: undefined;
  IndividualRepo: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();
const navigationRef = createNavigationContainerRef<MainStackParamList>();

const Routes = () => {
  const MainStackScreens = () => {
    return (
      <MainStack.Navigator>
        <MainStack.Screen
          name={ROUTES.TABS}
          component={TabNavigation}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <MainStack.Screen
          name={ROUTES.INDIVIDUAL_REPO}
          component={IndividualRepoScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </MainStack.Navigator>
    );
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStackScreens />
    </NavigationContainer>
  );
};

export default Routes;
