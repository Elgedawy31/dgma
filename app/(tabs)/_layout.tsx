import Icon from '@blocks/Icon';
import AppBar from '@blocks/AppBar';
import { memo, useContext } from 'react';
import { router, Tabs } from 'expo-router';
import { userContext } from '@UserContext';
import { TabBarItem } from '@blocks/TabBarItem';
import { useThemeColor } from '@hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';

const tabs = [
  { name: 'index', label: 'Home', icon: 'home', hasHeader: true },
  { name: 'messaging', label: 'Messaging', icon: 'notifications', hasHeader: false },
  { name: 'tasks', label: 'Tasks', icon: 'layers', hasHeader: true },
  { name: 'calendar', label: 'Calendar', icon: 'calendar', hasHeader: false },
];
function TabLayout() {
  const colors = useThemeColor();

  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor:colors.background }}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          
          tabBarActiveTintColor: colors.activeTab,
          tabBarInactiveTintColor: colors.inactiveTab,
          tabBarActiveBackgroundColor: colors.primaryTab,
          tabBarItemStyle: { backgroundColor: 'transparent', },
          tabBarStyle: {
            height: 60,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            backgroundColor: colors.primaryTab,
            borderTopWidth:0
          },
        }}>
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: '',
              headerShown: tab.hasHeader,
              header: () =>
                <AppBar leading='avatar'
                  action={
                    <Icon
                      icon='video' type='complex' iconColor={colors.primary}
                      onPress={() => router.push('/meetings')} />
                  }
                />,
              tabBarIcon: ({ color, focused }) => (
                <TabBarItem label={tab.label} name={focused ? tab.icon : `${tab.icon}-outline`} color={color} />
              ),
            }}
          />
        ))}

        {/* <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarItem label='Home' name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messaging"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarItem label='Messaging' name={focused ? 'notifications' : 'notifications-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabBarItem label='Tasks' name={focused ? 'layers' : 'layers-outline'} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="meetings"
        options={{
          title: '',
          headerTitle: 'Meetings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarItem label="Meetings" name={focused ? 'videocam' : 'videocam-outline'} color={color} />
          ),
        }}
      /> */}
      </Tabs>
    </SafeAreaView>

  );
}
export default memo(TabLayout);