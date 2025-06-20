import React from 'react';
import { Image, ImageStyle, View, ViewStyle } from 'react-native';

export type ProfilePictureProps = {
  source: string | { uri: string };
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

export function ProfilePicture({
  source,
  size = 40,
  borderWidth = 2,
  borderColor = '#FFFFFF',
  style,
  imageStyle,
}: ProfilePictureProps) {
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
    borderColor,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  };

  const imageContainerStyle: ImageStyle = {
    width: size - (borderWidth * 2),
    height: size - (borderWidth * 2),
    borderRadius: (size - (borderWidth * 2)) / 2,
  };

  return (
    <View style={[containerStyle, style]}>
      <Image
        source={typeof source === 'string' ? { uri: source } : source}
        style={[imageContainerStyle, imageStyle]}
        resizeMode="cover"
      />
    </View>
  );
} 