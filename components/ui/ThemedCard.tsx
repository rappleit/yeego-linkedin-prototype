import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedCardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  backgroundColor?: keyof typeof import('@/constants/Colors').Colors.light;
  padding?: number | 'small' | 'medium' | 'large';
  borderRadius?: number;
  elevation?: number;
  shadowColor?: string;
};

export function ThemedCard({ 
  style, 
  lightColor, 
  darkColor, 
  backgroundColor,
  padding = 'medium',
  borderRadius = 12,
  elevation = 2,
  shadowColor,
  children,
  ...otherProps 
}: ThemedCardProps) {
  const cardBackgroundColor = backgroundColor 
    ? useThemeColor({}, backgroundColor)
    : useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    
  const defaultShadowColor = useThemeColor({}, 'text');

  const getPaddingValue = () => {
    switch (padding) {
      case 'small': return 12;
      case 'medium': return 16;
      case 'large': return 20;
      default: return typeof padding === 'number' ? padding : 16;
    }
  };

  const cardStyle = {
    backgroundColor: cardBackgroundColor,
    borderRadius,
    padding: getPaddingValue(),
    shadowColor: shadowColor || defaultShadowColor,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: 0.1,
    shadowRadius: elevation * 2,
    elevation,
  };

  return (
    <View style={[cardStyle, style]} {...otherProps}>
      {children}
    </View>
  );
}
