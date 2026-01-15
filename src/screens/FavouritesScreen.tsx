import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFavouritesStore } from "../store/favouritesStore";
import { useGithubRepos } from "../hooks/useGithubRepos";
import { useRepositoryStore } from "../store/repositoryStore";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/Routes";
import { ROUTES } from "../types/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Loading from "../components/atoms/Loading";
import { useMemo } from "react";

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const FavouritesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { favouriteIds, isFavourite, toggleFavourite } = useFavouritesStore();
  const { data, isLoading } = useGithubRepos();
  const { setSelectedRepository } = useRepositoryStore();

  const favouriteRepos = useMemo(() => {
    if (!data) return [];
    return data.filter((repo) => favouriteIds.includes(repo.id));
  }, [data, favouriteIds]);

  if (isLoading) {
    return <Loading />;
  }

  if (favouriteRepos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <FontAwesome name="heart-o" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Favourites Yet</Text>
          <Text style={styles.emptyMessage}>
            Tap the heart icon on any repository to add it to your favourites
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favouriteRepos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setSelectedRepository(item);
              navigation.navigate(ROUTES.INDIVIDUAL_REPO);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.owner}>@{item.owner.login}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.stars}>
                  <FontAwesome name="star" size={16} color="salmon" />{" "}
                  {item.stargazers_count}
                </Text>
              </View>
              <TouchableOpacity
                onPress={(e) => {
                  e?.stopPropagation?.();
                  toggleFavourite(item.id);
                }}
                style={styles.favouriteIcon}
                testID={`favourite-icon-${item.id}`}
              >
                <FontAwesome
                  name={isFavourite(item.id) ? "heart" : "heart-o"}
                  size={24}
                  color="#e74c3c"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
    color: "#333",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  favouriteIcon: {
    padding: 4,
  },
  owner: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  stars: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default FavouritesScreen;
