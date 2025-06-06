# FlexpaHealth Onboarding Experience

This is a React Native Expo application using Tamagui UI components to create a mock onboarding experience for a fictional health insurance company called "FlexpaHealth".

## Features

- Modern, clean UI with Flexpa-inspired theming
- Three-step onboarding flow
- Form validation
- Responsive design

## Getting Started

To run this application locally:

1. Clone the repository
2. Copy the environment file and add your Flexpa publishable key

```bash
cp .env.example .env
```

Edit `.env` and add your Flexpa publishable key:

```
EXPO_PUBLIC_FLEXPA_PUBLISHABLE_KEY=pk_test_your_key_here
```

3. Install dependencies

```bash
npm install
# or
yarn install
```

4. Start the development server

```bash
npm start
# or
yarn start
```

5. Run on iOS or Android

Select `i` once the Expo Go server is running to open an iOS simulator, select `a` once the Expo Go server is running to open an Android simulator.

## Tech Stack

- React Native
- Expo
- Tamagui UI
- TypeScript

## Project Structure

- `/app` - Main app screens using Expo Router
- `/app/onboarding` - Onboarding flow screens
- `/components` - Reusable components
- `/assets` - Images and other static assets
- `/tamagui.config.ts` - Tamagui theme configuration

## Note

This is a demo application showcasing a user onboarding flow for a health insurance company. The design is inspired by Flexpa's branding and focuses on creating a clean, modern user experience.
