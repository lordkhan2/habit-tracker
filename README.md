# Habit Tracker

A modern React Native habit tracking application built with Expo, Appwrite, and React Native Paper. Track your daily habits, build streaks, and stay consistent with your goals.

## Features

- **User Authentication** - Secure login and registration with Appwrite
- **Habit Management** - Create, view, and delete habits with custom descriptions and frequencies
- **Daily Tracking** - Mark habits as complete with swipe gestures
- **Streak Tracking** - Visualize your consistency with streak counters
- **Streaks View** - Monitor your progress across all habits
- **Modern UI** - Beautiful interface built with React Native Paper
- **Real-time Updates** - Live synchronization using Appwrite real-time subscriptions
- **Cross-platform** - Works on iOS, Android, and Web

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (~54.0.20)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **UI Library**: [React Native Paper](https://callstack.github.io/react-native-paper/)
- **Backend**: [Appwrite](https://appwrite.io/) (Database & Authentication)
- **Language**: TypeScript
- **State Management**: React Context API
- **Gestures**: React Native Gesture Handler

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (installed globally or via npx)
- Appwrite account and project setup

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_PROJECT_NAME=your_project_name
EXPO_PUBLIC_DB_ID=your_database_id
EXPO_PUBLIC_HABITS_COLLECTION_ID=your_habits_collection_id
EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID=your_completions_collection_id
```

### 3. Appwrite Setup

1. Create an Appwrite project
2. Set up a database with two collections:
   - **Habits Collection**: Documents with fields:
     - `user_id` (string)
     - `title` (string)
     - `description` (string)
     - `frequency` (string)
     - `streak_count` (integer)
     - `last_completed` (datetime)
   - **Completions Collection**: Documents with fields:
     - `habit_id` (string)
     - `user_id` (string)
     - `completed_at` (datetime)
3. Configure authentication in Appwrite
4. Set up proper permissions for collections

### 4. Start the Development Server

```bash
npm start
# or
npx expo start
```

### 5. Run on Your Device

- **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
- **Android Emulator**: Press `a` in the terminal or run `npm run android`
- **Web**: Press `w` in the terminal or run `npm run web`
- **Physical Device**: Scan the QR code with Expo Go app

## Project Structure

```
habit-tracker/
├── app/
│   ├── (tabs)/          # Tab navigation screens
│   │   ├── index.tsx    # Today's habits screen
│   │   ├── streaks.tsx  # Streaks view
│   │   └── add-habit.tsx # Add new habit
│   ├── auth.tsx         # Authentication screen
│   ├── _layout.tsx      # Root layout with auth guard
│   └── types/           # TypeScript type definitions
├── lib/
│   ├── appwrite.ts      # Appwrite client configuration
│   └── auth-context.tsx # Authentication context provider
├── assets/              # Images and static assets
└── package.json
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start on web browser
- `npm run lint` - Run ESLint

## Features in Detail

### Habit Management
- Create habits with title, description, and frequency
- Swipe right to mark a habit as complete
- Swipe left to delete a habit
- View streak counts for each habit

### Real-time Synchronization
- Changes sync automatically across devices
- Real-time updates when habits are created, updated, or deleted
- Instant completion tracking

### Authentication
- Secure user authentication with Appwrite
- Protected routes with route guards
- Automatic redirect based on auth state

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Expo Router](https://docs.expo.dev/router/introduction/)
