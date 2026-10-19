/**
 * Conteneur d'écran standard avec SafeAreaView et fond crème
 * Applique le thème et la couleur de fond officielle
 */

import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../constants/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  noPadding = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: noPadding ? 0 : theme.spacing.screenHorizontal,
          paddingRight: noPadding ? 0 : theme.spacing.screenHorizontal,
        },
        style,
      ]}
    >
      <StatusBar style="dark" />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
