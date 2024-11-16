import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  PanResponder,
  PanResponderGestureState
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@hooks/useThemeColor';
import Text from '@blocks/Text';

interface Point {
  x: number;
  y: number;
}

interface ScreenShareProps {
  screenStreamURL?: string;
  isSharing: boolean;
  onStartShare: () => void;
  onStopShare: () => void;
  canAnnotate?: boolean;
}

const ScreenShare: React.FC<ScreenShareProps> = ({
  screenStreamURL,
  isSharing,
  onStartShare,
  onStopShare,
  canAnnotate = true,
}) => {
  const color = useThemeColor();
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotations, setAnnotations] = useState<Point[]>([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => isAnnotating,
    onMoveShouldSetPanResponder: () => isAnnotating,
    onPanResponderGrant: (evt) => {
      if (isAnnotating) {
        const { locationX, locationY } = evt.nativeEvent;
        setAnnotations(prev => [...prev, { x: locationX, y: locationY }]);
      }
    },
    onPanResponderMove: (evt) => {
      if (isAnnotating) {
        const { locationX, locationY } = evt.nativeEvent;
        setAnnotations(prev => [...prev, { x: locationX, y: locationY }]);
      }
    },
    onPanResponderRelease: () => {},
  });

  const clearAnnotations = () => {
    setAnnotations([]);
  };

  const toggleAnnotation = () => {
    setIsAnnotating(!isAnnotating);
    if (isAnnotating) {
      clearAnnotations();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer} {...panResponder.panHandlers}>
        {screenStreamURL ? (
          <RTCView
            streamURL={screenStreamURL}
            style={styles.screenShare}
            objectFit="contain"
          />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: color.card }]}>
            <Text type="body" title="No screen being shared" />
          </View>
        )}

        {isSharing && canAnnotate && annotations.map((point, index) => (
          <View
            key={index}
            style={[
              styles.annotationDot,
              {
                left: point.x - 2,
                top: point.y - 2,
                backgroundColor: color.primary,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.controls}>
        {!isSharing ? (
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: color.primary }]}
            onPress={onStartShare}
          >
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: color.primary }]}
              onPress={onStopShare}
            >
              <Ionicons name="stop-circle-outline" size={24} color="white" />
            </TouchableOpacity>

            {canAnnotate && (
              <>
                <TouchableOpacity
                  style={[
                    styles.controlButton,
                    { 
                      backgroundColor: isAnnotating ? color.primary : color.card 
                    }
                  ]}
                  onPress={toggleAnnotation}
                >
                  <Ionicons 
                    name="pencil" 
                    size={24} 
                    color={isAnnotating ? 'white' : color.text} 
                  />
                </TouchableOpacity>

                {isAnnotating && (
                  <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: color.card }]}
                    onPress={clearAnnotations}
                  >
                    <Ionicons name="trash-outline" size={24} color={color.text} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  screenContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  screenShare: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    zIndex: 2,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  annotationDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    zIndex: 1,
  },
});

export default ScreenShare;
