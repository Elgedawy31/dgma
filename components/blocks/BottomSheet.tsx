import { StyleSheet } from 'react-native';
import { forwardRef, memo, ReactNode, useCallback, useMemo } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

type BottomSheetProps = {
    index?: number;
    children: ReactNode;
};

const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
    ({ children, index }, ref) => {
        const snapPoints = useMemo(() => ['25%', '50%', '75%', '100%'], []);

        const handleSheetChanges = useCallback((index: number) => console.log('handleSheetChanges', index), []);

        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    disappearsOnIndex={-1}
                    appearsOnIndex={0}
                    {...props}
                />
            ),
            []
        );

        return (
            <BottomSheetModal
                ref={ref}
                index={index}
                snapPoints={snapPoints}
                // onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView style={styles.contentContainer}>
                    {children}
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

export default memo(BottomSheet);