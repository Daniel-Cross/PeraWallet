import {
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IndividualRepoScreen from "../screens/IndividualRepoScreen";
import TabNavigation from "./TabStack";

export type MainStackParamList = {
  RepoList: undefined;
  IndividualRepo: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();
const navigationRef = createNavigationContainerRef<MainStackParamList>();

const Routes = () => {
  const MainStackScreens = () => {
    return (
      <MainStack.Navigator>
        <MainStack.Screen
          name="RepoList"
          component={TabNavigation}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <MainStack.Screen
          name="IndividualRepo"
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
