import { StyleSheet } from 'react-native';
import { forwardRef, memo, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useThemeColor } from '@hooks/useThemeColor';

type BottomSheetProps = {
    index?: number;
    open?: boolean;
    children: ReactNode;
};

const BottomSheet: React.FC<BottomSheetProps> = ({ children, open, index }) => {
    const colors = useThemeColor();
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
            backgroundStyle={{ backgroundColor: colors.card }}
        >
            <BottomSheetView style={[styles.contentContainer, { backgroundColor: colors.card }]}>
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
