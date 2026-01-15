import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ROUTES } from "../types/constants";
import RepoListScreen from "../screens/RepoListScreen";
import FavouritesScreen from "../screens/FavouritesScreen";

type TabParamList = {
  [ROUTES.REPO_LIST]: undefined;
  [ROUTES.FAVOURITES]: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        gestureEnabled: false,
        tabBarActiveTintColor: "#FFFFFF ",
        tabBarInactiveTintColor: "#CCCCCC",
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
          position: "absolute",
          paddingTop: 10,
          elevation: 0,
        },
        tabBarIcon: ({ color }) => {
          let iconName: any;

          if (route.name === ROUTES.REPO_LIST) {
            iconName = "home-outline";
          }
          if (route.name === ROUTES.FAVOURITES) {
            iconName = "heart-outline";
          }
          return <Ionicons name={iconName} size={25} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.REPO_LIST}
        component={RepoListScreen}
        options={{ tabBarShowLabel: false }}
      />
      <Tab.Screen
        name={ROUTES.FAVOURITES}
        component={FavouritesScreen}
        options={{ tabBarShowLabel: false }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
