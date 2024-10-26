//#region Imports
import Text from '@blocks/Text';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
//#endregion

type TabBarItemProps = {
  name: any;
  label: string;
  color: string;
}
export function TabBarItem({ label, name, color/*, style, selected */ }: TabBarItemProps) {
  return (
    <View style={[styles.container/*, selected && { borderTopWidth: 2, borderTopColor: 'white', borderColor: 'white' }*/]}>
      <Ionicons size={28} name={name} color={color} /*style={{ ...style, }} */ />
      <Text type='label' color={color} title={label} />
    </View>
  );
}

//#region Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    borderTopWidth: 1,
    paddingVertical: 8,
    alignItems: 'center',
  }
});
//#endregion
