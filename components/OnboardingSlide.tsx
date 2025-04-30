import { ReactNode } from 'react';
import { YStack, Image, ScrollView, XStack, Text, View } from 'tamagui';

import { Title, Subtitle } from '../tamagui.config';

export type OnboardingSlideProps = {
  title: string;
  subtitle?: string;
  imageSource?: string;
  showLogo?: boolean;
  children?: ReactNode;
};

// Inline logo component instead of using PNG file
const FlexpaHealthLogo = () => (
  <XStack ai="center" gap="$2">
    <View width={40} height={40} flexDirection="row">
      <View width={20} height={20} backgroundColor="#00a3ae" top={0} left={0} />
      <View width={20} height={20} backgroundColor="#88d16c" top={10} left={5} />
    </View>
    <XStack>
      <Text color="#00a3ae" fontSize={24} fontWeight="bold">
        Flexpa
      </Text>
      <Text color="#88d16c" fontSize={24} fontWeight="bold">
        Health
      </Text>
    </XStack>
  </XStack>
);

export const OnboardingSlide = ({
  title,
  subtitle,
  imageSource,
  showLogo = false,
  children,
}: OnboardingSlideProps) => {
  return (
    <ScrollView f={1} contentContainerStyle={{ flexGrow: 1 }} bg="$white">
      <YStack f={1} jc="center" ai="center" p="$4" gap="$4" bg="$white">
        {showLogo && (
          <XStack mt="$6" mb="$2">
            <FlexpaHealthLogo />
          </XStack>
        )}

        {imageSource ? (
          <Image
            source={{ uri: imageSource }}
            width={240}
            height={180}
            alt="Onboarding image"
            resizeMode="contain"
            mt="$6"
          />
        ) : null}

        <YStack ai="center" w="100%" maxWidth={500} px="$2" gap="$2">
          <Title ta="center">{title}</Title>
          {subtitle && <Subtitle ta="center">{subtitle}</Subtitle>}
        </YStack>

        <YStack w="100%" maxWidth={500} mt="$4">
          {children}
        </YStack>
      </YStack>
    </ScrollView>
  );
};
