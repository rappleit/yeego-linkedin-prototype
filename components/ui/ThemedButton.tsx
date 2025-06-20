import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { IconSymbol, IconSymbolName } from './IconSymbol';

export type ThemedButtonVariant = 'filled' | 'outline' | 'ghost';
export type ThemedButtonSize = 'small' | 'medium' | 'large';

export type ThemedButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ThemedButtonVariant;
  size?: ThemedButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconSymbolName;
  iconPosition?: 'left' | 'right';
  customBackgroundColor?: string;
  customTextColor?: string;
  customBorderColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function ThemedButton({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  customBackgroundColor,
  customTextColor,
  customBorderColor,
  style,
  textStyle,
}: ThemedButtonProps) {
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const getSizeStyles = (): { padding: number; fontSize: number; iconSize: number } => {
    switch (size) {
      case 'small':
        return { padding: 8, fontSize: 14, iconSize: 16 };
      case 'large':
        return { padding: 16, fontSize: 18, iconSize: 20 };
      default:
        return { padding: 12, fontSize: 16, iconSize: 18 };
    }
  };

  const { padding, fontSize, iconSize } = getSizeStyles();

  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingHorizontal: padding * 1.5,
      paddingVertical: padding,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: size === 'small' ? 36 : size === 'large' ? 52 : 44,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: customBackgroundColor || tintColor,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: customBorderColor || tintColor,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize,
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          color: customTextColor || '#FFFFFF',
        };
      case 'outline':
        return {
          ...baseStyle,
          color: customTextColor || tintColor,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: customTextColor || tintColor,
        };
      default:
        return {
          ...baseStyle,
          color: customTextColor || textColor,
        };
    }
  };

  const buttonStyle = getButtonStyles();
  const textStyleObj = getTextStyles();

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {icon && iconPosition === 'left' && (
        <IconSymbol
          name={icon}
          size={iconSize}
          color={String(textStyleObj.color || textColor)}
          style={styles.leftIcon}
        />
      )}
      
      <Text style={[textStyleObj, textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
      
      {icon && iconPosition === 'right' && (
        <IconSymbol
          name={icon}
          size={iconSize}
          color={String(textStyleObj.color || textColor)}
          style={styles.rightIcon}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
}); 