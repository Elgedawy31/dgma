import { Link, Stack, usePathname } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';


function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>This screen doesn't exist.</Text>
      <Text>Current URL is: {usePathname()} </Text>
      <Link href="/">Go to home screen!</Link>
    </View>
  );
}
export default memo(NotFoundScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
