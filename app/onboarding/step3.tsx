import { Link, Stack } from 'expo-router';
import { YStack, Text, Card, XStack } from 'tamagui';

import { OnboardingSlide } from '~/components/OnboardingSlide';
import { Button } from '~/components/Button';

export default function OnboardingCompletion() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingSlide
        showLogo={true}
        title="You're all set!"
        subtitle="Welcome to FlexpaHealth"
        imageSource="https://source.unsplash.com/featured/960x640?health,digital,success">
        <YStack gap="$6" w="100%" ai="center" mt="$4">
          <Card p="$4" borderRadius="$4" bg="$flexpaLightGreen">
            <Text textAlign="center" color="$flexpaBlack" fontSize="$3">
              This is a placeholder for the final onboarding screen. In a real implementation, this
              would show account setup confirmation, plan details, or next steps for the user.
            </Text>
          </Card>

          <XStack gap="$4" jc="center">
            <Link href="/onboarding/step2" asChild>
              <Button title="Back" />
            </Link>
            <Link href="/" asChild>
              <Button title="Finish Setup" />
            </Link>
          </XStack>
        </YStack>
      </OnboardingSlide>
    </>
  );
}
