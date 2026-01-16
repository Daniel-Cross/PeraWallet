# PeraWallet

A React Native mobile application for browsing and managing GitHub repositories from algorandfoundation, algorand, and perawallet organizations.

## Features

### Repository Management

- **Browse Repositories**: View all repositories from multiple GitHub organizations in a single feed
- **Infinite Scroll Pagination**: Automatically loads more repositories as you scroll
- **Repository Details**: View comprehensive information including description, star count, language, and owner
- **Direct Links**: Navigate to the full repository on GitHub

### Search & Filter

- **Real-time Search**: Search repositories by name with debounced input for optimal performance
- **Organization Filter**: Filter repositories by specific organizations
- **Star Count Filter**: Filter repositories by minimum star count
- **Combined Filters**: Use multiple filters simultaneously for precise results

### Favorites

- **Mark Favorites**: Save your favorite repositories for quick access
- **Favorites Tab**: Dedicated screen to view all your favorite repositories
- **Persistent Storage**: Favorites are saved locally using AsyncStorage

## Tech Stack

- **React Native** with Expo ~54.0.31
- **TypeScript** for type safety
- **TanStack Query v5** for data fetching and caching with infinite scroll
- **React Navigation** for tab and stack navigation
- **Zustand** for lightweight state management
- **AsyncStorage** for local data persistence
- **Jest** with React Native Testing Library for comprehensive testing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, for additional features)
- iOS Simulator (Mac only) or Android Emulator
- Physical device with Expo Go app (optional)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd pera-wallet
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

   This will open the Expo Developer Tools in your browser.

## Running the App

> **Note:** This app uses Expo development builds (not Expo Go). You must build the app first before running it on a simulator or device.

### iOS (Mac only)

**First time setup:**

```bash
npm run build-ios
```

This will build the development client on the iOS simulator. Once the build completes, you can run:

```bash
npm run ios
```

Or press `i` in the terminal after running `npm start`

### Android

**First time setup:**

```bash
npm run build-android
```

This will build the development client on the Android emulator. Once the build completes, you can run:

```bash
npm run android
```

Or press `a` in the terminal after running `npm start`

### Physical Device

**Note:** Physical devices require a development build. You cannot use Expo Go for this app.

1. Build for your device using EAS Build or local builds
2. Install the development build on your device
3. Run `npm start` and scan the QR code

## Testing

Run the test suite:

```bash
npm test
```

The project includes comprehensive tests for:

- React components (screens, molecules, atoms)
- Custom hooks (pagination, filtering, data fetching)
- State management (stores)
- API services
- Utility functions

## Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components (Loading, ListEmpty)
│   └── molecules/      # Composite components (SearchAndFilter, FilterModal)
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts
│   ├── useGithubRepos.ts
│   ├── useRepositories.ts
│   ├── useOrganizations.ts
│   ├── useFilteredRepositories.ts
│   └── usePagination.ts
├── lib/                # Utility functions and helpers
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── RepoListScreen.tsx
│   ├── IndividualRepoScreen.tsx
│   └── FavouritesScreen.tsx
├── services/           # API services
│   └── githubApi.ts
├── store/              # Zustand state management
│   ├── favouritesStore.ts
│   ├── filterStore.ts
│   └── repositoryStore.ts
└── types/              # TypeScript type definitions
```

## Production Readiness & Quality Approach

While this is a demonstration project, it implements several production-grade patterns and practices. Below is an overview of current implementations and approaches that would be taken for a production-ready application.

### Testing Strategy

**Current Implementation:**

- **Comprehensive test coverage** across all layers:
  - 16 test suites with 121+ tests
  - Unit tests for hooks, utilities, and services
  - Component tests with React Native Testing Library
  - Integration tests for user flows
- **Test-driven patterns** with mocked dependencies
- **CI/CD ready** with `npm test` command
- **Development builds** using expo developer builds for a more 'real world' experience

**Production Enhancements:**

- **E2E Testing**: Implement Detox or Maestro for end-to-end user flow testing
- **Performance Testing**: Monitor and test app performance metrics (TTI, FPS, memory usage)
- **Code Coverage Requirements**: Enforce minimum 80% coverage with branch/line coverage

### Code Quality

**Current Implementation:**

- **TypeScript** with strict typing for type safety
- **Separation of concerns** with well-defined layers (hooks, services, stores, components)
- **Custom hooks** for reusable business logic
- **Modular architecture** with atomic design patterns (atoms, molecules, screens)

**Production Enhancements:**

- **ESLint + Prettier**: Enforce consistent code style and catch common errors
- **Husky Git Hooks**: Pre-commit hooks for linting, formatting, and test running

### Performance Optimizations

**Current Implementation:**

- **Infinite scroll pagination**: Loads data incrementally to reduce initial load time
- **Query caching**: TanStack Query automatically caches API responses
- **Debounced search**: 300ms delay prevents excessive API calls
- **Memoized calculations**: useMemo for expensive filtering operations
- **FlatList optimizations**: Proper key extractors and window size configuration

**Production Enhancements:**

- **Memory Management**: Monitor and prevent memory leaks, especially in navigation

### Error Handling & Resilience

**Current Implementation:**

- **Graceful error handling** in API layer with try-catch and fallbacks
- **Error states** displayed to users with clear messaging
- **Sequential fetching** prevents race conditions with multiple API calls
- **Empty states** for zero-data scenarios

**Production Enhancements:**

- **Error Boundaries**: React error boundaries to prevent app crashes
- **Retry Logic**: Exponential backoff for failed requests

### State Management & Data Flow

**Current Implementation:**

- **TanStack Query**: Server state with automatic caching, refetching, and stale-time management
- **Zustand**: Lightweight global state for UI concerns (filters, favorites)
- **AsyncStorage**: Persistent local storage for favorites
- **Clear data flow**: Separation between server state and client state

**Production Enhancements:**

- **State Persistence**: Persist query cache for instant app startup

### Security

**Current Implementation:**

- **TypeScript**: Type safety prevents many runtime errors
- **No exposed secrets**: GitHub API is public and doesn't require authentication

**Production Enhancements:**

- **Secure Storage**: Use native storage for sensitive data
- **Input Validation**: Sanitize all user inputs

### Monitoring & Analytics

**Production Additions:**

- **Analytics**: Track user behavior with Firebase Analytics, Mixpanel, or Amplitude
- **Crash Reporting**: Real-time crash alerts with stack traces

### CI/CD Pipeline

**Production Implementation:**

- **Automated Testing**: Run full test suite on every PR
- **Build Automation**: Automatic builds for staging and production
- **Deployment Gates**: Code review, test coverage, and quality checks required
- **OTA Updates**: Over-the-air updates for React Native code (Expo Updates or CodePush)

## License

ISC
