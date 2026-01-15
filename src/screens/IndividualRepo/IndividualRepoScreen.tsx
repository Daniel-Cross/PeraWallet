import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRepositoryStore } from "../../store/repositoryStore";
import { useFavoritesStore } from "../../store/favoritesStore";

const IndividualRepoScreen = () => {
  const navigation = useNavigation();
  const { selectedRepository, setSelectedRepository } = useRepositoryStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  if (!selectedRepository) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No repository selected</Text>
      </SafeAreaView>
    );
  }

  const openGithubUrl = () => {
    Linking.openURL(selectedRepository.html_url);
  };

  const handleGoBack = () => {
    navigation.goBack();
    setSelectedRepository(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          testID="back-button"
        >
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Repository Details</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(selectedRepository.id)}
          style={styles.favoriteButton}
          testID="favorite-button"
        >
          <FontAwesome
            name={isFavorite(selectedRepository.id) ? "heart" : "heart-o"}
            size={24}
            color="#e74c3c"
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.owner}>@{selectedRepository.owner.login}</Text>
          <Text style={styles.name}>{selectedRepository.name}</Text>

          {selectedRepository.description && (
            <Text style={styles.description}>
              {selectedRepository.description}
            </Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <FontAwesome name="star" size={20} color="salmon" />
            <Text style={styles.statText}>
              {selectedRepository.stargazers_count.toLocaleString()} stars
            </Text>
          </View>

          {selectedRepository.language && (
            <View style={styles.statItem}>
              <FontAwesome name="code" size={20} color="#666" />
              <Text style={styles.statText}>{selectedRepository.language}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{selectedRepository.full_name}</Text>
        </View>

        <TouchableOpacity style={styles.linkButton} onPress={openGithubUrl}>
          <FontAwesome name="github" size={20} color="#fff" />
          <Text style={styles.linkButtonText}>View on GitHub</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  owner: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#24292e",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default IndividualRepoScreen;
