import { Button, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { WebView } from 'react-native-webview';

const html = `
<html>
  <head>
    <script src="https://js.flexpa.com/v1/"></script>
    <meta name="viewport" content="width=device-width, user-scalable=no" />
  </head>
  <body>
    <script>
      FlexpaLink.create({
        publishableKey: 'YOUR_PUBLISHABLE_KEY',
        onSuccess: (publicToken) => {
          // no-op
          // use handleFlexpaLinkMessage to handle the success message instead
        }
      });
      FlexpaLink.open();
    </script>
  </body>
</html>
`;

const injectedJavaScriptBeforeContentLoaded = `
  const onMessage = (event) => {
    window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
  }

  window.addEventListener('message', onMessage);
  true;
`;

export default function App() {
  const [openLink, setOpenLink] = useState(false);
  const [publicToken, setPublicToken] = useState(null);

  const handleFlexpaLinkMessage = (message) => {
    // if message is a string, reparse it as JSON - this is necessary because the success message is a string
    if (typeof message === 'string') {
      message = JSON.parse(message);
    }

    switch (message.type) {
      case 'SUCCESS':
        console.log('Flexpa Link success');
        // send the public token to your server for exchange - equivalent to the onSuccess callback in the Flexpa Link docs
        setPublicToken(message.payload);
        break;
      case 'ERROR':
        console.log('Flexpa Link error');
        break;
      case 'LOADED':
        console.log('Flexpa Link loaded');
        break;
      case 'CLOSED':
        setOpenLink(false);
        break;
      default:
        console.log(message);
        break;
    }
  }

  if (publicToken) {
    return (
      <View style={styles.container}>
        <Text>Public Token: {publicToken}</Text>
      </View>
    );
  }
  
  return (
    <>
      {openLink ? (
        <WebView
          source={{ html }}
          onMessage={(event) => { handleFlexpaLinkMessage(JSON.parse(event.nativeEvent.data)) }}
          injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
          setSupportMultipleWindows={false}
      />
      ) : (
        <View style={styles.container}>
          <Button title="Open Flexpa Link" onPress={() => setOpenLink(true)} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
