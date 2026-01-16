import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRepositories } from "../hooks/useRepositories";
import { useOrganizations } from "../hooks/useOrganizations";
import { useFilteredRepositories } from "../hooks/useFilteredRepositories";
import { usePagination } from "../hooks/usePagination";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchAndFilter from "../components/molecules/SearchAndFilter";
import { useFilterStore } from "../store/filterStore";
import { useRepositoryStore } from "../store/repositoryStore";
import { useFavouritesStore } from "../store/favouritesStore";
import FilterModal from "../components/molecules/FilterModal";
import Loading from "../components/atoms/Loading";
import ListEmpty from "../components/atoms/ListEmpty";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../navigation/Routes";
import { REQUEST_STATUS, ROUTES } from "../types/constants";

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const RepoListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    allRepos,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    status,
  } = useRepositories();

  const organizations = useOrganizations(allRepos);
  const filteredData = useFilteredRepositories(allRepos);
  const { handleLoadMore } = usePagination({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  });

  const { isModalVisible } = useFilterStore();
  const { setSelectedRepository } = useRepositoryStore();
  const { isFavourite, toggleFavourite } = useFavouritesStore();

  if (status === REQUEST_STATUS.PENDING) {
    return <Loading />;
  }

  if (status === REQUEST_STATUS.ERROR) {
    return (
      <View style={styles.center}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={filteredData}
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
        ListHeaderComponent={<SearchAndFilter />}
        ListEmptyComponent={<ListEmpty />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <Loading />
            </View>
          ) : null
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      {isModalVisible && <FilterModal organizations={organizations} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    marginBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  footer: {
    padding: 16,
    alignItems: "center",
  },
});

export default RepoListScreen;
