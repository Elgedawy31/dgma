import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Make avatar optional
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

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const renderAvatar = (profile: Profile, index: number) => {
    return (
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
        {profile.avatar ? (
          <Image
            source={{ uri: profile.avatar }}
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, styles.initialContainer]}>
            <Text style={styles.initialText}>
              {getInitial(profile.name)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilesWrapper}>
        {displayProfiles.map((profile, index) => renderAvatar(profile, index))}
      </View>
      {remaining > 0 && (
        <Text style={styles.remaining}>
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
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  initialContainer: {
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  remaining: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyAvatar: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});

export default ProfileStack;