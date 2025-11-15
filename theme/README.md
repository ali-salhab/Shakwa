# Theme and Language System

This folder contains the theming infrastructure for the Shakwa app with multi-language support.

## Files

- **colors.ts**: Defines primary and secondary colors for light and dark themes
- **themes.ts**: Theme configuration combining colors with theme type

## Contexts

Located in `src/context/`:

- **ThemeContext.tsx**: Manages theme state (light/dark) with persistent storage
- **LanguageContext.tsx**: Manages language state (en/ar) with persistent storage

## Hooks

Located in `src/hooks/`:

- **useTheme()**: Access theme, colors, and theme switching
- **useLanguage()**: Access current language and translation function

## Usage

### Using Theme

```typescript
import { useTheme } from '../src/hooks/useTheme';

export default function MyComponent() {
  const { theme, themeType, setThemeType, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.primary }}>Hello</Text>
    </View>
  );
}
```

### Using Language

```typescript
import { useLanguage } from '../src/hooks/useLanguage';

export default function MyComponent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Text>{t('settings.theme')}</Text>
  );
}
```

## Available Colors

Each theme has these colors:

- **primary**: Main brand color
- **secondary**: Secondary brand color
- **background**: Main background
- **surface**: Card/surface background
- **text**: Primary text color
- **textSecondary**: Secondary text color
- **border**: Border color
- **error**: Error state color
- **success**: Success state color
- **warning**: Warning state color

## Adding Translations

Edit `src/utils/translations.ts` to add new translation keys. Follow the nested structure for organization.

Example:
```typescript
export const translations = {
  en: {
    mySection: {
      myKey: 'English text',
    },
  },
  ar: {
    mySection: {
      myKey: 'نص عربي',
    },
  },
};
```

Access with: `t('mySection.myKey')`

## Persistent Storage

Theme and language preferences are automatically saved to secure storage and restored on app launch.
