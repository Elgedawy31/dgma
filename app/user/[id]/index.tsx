import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions, Pressable, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AppBar from "@blocks/AppBar";
import Text from "@blocks/Text";
import Icon from "@blocks/Icon";
import { useThemeColor } from "@hooks/useThemeColor";
import ImageAvatar from "@blocks/ImageAvatar";
import IconModel from '@model/icon';
import ImageViewerFunc from '@components/ImageViewer';

interface UserParams {
    id: string;
    logo: string;
    name: string;
    attachments: Array<{
        id: string;
        type: 'photo' | 'document';
        url: string;
        name: string;
    }>;
}

type TabType = 'photos' | 'documents' | 'links';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PHOTO_SIZE = (SCREEN_WIDTH - 48) / 3; // 3 photos per row with 16px padding and 8px gap

const UserProfile = () => {
    const colors = useThemeColor();
    const params = useLocalSearchParams();
    const { logo, name, attachments } = JSON.parse(params.user as string) as UserParams;
    const [selectedTab, setSelectedTab] = useState<TabType>('photos');
    const [showImageViewer, setShowImageViewer] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const photos = attachments.filter(attachment => attachment.type === 'photo');
    const documents = attachments.filter(attachment => attachment.type === 'document');
    
    // Transform photos for ImageViewer
    const imageUrls = photos.map(photo => ({ url: photo.url }));

    const handleDocumentPress = async (url: string) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                console.log("Can't open URL:", url);
            }
        } catch (error) {
            console.error("Error opening URL:", error);
        }
    };

    const handlePhotoPress = (index: number) => {
        setSelectedImageIndex(index);
        setShowImageViewer(true);
    };

    const renderTabButton = (tab: TabType, label: string, icon: IconModel) => (
        <Pressable
            style={[
                styles.tabButton,
                { backgroundColor: selectedTab === tab ? colors.primary : 'transparent' }
            ]}
            onPress={() => setSelectedTab(tab)}
        >
            <Icon 
                icon={icon} 
                iconColor={selectedTab === tab ? colors.white : colors.text} 
                size={18}
            />
            <Text 
                type="body" 
                title={label} 
                color={selectedTab === tab ? colors.white : colors.text}
            />
        </Pressable>
    );

    const renderContent = () => {
        if (selectedTab === 'photos') {
            return photos.length > 0 ? (
                <>
                    <FlatList
                        data={photos}
                        keyExtractor={(item) => item.id}
                        numColumns={3}
                        contentContainerStyle={styles.photoGrid}
                        renderItem={({ item, index }) => (
                            <View style={styles.photoContainer}>
                                <Pressable 
                                    style={styles.photoWrapper}
                                    onPress={() => handlePhotoPress(index)}
                                >
                                    <Image
                                        source={{ uri: item.url }}
                                        style={styles.photo}
                                        resizeMode="cover"
                                    />
                                </Pressable>
                                <Pressable 
                                    style={styles.photoDownloadButton}
                                    onPress={() => handleDocumentPress(item.url)}
                                >
                                    <View style={[styles.downloadIconWrapper, { backgroundColor: colors.card }]}>
                                        <Icon icon="download" iconColor={colors.text} size={18} />
                                    </View>
                                </Pressable>
                            </View>
                        )}
                    />
                    <ImageViewerFunc
                        images={imageUrls}
                        showImageViewer={showImageViewer}
                        setShowImageViewer={setShowImageViewer}
                        selectedImageIndex={selectedImageIndex}
                    />
                </>
            ) : (
                <View style={styles.emptyState}>
                    <Text type="body" title="No photos found" color={colors.text} />
                </View>
            );
        }

        if (selectedTab === 'documents') {
            return documents.length > 0 ? (
                <FlatList
                    data={documents}
                    numColumns={3}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.documentList}
                    renderItem={({ item }) => (
                        <Pressable
                            style={[styles.documentItem, { backgroundColor: colors.card }]}
                            onPress={() => handleDocumentPress(item.url)}
                        >
                            <View style={styles.pdfContainer}>
                                <Icon icon="document" iconColor={colors.primary} size={34} />
                                <Text 
                                    type="body" 
                                    title={item?.name?.slice(0 , 25)} 
                                    color={colors.text} 
                                    style={styles.documentName}
                                    numberOfLines={1}
                                />
                            </View>
                            <View style={styles.downloadContainer}>
                                <Icon icon="download" iconColor={colors.text} size={18} />
                            </View>
                        </Pressable>
                    )}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text type="body" title="No documents found" color={colors.text} />
                </View>
            );
        }

        return (
            <View style={styles.emptyState}>
                <Text type="body" title="No links found" color={colors.text} />
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AppBar leading="back" />
            
            <View style={styles.header}>
                <ImageAvatar type="avatar" url={logo} size={100} />
                <Text type="title" title={name} style={styles.name} />
            </View>

            <View style={styles.tabs}>
                {renderTabButton('photos', 'Photos', 'image')}
                {renderTabButton('documents', 'Document', 'document')}
            </View>

            <View style={styles.content}>
                {renderContent()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 12,
    },
    name: {
        marginTop: 8,
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    photoGrid: {
        gap: 12,
    },
    photoContainer: {
        width: PHOTO_SIZE,
        height: PHOTO_SIZE,
        marginRight: 8,
        marginBottom: 8,
        position: 'relative',
    },
    photoWrapper: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        overflow: 'hidden',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoDownloadButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        zIndex: 1,
    },
    downloadIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    documentList: {
        gap: 12,
    },
    documentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 8,
        width: '100%',
        height: 72,
    },
    pdfContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    documentName: {
        flex: 1,
    },
    downloadContainer: {
        padding: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UserProfile;
