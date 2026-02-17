# VERCEL-REACT-NATIVE-SKILLS - RENDERING
> Generated: 2026-02-17
> Rules: 2


### RULE: Never Use && with Potentially Falsy Values
(File: rendering-no-falsy-and.md)

## Never Use && with Potentially Falsy Values

Never use `{value && <Component />}` when `value` could be an empty string or
`0`. These are falsy but JSX-renderable—React Native will try to render them as
text outside a `<Text>` component, causing a hard crash in production.

**Incorrect (crashes if count is 0 or name is ""):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {name && <Text>{name}</Text>}
      {count && <Text>{count} items</Text>}
    </View>
  )
}
// If name="" or count=0, renders the falsy value → crash
```

**Correct (ternary with null):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {name ? <Text>{name}</Text> : null}
      {count ? <Text>{count} items</Text> : null}
    </View>
  )
}
```

**Correct (explicit boolean coercion):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  return (
    <View>
      {!!name && <Text>{name}</Text>}
      {!!count && <Text>{count} items</Text>}
    </View>
  )
}
```

**Best (early return):**

```tsx
function Profile({ name, count }: { name: string; count: number }) {
  if (!name) return null

  return (
    <View>
      <Text>{name}</Text>
      {count > 0 ? <Text>{count} items</Text> : null}
    </View>
  )
}
```

Early returns are clearest. When using conditionals inline, prefer ternary or
explicit boolean checks.

**Lint rule:** Enable `react/jsx-no-leaked-render` from
[eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-leaked-render.md)
to catch this automatically.

### RULE: Wrap Strings in Text Components
(File: rendering-text-in-text-component.md)

## Wrap Strings in Text Components

Strings must be rendered inside `<Text>`. React Native crashes if a string is a
direct child of `<View>`.

**Incorrect (crashes):**

```tsx
import { View } from 'react-native'

function Greeting({ name }: { name: string }) {
  return <View>Hello, {name}!</View>
}
// Error: Text strings must be rendered within a <Text> component.
```

**Correct:**

```tsx
import { View, Text } from 'react-native'

function Greeting({ name }: { name: string }) {
  return (
    <View>
      <Text>Hello, {name}!</Text>
    </View>
  )
}
```
