import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import Text from '@blocks/Text';
import { useThemeColor } from '@hooks/useThemeColor';

interface Participant {
  attendeeId: string;
  externalUserId: string;
  name: string;
  streamURL?: string;
}

interface ParticipantGridProps {
  participants: Participant[];
  localStreamURL?: string;
  localParticipantName: string;
  isLocalVideoEnabled: boolean;
  screenWidth?: number;
}

const ParticipantGrid: React.FC<ParticipantGridProps> = ({
  participants,
  localStreamURL,
  localParticipantName,
  isLocalVideoEnabled,
  screenWidth = Dimensions.get('window').width,
}) => {
  const color = useThemeColor();
  const [gridLayout, setGridLayout] = useState('grid'); // 'grid' | 'spotlight'

  const calculateGridDimensions = () => {
    const totalParticipants = participants.length + 1; // +1 for local participant
    if (totalParticipants <= 4) {
      return { columns: 2, rows: 2 };
    } else if (totalParticipants <= 9) {
      return { columns: 3, rows: 3 };
    } else {
      return { columns: 4, rows: Math.ceil(totalParticipants / 4) };
    }
  };

  const { columns, rows } = calculateGridDimensions();
  const itemWidth = (screenWidth - 20) / columns;
  const itemHeight = itemWidth * (3/4);

  const renderParticipant = (participant: Participant | null, index: number) => {
    const isLocal = !participant;
    const streamURL = isLocal ? localStreamURL : participant?.streamURL;
    const name = isLocal ? localParticipantName : participant?.name;

    return (
      <View 
        key={isLocal ? 'local' : participant?.attendeeId}
        style={[
          styles.participantContainer,
          {
            width: itemWidth - 10,
            height: itemHeight - 10,
            backgroundColor: color.card,
          }
        ]}
      >
        {streamURL && (isLocal ? isLocalVideoEnabled : true) ? (
          <RTCView
            streamURL={streamURL}
            style={styles.videoStream}
            objectFit="cover"
          />
        ) : (
          <View style={[styles.noVideo, { backgroundColor: color.primary }]}>
            <View style={styles.initialsContainer}>
              <Text 
                type="title" 
                title={name?.charAt(0).toUpperCase() || '?'} 
              />
            </View>
          </View>
        )}
        <View style={styles.nameContainer}>
          <Text 
            type="small" 
            title={name || 'Unknown'} 
          />
        </View>
      </View>
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.gridContainer}
    >
      {/* Local participant */}
      {renderParticipant(null, -1)}

      {/* Remote participants */}
      {participants.map((participant, index) => 
        renderParticipant(participant, index)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  participantContainer: {
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  videoStream: {
    flex: 1,
    borderRadius: 8,
  },
  noVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  initialsContainer: {
    transform: [{ scale: 2 }],
  },
  nameContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});

export default ParticipantGrid;
