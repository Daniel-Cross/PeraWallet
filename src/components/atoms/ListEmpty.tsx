import { StyleSheet, Text, View } from "react-native";

const ListEmpty = () => {
  return (
    <View style={styles.center}>
      <Text>No data found. Please check your search filters.</Text>
    </View>
  );
};

export default ListEmpty;

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
