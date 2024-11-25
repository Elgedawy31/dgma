import { memo, useContext, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useThemeColor } from '@hooks/useThemeColor';
import ProjectOverview from '@components/ProjectOverview';
import CurrentProjects from '@components/CurrentProjects';
import UpcomingMeetings from '@components/UpcomingMeetings';
import { projectsContext } from '@ProjectsContext';
import { userContext } from '@UserContext';
import HomeTasks from '@components/HomeTasks';


function HomeScreen() {
  const colors = useThemeColor();
  const { loadProjects } = useContext(projectsContext);
  const { userToken } = useContext(userContext);
  useEffect(() => { console.log(userToken); loadProjects(); }, [userToken]);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: colors.background }}>
        <View style={{ flex: 1, gap: 16, paddingVertical: 8 }}>
          <CurrentProjects />
          <View style={{ paddingRight: 16, paddingLeft: 16, }}>
            <ProjectOverview />
            <UpcomingMeetings />
            <HomeTasks />

          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(HomeScreen);
