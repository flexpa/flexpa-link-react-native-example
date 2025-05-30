import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';
import { Linking } from 'react-native';

import config from '../tamagui.config';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // Handle deep linking
  useEffect(() => {
    // Handle URLs that open the app (deep links)
    const handleDeepLink = (event: { url: string }) => {
      if (!event.url) return;

      console.log('Received deep link:', event.url);

      // Check if it's a Flexpa callback
      if (event.url.includes('callback')) {
        try {
          // Parse the URL to extract parameters
          const url = new URL(event.url);
          const publicToken = url.searchParams.get('public_token');

          if (publicToken) {
            console.log('Received public token from deep link:', publicToken);

            // Store the token (you might want to use secure storage in a real app)
            // You could also use a state management solution like Zustand, Redux, or Context
            // For simplicity, we'll just store it in localStorage for web or AsyncStorage for native
            localStorage.setItem('flexpaToken', publicToken);

            // In a real app, you would send this token to your backend
            // fetch('your-api-endpoint', {
            //   method: 'POST',
            //   body: JSON.stringify({ publicToken })
            // });

            // You might want to navigate to a success screen or update state
            // router.push('/success');
          }
        } catch (error) {
          console.error('Error parsing deep link URL:', error);
        }
      }
    };

    // Add event listener for deep links while the app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle deep link if app was opened with a URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <TamaguiProvider config={config}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </TamaguiProvider>
  );
}
