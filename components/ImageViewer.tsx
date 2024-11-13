import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import ImageViewer from "react-native-image-zoom-viewer";
const ImageViewerFunc = ({
  images,
  showImageViewer,
  setShowImageViewer,
  selectedImageIndex,
}: any) => { 


  const closeImageViewer = () => {
    setShowImageViewer(false);
  };

  return (
    <View>
      <Modal visible={showImageViewer} transparent={true}>
        <ImageViewer
          imageUrls={images}
          index={selectedImageIndex}
          enableSwipeDown
          onSwipeDown={closeImageViewer}
        />
      </Modal>
    </View>
  );
};

export default ImageViewerFunc;
