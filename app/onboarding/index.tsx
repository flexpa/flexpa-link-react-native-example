import { Link, Stack } from 'expo-router';
import { YStack, Text, XStack } from 'tamagui';

import { OnboardingSlide } from '~/components/OnboardingSlide';
import { Button } from '~/components/Button';

export default function OnboardingWelcome() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingSlide
        showLogo={true}
        title="Welcome to FlexpaHealth"
        subtitle="Your modern health insurance experience starts here"
        imageSource="https://source.unsplash.com/featured/960x640?health,insurance,digital">
        <YStack gap="$6" w="100%" ai="center" mt="$4">
          <Text textAlign="center" fontSize="$3" color="$flexpaGray">
            With FlexpaHealth, you get instant access to your health records, simple claims
            management, and personalized care - all in one place.
          </Text>

          <XStack gap="$4" jc="center" flexWrap="wrap">
            <Link href={'/onboarding/step2' as any} asChild>
              <Button title="Get Started" />
            </Link>
          </XStack>
        </YStack>
      </OnboardingSlide>
    </>
  );
}
