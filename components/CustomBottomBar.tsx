import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { COLORS } from '../theme/colors';

interface TabItem {
  name: string;
  icon: string;
  label: string;
  route: string;
}

interface CustomBottomBarProps {
  activeRoute: string;
  onPress: (route: string) => void;
  tabs: TabItem[];
}

export const CustomBottomBar = ({ activeRoute, onPress, tabs }: CustomBottomBarProps) => {
  const { themeType } = useTheme();
  const isDark = themeType === 'dark';
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / tabs.length;

  const sliderAnimations = useRef(tabs.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.route === activeRoute);
    tabs.forEach((_, index) => {
      Animated.timing(sliderAnimations[index], {
        toValue: index === activeIndex ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
  }, [activeRoute]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(10, 20, 24, 0.98)' : '#ffffff',
          borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : '#e8ecf1',
        },
      ]}
    >
      <View style={styles.barWrapper}>
        {tabs.map((tab, index) => {
          const animValue = sliderAnimations[index];
          const isActive = activeRoute === tab.route;

          const backgroundColor = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', isDark ? 'rgba(142, 197, 255, 0.15)' : 'rgba(142, 197, 255, 0.1)'],
          });

          const scale = animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
          });

          const iconColor = isActive ? COLORS.dark.primary : isDark ? '#7a8892' : '#999';

          return (
            <TouchableOpacity
              key={tab.route}
              onPress={() => onPress(tab.route)}
              activeOpacity={0.8}
              style={[styles.tabButton, { width: tabWidth }]}
            >
              <Animated.View
                style={[
                  styles.tabContent,
                  {
                    backgroundColor,
                    transform: [{ scale }],
                  },
                ]}
              >
                <Animated.View style={[{ transform: [{ scale }] }]}>
                  <MaterialCommunityIcons
                    name={tab.icon}
                    size={26}
                    color={iconColor}
                  />
                </Animated.View>
                <Animated.Text
                  style={[
                    styles.tabLabel,
                    {
                      color: iconColor,
                      fontSize: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 11],
                      }),
                      fontWeight: isActive ? '800' : '600',
                      marginTop: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [4, 6],
                      }),
                    },
                  ]}
                >
                  {tab.label}
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  barWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
  tabLabel: {
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
