import { Stack, Link } from 'expo-router';
import { YStack, XStack, Text, View } from 'tamagui';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

// Inline logo component
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

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'FlexpaHealth' }} />
      <Container>
        <YStack f={1} jc="center" ai="center" gap="$6">
          <XStack>
            <FlexpaHealthLogo />
          </XStack>

          <YStack ai="center" gap="$2" maw={500} px="$4">
            <Text fontSize="$7" fontWeight="bold" color="$flexpaBlack" textAlign="center">
              Modern Health Insurance
            </Text>
            <Text fontSize="$4" color="$flexpaGray" textAlign="center">
              Access your complete health records, manage claims, and connect with care providers
              all in one place.
            </Text>
          </YStack>

          <YStack ai="center" gap="$4" mt="$4">
            <Link href={'/onboarding' as any} asChild>
              <Button title="Start Onboarding" />
            </Link>
          </YStack>
        </YStack>
      </Container>
    </>
  );
}
