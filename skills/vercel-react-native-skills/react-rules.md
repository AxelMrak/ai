# VERCEL-REACT-NATIVE-SKILLS - REACT
> Generated: 2026-02-17
> Rules: 5


### RULE: Destructure Functions Early in Render (React Compiler)
(File: react-compiler-destructure-functions.md)

## Destructure Functions Early in Render

This rule is only applicable if you are using the React Compiler.

Destructure functions from hooks at the top of render scope. Never dot into
objects to call functions. Destructured functions are stable references; dotting
creates new references and breaks memoization.

**Incorrect (dotting into object):**

```tsx
import { useRouter } from 'expo-router'

function SaveButton(props) {
  const router = useRouter()

  // bad: react-compiler will key the cache on "props" and "router", which are objects that change each render
  const handlePress = () => {
    props.onSave()
    router.push('/success') // unstable reference
  }

  return <Button onPress={handlePress}>Save</Button>
}
```

**Correct (destructure early):**

```tsx
import { useRouter } from 'expo-router'

function SaveButton({ onSave }) {
  const { push } = useRouter()

  // good: react-compiler will key on push and onSave
  const handlePress = () => {
    onSave()
    push('/success') // stable reference
  }

  return <Button onPress={handlePress}>Save</Button>
}
```

### RULE: Use .get() and .set() for Reanimated Shared Values (not .value)
(File: react-compiler-reanimated-shared-values.md)

## Use .get() and .set() for Shared Values with React Compiler

With React Compiler enabled, use `.get()` and `.set()` instead of reading or
writing `.value` directly on Reanimated shared values. The compiler can't track
property access—explicit methods ensure correct behavior.

**Incorrect (breaks with React Compiler):**

```tsx
import { useSharedValue } from 'react-native-reanimated'

function Counter() {
  const count = useSharedValue(0)

  const increment = () => {
    count.value = count.value + 1 // opts out of react compiler
  }

  return <Button onPress={increment} title={`Count: ${count.value}`} />
}
```

**Correct (React Compiler compatible):**

```tsx
import { useSharedValue } from 'react-native-reanimated'

function Counter() {
  const count = useSharedValue(0)

  const increment = () => {
    count.set(count.get() + 1)
  }

  return <Button onPress={increment} title={`Count: ${count.get()}`} />
}
```

See the
[Reanimated docs](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/#react-compiler-support)
for more.

### RULE: useState Dispatch updaters for State That Depends on Current Value
(File: react-state-dispatcher.md)

## Use Dispatch Updaters for State That Depends on Current Value

When the next state depends on the current state, use a dispatch updater
(`setState(prev => ...)`) instead of reading the state variable directly in a
callback. This avoids stale closures and ensures you're comparing against the
latest value.

**Incorrect (reads state directly):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  // size may be stale in this closure
  if (size?.width !== width || size?.height !== height) {
    setSize({ width, height })
  }
}
```

**Correct (dispatch updater):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  setSize((prev) => {
    if (prev?.width === width && prev?.height === height) return prev
    return { width, height }
  })
}
```

Returning the previous value from the updater skips the re-render.

For primitive states, you don't need to compare values before firing a
re-render.

**Incorrect (unnecessary comparison for primitive state):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  setSize((prev) => (prev === width ? prev : width))
}
```

**Correct (sets primitive state directly):**

```tsx
const [size, setSize] = useState<Size | undefined>(undefined)

const onLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  setSize(width)
}
```

However, if the next state depends on the current state, you should still use a
dispatch updater.

**Incorrect (reads state directly from the callback):**

```tsx
const [count, setCount] = useState(0)

const onTap = () => {
  setCount(count + 1)
}
```

**Correct (dispatch updater):**

```tsx
const [count, setCount] = useState(0)

const onTap = () => {
  setCount((prev) => prev + 1)
}
```

### RULE: Use fallback state instead of initialState
(File: react-state-fallback.md)

## Use fallback state instead of initialState

Use `undefined` as initial state and nullish coalescing (`??`) to fall back to
parent or server values. State represents user intent only—`undefined` means
"user hasn't chosen yet." This enables reactive fallbacks that update when the
source changes, not just on initial render.

**Incorrect (syncs state, loses reactivity):**

```tsx
type Props = { fallbackEnabled: boolean }

function Toggle({ fallbackEnabled }: Props) {
  const [enabled, setEnabled] = useState(defaultEnabled)
  // If fallbackEnabled changes, state is stale
  // State mixes user intent with default value

  return <Switch value={enabled} onValueChange={setEnabled} />
}
```

**Correct (state is user intent, reactive fallback):**

```tsx
type Props = { fallbackEnabled: boolean }

function Toggle({ fallbackEnabled }: Props) {
  const [_enabled, setEnabled] = useState<boolean | undefined>(undefined)
  const enabled = _enabled ?? defaultEnabled
  // undefined = user hasn't touched it, falls back to prop
  // If defaultEnabled changes, component reflects it
  // Once user interacts, their choice persists

  return <Switch value={enabled} onValueChange={setEnabled} />
}
```

**With server data:**

```tsx
function ProfileForm({ data }: { data: User }) {
  const [_theme, setTheme] = useState<string | undefined>(undefined)
  const theme = _theme ?? data.theme
  // Shows server value until user overrides
  // Server refetch updates the fallback automatically

  return <ThemePicker value={theme} onChange={setTheme} />
}
```

### RULE: Minimize State Variables and Derive Values
(File: react-state-minimize.md)

## Minimize State Variables and Derive Values

Use the fewest state variables possible. If a value can be computed from existing state or props, derive it during render instead of storing it in state. Redundant state causes unnecessary re-renders and can drift out of sync.

**Incorrect (redundant state):**

```tsx
function Cart({ items }: { items: Item[] }) {
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0))
    setItemCount(items.length)
  }, [items])

  return (
    <View>
      <Text>{itemCount} items</Text>
      <Text>Total: ${total}</Text>
    </View>
  )
}
```

**Correct (derived values):**

```tsx
function Cart({ items }: { items: Item[] }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  const itemCount = items.length

  return (
    <View>
      <Text>{itemCount} items</Text>
      <Text>Total: ${total}</Text>
    </View>
  )
}
```

**Another example:**

```tsx
// Incorrect: storing both firstName, lastName, AND fullName
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')

// Correct: derive fullName
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const fullName = `${firstName} ${lastName}`
```

State should be the minimal source of truth. Everything else is derived.

Reference: [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
