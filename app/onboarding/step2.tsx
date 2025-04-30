import { useState } from 'react';
import { Link, Stack } from 'expo-router';
import { YStack, XStack, ScrollView, Form } from 'tamagui';

import { OnboardingSlide } from '~/components/OnboardingSlide';
import { Button } from '~/components/Button';
import { GreenButton } from '~/tamagui.config';
import { FormInput } from '~/components/FormInput';

export default function PersonalInformation() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!dob.trim()) newErrors.dob = 'Date of birth is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Form is valid, continue to next step
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView flex={1} bg="$white">
        <OnboardingSlide
          showLogo={true}
          title="Tell us about yourself"
          subtitle="Let's get to know you better">
          <YStack gap="$4" w="100%" pt="$4">
            <Form>
              <XStack gap="$4" flexWrap="wrap">
                <YStack flex={1} minWidth={120}>
                  <FormInput
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    error={errors.firstName}
                    placeholder="Your first name"
                  />
                </YStack>
                <YStack flex={1} minWidth={120}>
                  <FormInput
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    error={errors.lastName}
                    placeholder="Your last name"
                  />
                </YStack>
              </XStack>

              <FormInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                placeholder="your.email@example.com"
                keyboardType="email-address"
              />

              <FormInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                error={errors.phone}
                placeholder="(555) 555-5555"
                keyboardType="phone-pad"
              />

              <FormInput
                label="Date of Birth"
                value={dob}
                onChangeText={setDob}
                error={errors.dob}
                placeholder="MM/DD/YYYY"
              />

              <XStack gap="$4" mt="$6" jc="space-between">
                <Link href="/" asChild>
                  <Button title="Back" />
                </Link>
                <Link href="/onboarding/step3" asChild onPress={handleNext}>
                  <Button title="Continue" />
                </Link>
              </XStack>
            </Form>
          </YStack>
        </OnboardingSlide>
      </ScrollView>
    </>
  );
}
