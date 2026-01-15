import { useState, useMemo, useEffect } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useGithubRepos } from "../../hooks/useGithubRepos";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchAndFilter from "../../components/molecules/SearchAndFilter";
import {
  extractUniqueOrganizations,
  filterRepositories,
  toggleOrganization,
} from "../../lib/filterHelpers";
import { useFilterStore } from "../../store/filterStore";
import { useRepositoryStore } from "../../store/repositoryStore";
import FilterModal from "../../components/molecules/FilterModal";
import Loading from "../../components/atoms/Loading";
import ListEmpty from "../../components/atoms/ListEmpty";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../Routes";
import { ROUTES } from "../../types/constants";

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const RepoListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { data, isLoading, error } = useGithubRepos();
  const { isModalVisible, searchText } = useFilterStore();
  const { setSelectedRepository } = useRepositoryStore();

  const organizations = useMemo(() => {
    if (!data) return [];
    return extractUniqueOrganizations(data);
  }, [data]);

  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (organizations.length > 0 && selectedOrganizations.length === 0) {
      setSelectedOrganizations(organizations);
    }
  }, [organizations]);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return filterRepositories(data, searchText, selectedOrganizations);
  }, [data, searchText, selectedOrganizations]);

  const handleOrganizationToggle = (org: string) => {
    const updatedOrganizations = toggleOrganization(selectedOrganizations, org);
    setSelectedOrganizations(updatedOrganizations);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
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
            <Text style={styles.owner}>@{item.owner.login}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.stars}>
              <FontAwesome name="star" size={24} color="salmon" />
              {item.stargazers_count}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<SearchAndFilter />}
        ListEmptyComponent={<ListEmpty />}
      />

      {isModalVisible && (
        <FilterModal
          selectedOrganizations={selectedOrganizations}
          organizations={organizations}
          handleOrganizationToggle={handleOrganizationToggle}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default RepoListScreen;
