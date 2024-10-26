//#region Imports
import Dot from '@ui/dot';
import Text from '@blocks/Text';
import { router } from 'expo-router';
import { memo, useRef, useState } from 'react';
import StatusBar from '@blocks/StatusBar';
import { useThemeColor } from '@hooks/useThemeColor';
import { Image, StyleSheet, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import Button  from '@ui/Button';
import { Routes } from '@routes';
import useStorage from '@hooks/useStorage';
import { SafeAreaView } from 'react-native-safe-area-context';
//#endregion

const content = [
    'Onboarding - 1: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aperiam error eos, itaque repellendus commodi asperiores quidem, deleniti temporibus vero excepturi deserunt sit vel magni fuga nam. Amet, eligendi non.',
    'Onboarding - 2: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aperiam error eos, itaque repellendus commodi asperiores quidem, deleniti temporibus vero excepturi deserunt sit vel magni fuga nam. Amet, eligendi non.',
    'Onboarding - 3: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis aperiam error eos, itaque repellendus commodi asperiores quidem, deleniti temporibus vero excepturi deserunt sit vel magni fuga nam. Amet, eligendi non.',

]
const onboardingImages: { [key: number]: any } = {
    1: require('@images/on-boarding-1.png'),
    2: require('@images/on-boarding-2.png'),
    3: require('@images/on-boarding-3.png'),
};

function OnboardingScreen() {
    const { writeStorage } = useStorage();
    const colors = useThemeColor();
    const [index, setIndex] = useState(0);
    const onboardingRef = useRef<Onboarding>(null);

    const handleSkip = () => handleOnboardingEnd();

    const handleOnboardingNavigation = () => {
        if (index < 2) {
            onboardingRef.current?.goNext();
        }
        else { handleOnboardingEnd(); }
    }

    const handleOnboardingEnd = async () => {
        await writeStorage('onboarding', 'done');
        router.replace(Routes.auth);
        /** TODO: Remove OnBoarding in Next Open */
    }
    //#region UI
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: colors.primary }]}>
                <StatusBar />
                <View style={[styles.head, { backgroundColor: colors.background }]}>
                    <Button type='text' align='flex-end' label="Skip" onPress={handleSkip} txtStyle={styles.skip} />
                    <Onboarding
                        showPagination
                        showSkip={false}
                        showNext={false}
                        showDone={false}
                        ref={onboardingRef}
                        controlStatusBar={false}
                        bottomBarHighlight={false}
                        containerStyles={styles.onboarding}
                        pageIndexCallback={(pageIndex) => setIndex(pageIndex)}
                        DotComponent={({ selected }) => <Dot selected={selected} />}
                        pages={[1, 2, 3].map((idx) => ({
                            title: '', subtitle: '', backgroundColor: 'transparent',
                            image: (<Image key={index} style={styles.img} source={onboardingImages[idx]} />),
                        }))}
                    />
                </View>
                <View style={styles.bottom}>
                    <Text type='body' color='white' align='justify' title={content[index]} />
                    <Button type='variant' label={index !== 2 ? "Next" : "Get Started"} onPress={handleOnboardingNavigation} />
                </View>
            </View>
        </SafeAreaView>
    );
    //#endregion
}
export default memo(OnboardingScreen);

//#region Styles
const styles = StyleSheet.create({
    container: { flex: 1, },
    head: {
        flex: 5,
        overflow: 'hidden',
        borderBottomRightRadius: 190,
    },
    bottom: {
        flex: 2.5,
        padding: 20,
        paddingVertical: 38,
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    onboarding: {
        width: '100%',
        height: '100%',
        padding: 20,
        justifyContent: 'space-around',
    },
    img: {
        width: '100%',
        height: '55%',
        alignSelf: 'center',
    },
    skip: {
        fontSize: 20,
        marginHorizontal: 15,
        alignSelf: 'flex-end',
    }
});
//#endregion
