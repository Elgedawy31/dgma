import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface Profile {
  id: number | string;
  name: string;
  avatar: string;
}

interface ProfileStackProps {
  profiles: Profile[];
  maxDisplay?: number;
}

const ProfileStack: React.FC<ProfileStackProps> = ({ 
  profiles = [], 
  maxDisplay = 3 
}) => {
  const displayProfiles = profiles.slice(0, maxDisplay);
  const remaining = Math.max(0, profiles.length - maxDisplay);

  return (
    <View style={styles.container}>
      <View style={styles.profilesWrapper}>
        {displayProfiles.map((profile, index) => (
          <View
            key={profile.id}
            style={[
              styles.profileItem,
              { 
                marginLeft: index === 0 ? 0 : -12,
                zIndex: displayProfiles.length - index 
              }
            ]}
          >
            <Image
              source={{ uri: profile.avatar }}
              style={styles.profileImage}
            />
          </View>
        ))}
      </View>
      {remaining > 0 && (
        <Text
          style={[
            styles.remaining,
          ]}
        >
          +{remaining}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilesWrapper: {
    flexDirection: 'row',
  },
  profileItem: {
    position: 'relative',
    borderRadius: 16, // half of width/height for circle
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16, // half of width/height for circle
  },
  remaining: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default ProfileStack;