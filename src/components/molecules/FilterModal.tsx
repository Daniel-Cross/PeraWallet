import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useFilterStore } from "../../store/filterStore";

interface FilterModalProps {
  organizations: string[];
}

const FilterModal = ({ organizations }: FilterModalProps) => {
  const {
    isModalVisible,
    setModalVisible,
    selectedOrganizations,
    setSelectedOrganizations,
    minStars,
    setMinStars,
  } = useFilterStore();

  const [activeTab, setActiveTab] = useState<"organization" | "stars">(
    "organization"
  );
  const [starsInput, setStarsInput] = useState(minStars.toString());

  const toggleOrganization = (org: string) => {
    if (selectedOrganizations.includes(org)) {
      const newOrgs = selectedOrganizations.filter((o) => o !== org);
      setSelectedOrganizations(newOrgs);
    } else {
      const newOrgs = [...selectedOrganizations, org];
      setSelectedOrganizations(newOrgs);
    }
  };

  const handleStarsChange = (text: string) => {
    setStarsInput(text);
    const numValue = parseInt(text, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setMinStars(numValue);
    } else if (text === "") {
      setMinStars(0);
    }
  };

  const handleReset = () => {
    setSelectedOrganizations(organizations);
    setMinStars(0);
    setStarsInput("0");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={handleReset}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "organization" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("organization")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "organization" && styles.activeTabText,
                ]}
              >
                Organization
              </Text>
              {selectedOrganizations.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {selectedOrganizations.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "stars" && styles.activeTab]}
              onPress={() => setActiveTab("stars")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "stars" && styles.activeTabText,
                ]}
              >
                Stars
              </Text>
              {minStars > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>
            {activeTab === "organization" && (
              <FlatList
                data={organizations}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                  const isSelected = selectedOrganizations.includes(item);
                  return (
                    <Pressable
                      style={styles.listItem}
                      onPress={() => toggleOrganization(item)}
                      testID={`org-filter-${item}`}
                    >
                      <Text style={styles.listItemText}>{item}</Text>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxChecked,
                        ]}
                      >
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No organizations found</Text>
                }
              />
            )}

            {activeTab === "stars" && (
              <ScrollView style={styles.starsContent}>
                <Text style={styles.starsLabel}>Minimum Stars</Text>
                <TextInput
                  style={styles.starsInput}
                  value={starsInput}
                  onChangeText={handleStarsChange}
                  keyboardType="numeric"
                  placeholder="0"
                  testID="stars-input"
                />
                <Text style={styles.starsHint}>
                  Show repositories with at least this many stars
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    height: "75%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  badge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listItemText: {
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    padding: 20,
    textAlign: "center",
    color: "#999",
  },
  starsContent: {
    padding: 20,
  },
  starsLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  starsInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  starsHint: {
    fontSize: 14,
    color: "#666",
  },
});
