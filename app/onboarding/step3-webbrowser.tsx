import { useState, useEffect } from 'react';
import { Link, Stack, useRouter } from 'expo-router';
import { YStack, Text, Card, XStack, Spinner, Button as TamaguiButton } from 'tamagui';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { OnboardingSlide } from '~/components/OnboardingSlide';
import { Button } from '~/components/Button';

// import { Button, StyleSheet, Text, View } from 'react-native';
// import { useState } from 'react';
// import { WebView } from 'react-native-webview';

// const html = `
// <html>
//   <head>
//     <script src="https://js.flexpa.com/v1/"></script>
//     <meta name="viewport" content="width=device-width, user-scalable=no" />
//   </head>
//   <body>
//     <script>
//       FlexpaLink.create({
//         publishableKey: 'pk_test_ggLxLkCvunkeyllb1BgJFoXkKesvFuBj9Aq_aO2HzTE',
//         onSuccess: (publicToken) => {
//           // no-op
//           // use handleFlexpaLinkMessage to handle the success message instead
//         }
//       });
//       FlexpaLink.open();
//     </script>
//   </body>
// </html>
// `;

// const injectedJavaScriptBeforeContentLoaded = `
//   const onMessage = (event) => {
//     window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
//   }

//   window.addEventListener('message', onMessage);
//   true;
// `;

// export default function OnboardingCompletion() {
//   const [openLink, setOpenLink] = useState(false);
//   const [publicToken, setPublicToken] = useState(null);

//   //ts-ignore
//   const handleFlexpaLinkMessage = (message: any) => {
//     // if message is a string, reparse it as JSON - this is necessary because the success message is a string
//     if (typeof message === 'string') {
//       message = JSON.parse(message);
//     }

//     switch (message.type) {
//       case 'SUCCESS':
//         console.log('Flexpa Link success');
//         // send the public token to your server for exchange - equivalent to the onSuccess callback in the Flexpa Link docs
//         setPublicToken(message.payload);
//         break;
//       case 'ERROR':
//         console.log('Flexpa Link error');
//         break;
//       case 'LOADED':
//         console.log('Flexpa Link loaded');
//         break;
//       case 'CLOSED':
//         setOpenLink(false);
//         break;
//       default:
//         console.log(message);
//         break;
//     }
//   };

//   if (publicToken) {
//     return (
//       <View style={styles.container}>
//         <Text>Public Token: {JSON.stringify(publicToken)}</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       {openLink ? (
//         <WebView
//           source={{ html }}
//           onMessage={(event) => {
//             handleFlexpaLinkMessage(JSON.parse(event.nativeEvent.data));
//           }}
//           injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
//           setSupportMultipleWindows={false}
//         />
//       ) : (
//         <View style={styles.container}>
//           <Button title="Open Flexpa Link" onPress={() => setOpenLink(true)} />
//         </View>
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

