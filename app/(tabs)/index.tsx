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
            {/* <ProjectOverview />
            <UpcomingMeetings /> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(HomeScreen);
