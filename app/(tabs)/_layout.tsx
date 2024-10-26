import Text from '@blocks/Text';
import { View } from 'react-native';
import StackUI from '@blocks/StackUI';
import AppBar from '@blocks/AppBar';
import { memo, useContext } from 'react';
import { Link, Tabs } from 'expo-router';
import ImageAvatar from '@blocks/ImageAvatar';
import { TabBarItem } from '@blocks/TabBarItem';
import { useThemeColor } from '@hooks/useThemeColor';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userContext } from '@UserContext';

const tabs = [
  { name: 'index', label: 'Home', icon: 'home', hasHeader: true },
  { name: 'messaging', label: 'Messaging', icon: 'notifications', hasHeader: false },
  { name: 'tasks', label: 'Tasks', icon: 'layers', hasHeader: true },
  { name: 'meetings', label: 'Meetings', icon: 'videocam', hasHeader: true },
];
function TabLayout() {
  // const colorScheme = useColorScheme();
  const colors = useThemeColor();
  const { user: { role, profilePicture, name: { first } } } = useContext(userContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarItemStyle: {
            backgroundColor: 'transparent',
          },
          headerShown: false,
          tabBarActiveTintColor: colors.activeTab,
          tabBarInactiveTintColor: colors.inactiveTab,
          tabBarActiveBackgroundColor: colors.primary,
          tabBarStyle: {
            height: 60,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            backgroundColor: colors.primary,
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
                  action={<View style={{ backgroundColor: '#F1F9FF', borderRadius: 50, padding: 8 }}>
                    <StackUI value={{ vertical: -5, horizontal: -1.5 }}
                      position={{ vertical: 'bottom', horizontal: 'right' }}
                      sec={<Octicons name="dot-fill" size={24} color="#09419A" />}
                      base={<Ionicons name="calendar-clear-outline" size={24} color="#09419A" />}
                    />
                  </View>
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