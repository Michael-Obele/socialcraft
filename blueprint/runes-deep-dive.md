# Svelte 5 Runes: Deep Dive

This document provides a detailed overview of the core Svelte 5 Runes, which are fundamental to the new reactivity model.

## $state

The `$state` rune allows you to create _reactive state_, which means that your UI _reacts_ when it changes.

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

Unlike other frameworks you may have encountered, there is no API for interacting with state — `count` is just a number, rather than an object or a function, and you can update it like you would update any other variable.

### Deep state

If `$state` is used with an array or a simple object, the result is a deeply reactive _state proxy_. [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) allow Svelte to run code when you read or write properties, including via methods like `array.push(...)`, triggering granular updates.


State is proxified recursively until Svelte finds something other than an array or simple object. In a case like this...

```js
let todos = $state([
	{
		done: false,
		text: 'add more todos'
	}
]);
```

...modifying an individual todo's property will trigger updates to anything in your UI that depends on that specific property:

```js
let todos = [{ done: false, text: 'add more todos' }];
//cut
todos[0].done = !todos[0].done;
```

If you push a new object to the array, it will also be proxified:

```js
let todos = [{ done: false, text: 'add more todos' }];
//cut
todos.push({
	done: false,
	text: 'eat lunch'
});
```


Note that if you destructure a reactive value, the references are not reactive — as in normal JavaScript, they are evaluated at the point of destructuring:

```js
let todos = [{ done: false, text: 'add more todos' }];
//cut
let { done, text } = todos[0];

// this will not affect the value of `done`
todos[0].done = !todos[0].done;
```

### Classes

You can also use `$state` in class fields (whether public or private):

```js
// @errors: 7006 2554
class Todo {
	done = $state(false);
	text = $state();

	constructor(text) {
		this.text = text;
	}

	reset() {
		this.text = '';
		this.done = false;
	}
}
```


When calling methods in JavaScript, the value of [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) matters. This won't work, because `this` inside the `reset` method will be the `<button>` rather than the `Todo`:

```svelte
<button onclick={todo.reset}>
	reset
</button>
```

You can either use an inline function...

```svelte
<button onclick={() => todo.reset()}>
	reset
</button>
```

...or use an arrow function in the class definition:

```js
// @errors: 7006 2554
class Todo {
	done = $state(false);
	text = $state();

	constructor(text) {
		this.text = text;
	}

	reset = () => {
		this.text = '';
		this.done = false;
	}
}
```

## `$state.raw`

In cases where you don't want objects and arrays to be deeply reactive you can use `$state.raw`.

State declared with `$state.raw` cannot be mutated; it can only be _reassigned_. In other words, rather than assigning to a property of an object, or using an array method like `push`, replace the object or array altogether if you'd like to update it:

```js
let person = $state.raw({
	name: 'Heraclitus',
	age: 49
});

// this will have no effect
person.age += 1;

// this will work, because we're creating a new person
person = {
	name: 'Heraclitus',
	age: 50
};
```

This can improve performance with large arrays and objects that you weren't planning to mutate anyway, since it avoids the cost of making them reactive. Note that raw state can _contain_ reactive state (for example, a raw array of reactive objects).

## `$state.snapshot`

To take a static snapshot of a deeply reactive `$state` proxy, use `$state.snapshot`:

```svelte
<script>
	let counter = $state({ count: 0 });

	function onclick() {
		// Will log `{ count: ... }` rather than `Proxy { ... }`
		console.log($state.snapshot(counter));
	}
</script>
```

This is handy when you want to pass some state to an external library or API that doesn't expect a proxy, such as `structuredClone`.

## Passing state into functions

JavaScript is a _pass-by-value_ language — when you call a function, the arguments are the _values_ rather than the _variables_. In other words:

```js
/// file: index.js
// @filename: index.js
//cut
/**
 * @param {number} a
 * @param {number} b
 */
function add(a, b) {
	return a + b;
}

let a = 1;
let b = 2;
let total = add(a, b);
console.log(total); // 3

a = 3;
b = 4;
console.log(total); // still 3!
```

If `add` wanted to have access to the _current_ values of `a` and `b`, and to return the current `total` value, you would need to use functions instead:

