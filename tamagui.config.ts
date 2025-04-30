import { createAnimations } from '@tamagui/animations-react-native';
import { createInterFont } from '@tamagui/font-inter';
import { createMedia } from '@tamagui/react-native-media-driver';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import {
  createTamagui,
  styled,
  SizableText,
  H1,
  H2,
  YStack,
  Button as ButtonTamagui,
} from 'tamagui';

// FlexpaHealth Colors based on the screenshot
const colors = {
  flexpaBlue: '#00a3ae', // The teal/blue color from Flexpa logo
  flexpaGreen: '#88d16c', // The green accent color
  flexpaLightGreen: '#e8f6e5', // Light green for backgrounds
  flexpaBlack: '#333333', // Dark text color
  flexpaGray: '#666666', // Secondary text color
  white: '#FFFFFF',
};

const animations = createAnimations({
  bouncy: {
    damping: 10,
    mass: 0.9,
    stiffness: 100,
    type: 'spring',
  },
  lazy: {
    damping: 20,
    type: 'spring',
    stiffness: 60,
  },
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
    type: 'spring',
  },
});

const headingFont = createInterFont();
const bodyFont = createInterFont();

export const Container = styled(YStack, {
  flex: 1,
  padding: 24,
  backgroundColor: colors.white,
});

export const Main = styled(YStack, {
  flex: 1,
  justifyContent: 'space-between',
  maxWidth: 960,
});

export const Title = styled(H1, {
  color: colors.flexpaBlack,
  size: '$7',
  fontWeight: 'bold',
});

export const Subtitle = styled(SizableText, {
  color: colors.flexpaGray,
  size: '$4',
});

export const SectionTitle = styled(H2, {
  color: colors.flexpaBlack,
  size: '$5',
  fontWeight: '600',
});

export const Button = styled(ButtonTamagui, {
  backgroundColor: colors.flexpaBlue,
  borderRadius: 28,
  hoverStyle: {
    backgroundColor: '#008f99', // Darker teal for hover
  },
  pressStyle: {
    backgroundColor: '#008f99', // Darker teal for press
  },
  maxWidth: 500,

  // Shadows
  shadowColor: '#000',
  shadowOffset: {
    height: 2,
    width: 0,
  },
  shadowOpacity: 0.15,
  shadowRadius: 3.84,

  // Button text
  color: colors.white,
  fontWeight: '600',
  fontSize: 16,
});

export const GreenButton = styled(ButtonTamagui, {
  backgroundColor: colors.flexpaGreen,
  borderRadius: 28,
  hoverStyle: {
    backgroundColor: '#75c257', // Darker green for hover
  },
  pressStyle: {
    backgroundColor: '#75c257', // Darker green for press
  },
  maxWidth: 500,

  // Shadows
  shadowColor: '#000',
  shadowOffset: {
    height: 2,
    width: 0,
  },
  shadowOpacity: 0.15,
  shadowRadius: 3.84,

  // Button text
  color: colors.white,
  fontWeight: '600',
  fontSize: 16,
});

const config = createTamagui({
  light: {
    color: {
      background: colors.white,
      text: colors.flexpaBlack,
    },
  },
  defaultFont: 'body',
  animations,
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    body: bodyFont,
    heading: headingFont,
  },
  themes,
  tokens: {
    ...tokens,
    color: {
      ...tokens.color,
      flexpaBlue: colors.flexpaBlue,
      flexpaGreen: colors.flexpaGreen,
      flexpaLightGreen: colors.flexpaLightGreen,
      flexpaBlack: colors.flexpaBlack,
      flexpaGray: colors.flexpaGray,
    },
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});

type AppConfig = typeof config;

// Enable auto-completion of props shorthand (ex: jc="center") for Tamagui templates.
// Docs: https://tamagui.dev/docs/core/configuration

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
