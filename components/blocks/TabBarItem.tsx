//#region Imports
import Text from '@blocks/Text';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useContext } from 'react';
import { NotificationContext } from '../NotificationSystem';
//#endregion

type TabBarItemProps = {
  name: any;
  label: string;
  color: string;
}

export function TabBarItem({ label, name, color/*, style, selected */ }: TabBarItemProps) {
  const { lastNotificationSenderId } = useContext(NotificationContext);
  const showBadge = label.toLowerCase() === 'messaging' && lastNotificationSenderId.length > 0;

  return (
    <View style={[styles.container/*, selected && { borderTopWidth: 2, borderTopColor: 'white', borderColor: 'white' }*/]}>
      <View>
        <Ionicons size={28} name={name} color={color} /*style={{ ...style, }} */ />
        {showBadge && (
          <View style={styles.badge}>
            <Text 
              type="label" 
              color="#FFFFFF" 
              size={12} 
              bold 
              title={lastNotificationSenderId.length.toString()} 
            />
          </View>
        )}
      </View>
      <Text type='label' color={color} title={label} />
    </View>
  );
}

//#region Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  }
});
//#endregion