export default function OnboardingCompletion2() {
  const [isLinking, setIsLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const router = useRouter();

  // Check for tokens on component mount
  useEffect(() => {
    const checkForToken = async () => {
      try {
        // Check if we have a token in AsyncStorage
        const storedToken = await AsyncStorage.getItem('flexpaToken');
        if (storedToken) {
          console.log('Found existing Flexpa token');
          setPublicToken(storedToken);
          setLinkSuccess(true);
        }
      } catch (error) {
        console.error('Error checking for token:', error);
      }
    };

    checkForToken();
  }, []);

  // Open Flexpa using WebBrowser
  const openFlexpaLink = async () => {
    try {
      setIsLinking(true);

      // Get publishable key from env
      const publishableKey = process.env.EXPO_PUBLIC_FLEXPA_PUBLISHABLE_KEY;

      if (!publishableKey) {
        Alert.alert('Missing API Key', 'Add EXPO_PUBLIC_FLEXPA_PUBLISHABLE_KEY to your .env file');
        setIsLinking(false);
        return;
      }

      // Generate a unique user ID for this session with prefix
      const externalId = `usr-${Math.random().toString(36).substring(2, 10)}`;

      // Create user object as JSON string and encode it
      const userObject = { externalId };
      const encodedUser = encodeURIComponent(JSON.stringify(userObject));

      // For iOS, we can use com.flexpahealth as our opener URL
      // For Android, we could use the package name
      const openerUrl = Platform.OS === 'ios' ? 'flexpahealth://open' : 'flexpahealth://open';

      // Build the FlexpaLink URL with the correct format based on example
      const flexpaUrl = `http://localhost:3006/?publishableKey=${encodeURIComponent(publishableKey)}&openerUrl=${encodeURIComponent(openerUrl)}&strict=false&autoExit=true&skipSyncing=false&skipExplainer=false&user=${encodedUser}&requestedResources=&usage=ONE_TIME`;

      console.log('Opening Flexpa with URL:', flexpaUrl);

      // Set up a listener for deep links before opening browser
      const subscription = Linking.addEventListener('url', ({ url }) => {
        console.log('Got URL from deep link:', url);

        // Check if it contains a token
        if (url.includes('token=') || url.includes('public_token=')) {
          try {
            const parsedUrl = new URL(url);
            // Try both parameter names
            const token =
              parsedUrl.searchParams.get('public_token') || parsedUrl.searchParams.get('token');

            if (token) {
              console.log('Received token from deep link:', token);
              setPublicToken(token);
              setLinkSuccess(true);
              AsyncStorage.setItem('flexpaToken', token);
            }
          } catch (error) {
            console.error('Error parsing deep link URL:', error);
          }

          // Clean up
          subscription.remove();
        }
      });

      // Open with Expo's WebBrowser (uses SFSafariViewController on iOS)
      const result = await WebBrowser.openAuthSessionAsync(flexpaUrl);

      console.log('WebBrowser session ended with result:', result);

      // Clean up link listener if it hasn't been removed yet
      subscription.remove();

      setIsLinking(false);

      // After WebBrowser closes, check if we received a token via deep link
      // If not, ask user if they completed authentication
      setTimeout(async () => {
        const storedToken = await AsyncStorage.getItem('flexpaToken');
        if (!storedToken || storedToken === publicToken) {
          Alert.alert(
            'Authentication Status',
            'Did you complete the authentication with your health provider?',
            [
              {
                text: 'Yes, I Received a Token',
                onPress: () => {
                  // Prompt for the token
                  Alert.prompt(
                    'Enter Public Token',
                    'Please enter the public token you received:',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Submit',
                        onPress: (token) => {
                          if (token) {
                            setPublicToken(token);
                            setLinkSuccess(true);
                            AsyncStorage.setItem('flexpaToken', token);
                          }
                        },
                      },
                    ]
                  );
                },
              },
              {
                text: 'Use Demo Token',
                onPress: () => {
                  // Generate mock token for demo
                  const mockToken = `demo_${Math.random().toString(36).substring(2, 15)}`;
                  setPublicToken(mockToken);
                  setLinkSuccess(true);
                  AsyncStorage.setItem('flexpaToken', mockToken);
                },
              },
              {
                text: 'No, Try Again',
                style: 'cancel',
              },
            ]
          );
        }
      }, 1000);
    } catch (error) {
      console.error('FlexpaLink error:', error);
      setIsLinking(false);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', 'There was a problem opening the browser: ' + errorMessage);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingSlide
        showLogo={true}
        title="You're all set!"
        subtitle="Connect to your health insurance provider"
        imageSource="https://source.unsplash.com/featured/960x640?health,digital,success">
        <YStack gap="$6" w="100%" ai="center" mt="$4">
          <Card p="$4" borderRadius="$4" bg="$flexpaLightGreen">
            <Text textAlign="center" color="$flexpaBlack" fontSize="$3">
              FlexpaHealth lets you securely connect to your healthcare provider to access your
              benefits and claims data. Click below to connect your health insurance account.
            </Text>
          </Card>

          {linkSuccess && (
            <Card p="$4" borderRadius="$4" bg="$white" borderColor="$flexpaGreen" borderWidth={1}>
              <Text textAlign="center" color="$flexpaBlack" fontSize="$3" fontWeight="bold">
                🎉 Successfully connected to your health provider!
                {publicToken && (
                  <Text fontSize="$2" color="$flexpaGray" mt="$2">
                    Token: {publicToken.substring(0, 10)}...
                  </Text>
                )}
              </Text>
            </Card>
          )}

          <XStack gap="$4" jc="center">
            <Link href="/onboarding/step2" asChild>
              <Button title="Back" />
            </Link>

            {isLinking ? (
              <TamaguiButton backgroundColor="$flexpaBlue" color="$white" borderRadius={28}>
                <XStack gap="$2" ai="center">
                  <Spinner size="small" color="white" />
                  <Text color="white">Connecting...</Text>
                </XStack>
              </TamaguiButton>
            ) : (
              <Button
                title={linkSuccess ? 'Reconnect Provider' : 'Connect Health Provider'}
                onPress={openFlexpaLink}
              />
            )}
          </XStack>

          <XStack jc="center" mt="$4">
            <Link href="/" asChild>
              <Text color="$flexpaBlue" textDecorationLine="underline">
                {linkSuccess ? 'Continue to App' : 'Skip for now'}
              </Text>
            </Link>
          </XStack>
        </YStack>
      </OnboardingSlide>
    </>
  );
}
