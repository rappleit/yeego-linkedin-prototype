// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

// Define a more flexible type for our custom mappings
type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>['name']>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
export const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'person.fill': 'person',
  'gear': 'settings',
  'magnifyingglass': 'search',
  'heart.fill': 'favorite',
  'star.fill': 'star',
  'bookmark.fill': 'bookmark',
  'bell.fill': 'notifications',
  'envelope.fill': 'email',
  'phone.fill': 'phone',
  'camera.fill': 'camera-alt',
  'photo.fill': 'photo',
  'video.fill': 'videocam',
  'mic.fill': 'mic',
  'location.fill': 'location-on',
  'calendar': 'calendar-today',
  'clock.fill': 'schedule',
  'checkmark.circle.fill': 'check-circle',
  'xmark.circle.fill': 'cancel',
  'plus.circle.fill': 'add-circle',
  'minus.circle.fill': 'remove-circle',
  'arrow.up': 'keyboard-arrow-up',
  'arrow.down': 'keyboard-arrow-down',
  'arrow.left': 'keyboard-arrow-left',
  'arrow.right': 'keyboard-arrow-right',
  'share': 'share',
  'link': 'link',
  'link.badge.plus': 'link',
  'link.badge.minus': 'link-off',
  'external.link': 'open-in-new',
  'link.icloud': 'cloud-sync',
  'download': 'download',
  'upload': 'upload',
  'trash.fill': 'delete',
  'pencil': 'edit',
  'square.and.pencil': 'edit',
  'folder.fill': 'folder',
  'doc.fill': 'description',
  'list.bullet': 'list',
  'grid': 'grid-view',
  'slider.horizontal.3': 'tune',
  'info.circle.fill': 'info',
  'questionmark.circle.fill': 'help',
  'exclamationmark.triangle.fill': 'warning',
  'rectangle.portrait.and.arrow.right': 'logout',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
