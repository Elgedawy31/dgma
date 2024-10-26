import React, { memo, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import BottomSheet from '@blocks/BottomSheet';
import Text from '@blocks/Text';
import Button from '@ui/Button';
import MeetingDetails from '@components/MeetingDetails';
import Icon from '@blocks/Icon';
import { router } from 'expo-router';

function Meetings() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <Text type='title' title='There are no ongoing meetings' />
        </View>
      </View>
      <BottomSheet ref={bottomSheetModalRef} index={2}>
        <View style={{ flex: 1, width: '100%', }}>
          <Icon icon='close' iconColor='black' onPress={() => bottomSheetModalRef.current?.dismiss()} />
          <MeetingDetails onJoinPress={() => { bottomSheetModalRef.current?.dismiss(); router.push({ pathname: '/(meeting)/[id]', params: { id: '1' } })}} />
        </View>
      </BottomSheet>
      <Button
        type='float'
        icon='add'
        position={{ vertical: 5, horizontal: 2 }}
        onPress={handlePresentModalPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(Meetings);