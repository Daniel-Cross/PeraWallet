import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFilterStore } from "../../store/filterStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect, useState } from "react";

const SearchAndFilter = () => {
  const { searchText, setSearchText, setModalVisible } = useFilterStore();
  const [text, setText] = useState(searchText);
  const debouncedSearchTerm = useDebounce(text);

  useEffect(() => {
    setSearchText(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search repositories..."
        style={styles.input}
        value={text}
        onChangeText={(text) => {
          setText(text);
        }}
      />
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setModalVisible(true)}
        testID="filter-button"
      >
        <Text style={styles.filterButtonText}>
          <FontAwesome name="filter" size={24} color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchAndFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f0f0f0",
    gap: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 18,
  },
});