```js
/// file: index.js
// @filename: index.js
//cut
/**
 * @param {() => number} getA
 * @param {() => number} getB
 */
function add(getA, getB) {
	return() => getA() + getB();
}

let a = 1;
let b = 2;
let total = add(() => a, () => b);
console.log(total()); // 3

a = 3;
b = 4;
console.log(total()); // 7
```

State in Svelte is no different — when you reference something declared with the `$state` rune...

```js
let a =$state(1);
let b =$state(2);
```

...you're accessing its _current value_.

Note that 'functions' is broad — it encompasses properties of proxies and [`get`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)/[`set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) properties...

```js
/// file: index.js
// @filename: index.js
//cut
/**
 * @param {{ a: number, b: number }} input
 */
function add(input) {
	return {
		get value() {
			return input.a + input.b;
		}
	};
}

let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3

input.a = 3;
input.b = 4;
console.log(total.value); // 7
```

...though if you find yourself writing code like that, consider using [classes](#Classes) instead.

## Passing state across modules

You can declare state in `.svelte.js` and `.svelte.ts` files, but you can only _export_ that state if it's not directly reassigned. In other words you can't do this:

```js
/// file: state.svelte.js
export let count = $state(0);

export function increment() {
	count += 1;
}
```

That's because every reference to `count` is transformed by the Svelte compiler — the code above is roughly equivalent to this:

```js
/// file: state.svelte.js (compiler output)
// @filename: index.ts
interface Signal<T> {
	value: T;
}

interface Svelte {
	state<T>(value?: T): Signal<T>;
	get<T>(source: Signal<T>): T;
	set<T>(source: Signal<T>, value: T): void;
}
declare const $: Svelte;
//cut
export let count = $.state(0);

export function increment() {
	$.set(count, $.get(count) + 1);
}
```


Since the compiler only operates on one file at a time, if another file imports `count` Svelte doesn't know that it needs to wrap each reference in `$.get` and `$.set`:

```js
// @filename: state.svelte.js
export let count = 0;

// @filename: index.js
//cut
import { count } from './state.svelte.js';

console.log(typeof count); // 'object', not 'number'
```

This leaves you with two options for sharing state between modules — either don't reassign it...

```js
// This is allowed — since we're updating
// `counter.count` rather than `counter`,
// Svelte doesn't wrap it in `$.state`
export const counter = $state({
	count: 0
});

export function increment() {
	counter.count += 1;
}
```

...or don't directly export it:

```js
let count = $state(0);

export function getCount() {
	return count;
}

export function increment() {
	count += 1;
}
```

---

## $derived

Derived state is declared with the `$derived` rune:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>

<button onclick={() => count++}>
	{doubled}
</button>

<p>{count} doubled is {doubled}</p>
```

The expression inside `$derived(...)` should be free of side-effects. Svelte will disallow state changes (e.g. `count++`) inside derived expressions.

As with `$state`, you can mark class fields as `$derived`.


## `$derived.by`

Sometimes you need to create complex derivations that don't fit inside a short expression. In these cases, you can use `$derived.by` which accepts a function as its argument.

```svelte
<script>
	let numbers = $state([1, 2, 3]);
	let total = $derived.by(() => {
		let total = 0;
		for (const n of numbers) {
			total += n;
		}
		return total;
	});
</script>

<button onclick={() => numbers.push(numbers.length + 1)}>
	{numbers.join(' + ')} = {total}
</button>
```

In essence, `$derived(expression)` is equivalent to `$derived.by(() => expression)`.

## Understanding dependencies

Anything read synchronously inside the `$derived` expression (or `$derived.by` function body) is considered a _dependency_ of the derived state. When the state changes, the derived will be marked as _dirty_ and recalculated when it is next read.

To exempt a piece of state from being treated as a dependency, use [`untrack`](svelte#untrack).

## Overriding derived values

Derived expressions are recalculated when their dependencies change, but you can temporarily override their values by reassigning them (unless they are declared with `const`). This can be useful for things like _optimistic UI_, where a value is derived from the 'source of truth' (such as data from your server) but you'd like to show immediate feedback to the user:

```svelte
<script>
	let { post, like } = $props();

	let likes = $derived(post.likes);

	async function onclick() {
		// increment the `likes` count immediately...
		likes += 1;

		// and tell the server, which will eventually update `post`
		try {
			await like();
		} catch {
			// failed! roll back the change
			likes -= 1;
		}
	}
</script>

<button {onclick}>🧡 {likes}</button>
```


## Deriveds and reactivity

Unlike `$state`, which converts objects and arrays to [deeply reactive proxies]($state#Deep-state), `$derived` values are left as-is. 

## Update propagation

Svelte uses something called _push-pull reactivity_ — when state is updated, everything that depends on the state (whether directly or indirectly) is immediately notified of the change (the 'push'), but derived values are not re-evaluated until they are actually read (the 'pull').

If the new value of a derived is referentially identical to its previous value, downstream updates will be skipped. In other words, Svelte will only update the text inside the button when `large` changes, not when `count` changes, even though `large` depends on `count`:

```svelte
<script>
	let count = $state(0);
	let large = $derived(count > 10);
</script>

<button onclick={() => count++}>
	{large}
</button>
```

---

## $effect

Effects are functions that run when state updates, and can be used for things like calling third-party libraries, drawing on `<canvas>` elements, or making network requests. They only run in the browser, not during server-side rendering.

Generally speaking, you should _not_ update state inside effects, as it will make code more convoluted and will often lead to never-ending update cycles. If you find yourself doing so, see [when not to use `$effect`](#When-not-to-use-$effect) to learn about alternative approaches.

You can create an effect with the `$effect` rune.

```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');

	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);

		// this will re-run whenever `color` or `size` change
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

When Svelte runs an effect function, it tracks which pieces of state (and derived state) are accessed (unless accessed inside [`untrack`](svelte#untrack)), and re-runs the function when that state later changes.


### Understanding lifecycle

Your effects run after the component has been mounted to the DOM, and in a [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) after state changes. Re-runs are batched (i.e. changing `color` and `size` in the same moment won't cause two separate runs), and happen after any DOM updates have been applied.

You can use `$effect` anywhere, not just at the top level of a component, as long as it is called while a parent effect is running.


An effect can return a _teardown function_ which will run immediately before the effect re-runs.

```svelte
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		// This will be recreated whenever `milliseconds` changes
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => {
			// if a teardown function is provided, it will run
			// a) immediately before the effect re-runs
			// b) when the component is destroyed
			clearInterval(interval);
		};
	});
</script>

<h1>{count}</h1>

<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

Teardown functions also run when the effect is destroyed, which happens when its parent is destroyed (for example, a component is unmounted) or the parent effect re-runs.

### Understanding dependencies

`$effect` automatically picks up any reactive values (`$state`, `$derived`, `$props`) that are _synchronously_ read inside its function body (including indirectly, via function calls) and registers them as dependencies. When those dependencies change, the `$effect` schedules a re-run.

If `$state` and `$derived` are used directly inside the `$effect` (for example, during creation of a [reactive class](https://svelte.dev/docs/svelte/$state#Classes)), those values will _not_ be treated as dependencies.

Values that are read _asynchronously_ — after an `await` or inside a `setTimeout`, for example — will not be tracked. Here, the canvas will be repainted when `color` changes, but not when `size` changes.

```ts
// @filename: index.ts
declare let canvas: {
	width: number;
	height: number;
	getContext(type: '2d', options?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D;
};
declare let color: string;
declare let size: number;

//cut
$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	// this will re-run whenever `color` changes...
	context.fillStyle = color;

	setTimeout(() => {
		// ...but not when `size` changes
		context.fillRect(0, 0, size, size);
	}, 0);
});
```

An effect only reruns when the object it reads changes, not when a property inside it changes. (If you want to observe changes _inside_ an object at dev time, you can use [`$inspect`]($inspect).)

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	// this will run once, because `state` is never reassigned (only mutated)
	$effect(() => {
		state;
	});

	// this will run whenever `state.value` changes...
	$effect(() => {
		state.value;
	});

	// ...and so will this, because `derived` is a new object each time
	$effect(() => {
		derived;
	});
</script>

<button onclick={() => (state.value += 1)}>
	{state.value}
</button>

<p>{state.value} doubled is {derived.value}</p>
```

An effect only depends on the values that it read the last time it ran. This has interesting implications for effects that have conditional code.

For instance, if `condition` is `true` in the code snippet below, the code inside the `if` block will run and `color` will be evaluated. As such, changes to either `condition` or `color` will cause the effect to re-run.

Conversely, if `condition` is `false`, `color` will not be evaluated, and the effect will _only_ re-run again when `condition` changes.

```ts
// @filename: ambient.d.ts
declare module 'canvas-confetti' {
	interface ConfettiOptions {
		colors: string[];
	}

	function confetti(opts?: ConfettiOptions): void;
	export default confetti;
}

// @filename: index.js
//cut
import confetti from 'canvas-confetti';

let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
	if (condition) {
		confetti({ colors: [color] });
	} else {
		confetti();
	}
});
```

## `$effect.pre`

In rare cases, you may need to run code _before_ the DOM updates. For this we can use the `$effect.pre` rune:

```svelte
<script>
	import { tick } from 'svelte';

	let div = $state();
	let messages = $state([]);

	// ...

	$effect.pre(() => {
		if (!div) return; // not yet mounted

		// reference `messages` array length so that this code re-runs whenever it changes
		messages.length;

		// autoscroll when new messages are added
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

Apart from the timing, `$effect.pre` works exactly like `$effect`.

## `$effect.tracking`

The `$effect.tracking` rune is an advanced feature that tells you whether or not the code is running inside a tracking context, such as an effect or inside your template.

```svelte
<script>
	console.log('in component setup:', $effect.tracking()); // false

	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

It is used to implement abstractions like `createSubscriber`, which will create listeners to update reactive values but _only_ if those values are being tracked (rather than, for example, read inside an event handler).

## `$effect.root`

The `$effect.root` rune is an advanced feature that creates a non-tracked scope that doesn't auto-cleanup. This is useful for nested effects that you want to manually control. This rune also allows for the creation of effects outside of the component initialisation phase.

```js
const destroy = $effect.root(() => {
	$effect(() => {
		// setup
	});

	return () => {
		// cleanup
	};
});

// later...
destroy();
```

## When not to use `$effect`

In general, `$effect` is best considered something of an escape hatch — useful for things like analytics and direct DOM manipulation — rather than a tool you should use frequently. In particular, avoid using it to synchronise state. Instead of this...

```svelte
<script>
	let count = $state(0);
	let doubled = $state();

	// don't do this!
	$effect(() => {
		doubled = count * 2;
	});
</script>
```

...do this:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);
</script>
```


If you're using an effect because you want to be able to reassign the derived value (to build an optimistic UI, for example) note that [deriveds can be directly overridden]($derived#Overriding-derived-values) as of Svelte 5.25.

You might be tempted to do something convoluted with effects to link one value to another. The following example shows two inputs for "money spent" and "money left" that are connected to each other. If you update one, the other should update accordingly. Don't use effects for this.

```svelte
<script>
	let total = 100;
	let spent = $state(0);
	let left = $state(total);

	$effect(() => {
		left = total - spent;
	});

	$effect(() => {
		spent = total - left;
	});
</script>

<label>
	<input type="range" bind:value={spent} max={total} />
	{spent}/{total} spent
</label>

<label>
	<input type="range" bind:value={left} max={total} />
	{left}/{total} left
</label>
```

Instead, use `oninput` callbacks or — better still — [function bindings](bind#Function-bindings) where possible.

```svelte
<script>
	let total = 100;
	let spent = $state(0);
	let left = $state(total);

	function updateSpent(value) {
		spent = value;
		left = total - spent;
	}

	function updateLeft(value) {
		left = value;
		spent = total - left;
	}
</script>

<label>
	<input type="range" bind:value={() => spent, updateSpent} max={total} />
	{spent}/{total} spent
</label>

<label>
	<input type="range" bind:value={() => left, updateLeft} max={total} />
	{left}/{total} left
</label>
```

If you absolutely have to update `$state` within an effect and run into an infinite loop because you read and write to the same `$state`, use [untrack](svelte#untrack).

---

## $props

The inputs to a component are referred to as _props_, which is short for _properties_. You pass props to components just like you pass attributes to elements:

```svelte
<!file: App.svelte>
<script>
	import MyComponent from './MyComponent.svelte';
</script>

<MyComponent adjective="cool" />
```

On the other side, inside `MyComponent.svelte`, we can receive props with the `$props` rune...

```svelte
<!file: MyComponent.svelte>
<script>
	let props = $props();
</script>

<p>this component is {props.adjective}</p>
```

...though more commonly, you'll [_destructure_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) your props:

```svelte
<!file: MyComponent.svelte>
<script>
	let{ adjective }= $props();
</script>

<p>this component is {adjective}</p>
```

## Fallback values

Destructuring allows us to declare fallback values, which are used if the parent component does not set a given prop:

```js
let { adjective = 'happy' } = $props();
```


## Renaming props

We can also use the destructuring assignment to rename props, which is necessary if they're invalid identifiers, or a JavaScript keyword like `super`:

```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

## Rest props

Finally, we can use a _rest property_ to get, well, the rest of the props:

```js
let { a, b, c, ...others } = $props();
```

## Updating props

References to a prop inside a component update when the prop itself updates — when `count` changes in `App.svelte`, it will also change inside `Child.svelte`. But the child component is able to temporarily override the prop value, which can be useful for unsaved ephemeral state.

```svelte
<!file: App.svelte>
<script>
	import Child from './Child.svelte';

	let count = $state(0);
</script>

<button onclick={() => (count += 1)}>
	clicks (parent): {count}
</button>

<Child {count} />
```

```svelte
<!file: Child.svelte>
<script>
	let { count } = $props();
</script>

<button onclick={() => (count += 1)}>
	clicks (child): {count}
</button>
```

While you can temporarily _reassign_ props, you should not _mutate_ props unless they are [bindable]($bindable).

If the prop is a regular object, the mutation will have no effect.

```svelte
<!file: App.svelte>
<script>
	import Child from './Child.svelte';
</script>

<Child object={{ count: 0 }} />
```

```svelte
<!file: Child.svelte>
<script>
	let { object } = $props();
</script>

<button onclick={() => {
	// has no effect
	object.count += 1
}}>
	clicks: {object.count}
</button>
```

If the prop is a reactive state proxy, however, then mutations _will_ have an effect but you will see an `ownership_invalid_mutation` warning, because the component is mutating state that does not 'belong' to it.

```svelte
<!file: App.svelte>
<script>
	import Child from './Child.svelte';

	let object = $state({count: 0});
</script>

<Child {object} />
```

```svelte
<!file: Child.svelte>
<script>
	let { object } = $props();
</script>

<button onclick={() => {
	// will cause the count below to update,
	// but with a warning. Don't mutate
	// objects you don't own!
	object.count += 1
}}>
	clicks: {object.count}
</button>
```

The fallback value of a prop not declared with `$bindable` is left untouched — it is not turned into a reactive state proxy — meaning mutations will not cause updates.

```svelte
<!file: Child.svelte>
<script>
	let { object = { count: 0 } } = $props();
</script>

<button onclick={() => {
	// has no effect if the fallback value is used
	object.count += 1
}}>
	clicks: {object.count}
</button>
```

In summary: don't mutate props. Either use callback props to communicate changes, or — if parent and child should share the same object — use the [`$bindable`]($bindable) rune.

## Type safety

You can add type safety to your components by annotating your props, as you would with any other variable declaration. In TypeScript that might look like this...

```svelte
<script lang="ts">
	let { adjective }: { adjective: string } = $props();
</script>
```

...while in JSDoc you can do this:

```svelte
<script>
	/** @type {{ adjective: string }} */
	let { adjective } = $props();
</script>
```

You can, of course, separate the type declaration from the annotation:

```svelte
<script lang="ts">
	interface Props {
		adjective: string;
	}

	let { adjective }: Props = $props();
</script>
```


Adding types is recommended, as it ensures that people using your component can easily discover which props they should provide.


## `$props.id()`

This rune, added in version 5.20.0, generates an ID that is unique to the current component instance. When hydrating a server-rendered component, the value will be consistent between server and client.

This is useful for linking elements via attributes like `for` and `aria-labelledby`.

```svelte
<script>
	const uid = $props.id();
</script>

<form>
	<label for="{uid}-firstname">First Name: </label>
	<input id="{uid}-firstname" type="text" />

	<label for="{uid}-lastname">Last Name: </label>
	<input id="{uid}-lastname" type="text" />
</form>