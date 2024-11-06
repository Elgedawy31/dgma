import { StyleSheet } from 'react-native';
import { forwardRef, memo, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

type BottomSheetProps = {
    index?: number;
    open?: boolean;
    children: ReactNode;
};

const BottomSheet: React.FC<BottomSheetProps> = ({ children, open, index }) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(() => ['25%', '50%', '75%', '100%'], []);

    const handleSheetChanges = useCallback((index: number) => console.log('handleSheetChanges', index), []);

    useEffect(() => {
        console.log("Open", open);
        if (open) {
            bottomSheetModalRef.current?.present();
        } else {
            bottomSheetModalRef.current?.dismiss();
        }
    }, [open]);

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
            ref={bottomSheetModalRef}
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

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

export default memo(BottomSheet);