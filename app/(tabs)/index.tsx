import { memo } from 'react';
import { ScrollView, View } from 'react-native';
import { useThemeColor } from '@hooks/useThemeColor';
import ProjectOverview from '@components/ProjectOverview';
import CurrentProjects from '@components/CurrentProjects';
import UpcomingMeetings from '@components/UpcomingMeetings';


function HomeScreen() {
  const colors = useThemeColor();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View style={{ flex: 1, gap: 16, paddingVertical: 8 }}>
          <CurrentProjects />
          <View style={{ paddingRight: 16, paddingLeft: 16, }}>
            <ProjectOverview />
            <UpcomingMeetings />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(HomeScreen);

// <ParallaxScrollView
//   headerBackgroundColor={{ light: 'red', dark: 'yellow' }}
//   headerImage={
//     <Image
//       source={require('@/assets/images/partial-react-logo.png')}
//       style={styles.reactLogo}
//     />
//   }>
//   <ThemedView style={styles.titleContainer}>
//     <ThemedText type="title">Welcome!</ThemedText>
//     <HelloWave />
//   </ThemedView>
//   <ThemedView style={styles.stepContainer}>
//     <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//     <ThemedText>
//       Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//       Press{' '}
//       <ThemedText type="defaultSemiBold">
//         {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
//       </ThemedText>{' '}
//       to open developer tools.
//     </ThemedText>
//   </ThemedView>
//   <ThemedView style={styles.stepContainer}>
//     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//     <ThemedText>
//       Tap the Explore tab to learn more about what's included in this starter app.
//     </ThemedText>
//   </ThemedView>
//   <ThemedView style={styles.stepContainer}>
//     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//     <ThemedText>
//       Tap the Explore tab to learn more about what's included in this starter app.
//     </ThemedText>
//   </ThemedView>
//   <ThemedView style={styles.stepContainer}>
//     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//     <ThemedText>
//       Tap the Explore tab to learn more about what's included in this starter app.
//     </ThemedText>
//   </ThemedView>
//   <ThemedView style={styles.stepContainer}>
//     <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//     <ThemedText>
//       Tap the Explore tab to learn more about what's included in this starter app.
//     </ThemedText>
//   </ThemedView>
//   <ThemedView style={styles.stepContainer}>
//     <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//     <ThemedText>
//       When you're ready, run{' '}
//       <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//       <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//       <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//       <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//     </ThemedText>
//   </ThemedView>
// </ParallaxScrollView>