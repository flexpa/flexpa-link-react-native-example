import { Link, Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Text, YStack, Card, XStack } from 'tamagui';

import { Button } from '~/components/Button';
import { OnboardingSlide } from '~/components/OnboardingSlide';

export default function OnboardingChoice() {
  const [openLink, setOpenLink] = useState(false);
  const [publicToken, setPublicToken] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [webViewSource, setWebViewSource] = useState<{ html: string } | null>(null);
  const [webViewKey, setWebViewKey] = useState(0);

  const generateFlexpaLinkHtml = (_experimentalResumeContext?: any) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
          <title>Flexpa Link Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { height: 100%; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          <script src="https://js.flexpa.com/v1/"></script>
          <script>
            FlexpaLink.create({
                publishableKey: '${process.env.EXPO_PUBLIC_FLEXPA_PUBLISHABLE_KEY}',
                user: {
                    externalId: 'usr_1234'
                },
                onSuccess: (publicToken) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      action: 'continue',
                      data: { publicToken }
                    }));
                },
                onExit: (error) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      action: 'continue', 
                      data: { error }
                    }));
                },
                usage: 'MULTIPLE',
                ${_experimentalResumeContext ? `_experimentalResumeContext: ${JSON.stringify(_experimentalResumeContext)}` : ''}
            });

            // Auto-open FlexpaLink
            setTimeout(() => {
              FlexpaLink.open();
            }, 100);
          </script>
        </body>
      </html>
   `;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // Check if this is a navigation message from FlexpaLink callbacks
      if (data.action === 'continue') {
        if (data.data.publicToken) {
          setPublicToken(data.data.publicToken);
        }
        if (data.data.error) {
          setError(data.data.error);
        }

        setOpenLink(false);
        return;
      }

      const resumeHtml = generateFlexpaLinkHtml(data);
      setWebViewSource({ html: resumeHtml });
      setWebViewKey((prev) => prev + 1);
      return;
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  React.useEffect(() => {
    if (openLink) {
      const initialHtml = generateFlexpaLinkHtml();
      setWebViewSource({ html: initialHtml });
    }
  }, [openLink]);

  if (error) {
    // Format error for display
    const displayError =
      typeof error === 'string'
        ? error
        : typeof error === 'object'
          ? JSON.stringify(error)
          : 'Connection failed';

    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <OnboardingSlide
          showLogo
          title="Connection Failed"
          subtitle="Unable to connect to your health insurance provider">
          <YStack gap="$4" w="100%" ai="center" mt="$2">
            <Card p="$4" borderRadius="$4" bg="$red1">
              <YStack gap="$2">
                <Text textAlign="center" color="$red11" fontSize="$4" fontWeight="bold">
                  ❌ Connection Failed
                </Text>
                <Text textAlign="center" color="$red11" fontSize="$3">
                  We were unable to connect to your health insurance provider. Please try again.
                </Text>
              </YStack>
            </Card>

            <Card p="$3" borderRadius="$4" bg="$white" borderWidth={1} borderColor="$red6">
              <YStack gap="$2">
                <Text color="$flexpaGray" fontSize="$2">
                  Error Details:
                </Text>
                <Text color="$red11" fontSize="$2" fontWeight="500">
                  {displayError}
                </Text>
              </YStack>
            </Card>

            <XStack gap="$4" jc="center" mt="$4">
              <Button
                title="Try Again"
                onPress={() => {
                  setError(null);
                  setOpenLink(true);
                }}
              />
              <Link href="/" asChild>
                <Button title="Skip for now" />
              </Link>
            </XStack>
          </YStack>
        </OnboardingSlide>
      </>
    );
  }

  if (publicToken) {
    // Format token for display
    const displayToken =
      typeof publicToken === 'string'
        ? publicToken.substring(0, 16) + '...'
        : typeof publicToken === 'object'
          ? JSON.stringify(publicToken).substring(0, 16) + '...'
          : 'Token received';

    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <OnboardingSlide
          showLogo
          title="Connection Successful!"
          subtitle="Your health data is now connected">
          <YStack gap="$4" w="100%" ai="center" mt="$2">
            <Card p="$4" borderRadius="$4" bg="$flexpaLightGreen">
              <YStack gap="$2">
                <Text textAlign="center" color="$flexpaBlack" fontSize="$4" fontWeight="bold">
                  🎉 Connection Complete
                </Text>
                <Text textAlign="center" color="$flexpaBlack" fontSize="$3">
                  Your health insurance account is now securely connected to FlexpaHealth.
                </Text>
              </YStack>
            </Card>

            <Card p="$3" borderRadius="$4" bg="$white" borderWidth={1} borderColor="$flexpaGray">
              <YStack gap="$2">
                <Text color="$flexpaGray" fontSize="$2">
                  Public Token:
                </Text>
                <Text color="$flexpaBlack" fontSize="$2" fontWeight="500">
                  {displayToken}
                </Text>
              </YStack>
            </Card>

            <XStack gap="$4" jc="center" mt="$4">
              <Link href="/" asChild>
                <Button title="Continue to App" />
              </Link>
            </XStack>
          </YStack>
        </OnboardingSlide>
      </>
    );
  }

  return (
    <>
      {openLink ? (
        <View style={styles.container}>
          {webViewSource && (
            <WebView
              key={webViewKey}
              source={webViewSource}
              onMessage={handleWebViewMessage}
              setSupportMultipleWindows={false}
              javaScriptEnabled
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error:', nativeEvent);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView HTTP error:', nativeEvent);
              }}
              style={styles.webview}
            />
          )}
        </View>
      ) : (
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <OnboardingSlide showLogo title="Connect to your health insurance provider">
            <YStack gap="$3" w="100%" ai="center" mt="$2">
              <Card p="$3" borderRadius="$4" bg="$flexpaLightGreen">
                <Text textAlign="center" color="$flexpaBlack" fontSize="$3">
                  FlexpaHealth lets you securely connect to your healthcare provider to access your
                  benefits and claims data. Please click the button below to connect:
                </Text>
              </Card>

              <YStack gap="$2" w="100%" mt="$2">
                <Button title="Connect using WebView" onPress={() => setOpenLink(true)} />

                <Text fontSize="$2" color="$flexpaGray" textAlign="center">
                  Connect within the app using an embedded web view
                </Text>
              </YStack>

              <XStack gap="$4" jc="space-between" w="100%" mt="$2">
                <Link href={'/onboarding/step2' as any} asChild>
                  <Button title="Back" />
                </Link>
                <Link href="/" asChild>
                  <Text color="$flexpaBlue" textDecorationLine="underline" alignSelf="center">
                    Skip for now
                  </Text>
                </Link>
              </XStack>
            </YStack>
          </OnboardingSlide>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
});
