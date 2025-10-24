# @nan0web/interface

The *interface* package provides a thin abstraction layer for building
interactive command‑line tools. It ships with:

- `CLIInterface` – low‑level I/O wrapper.
- `InterfaceCore` – protocol dispatcher.
- `createCLIInterface` – factory that returns a ready‑to‑use core.

|[Status](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Documentation|Test coverage|Features|Npm version|
|---|---|---|---|---|
 |🟢 `98.4%` |🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/interface/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/interface/blob/main/docs/uk/README.md) |🟢 `92.3%` |✅ d.ts 📜 system.md 🕹️ playground |— |

## Installation

How to install with npm?
```bash
npm install @nan0web/interface
```

How to install with pnpm?
```bash
pnpm add @nan0web/interface
```

How to install with yarn?
```bash
yarn add @nan0web/interface
```

## Basic usage of CLIInterface

The class can be instantiated with custom streams.

How to create a CLIInterface with mocked streams?
```js
import { CLIInterface } from "@nan0web/interface"
const stdin = new Readable({
	read() {
		this.push("example\n")
		this.push(null)
	},
})
const stdout = { writable: true }
const cli = new CLIInterface({ stdin, stdout, logger: console })
```
## Output handling

`output` forwards messages to the provided logger.

How does CLIInterface output normal, warning and critical messages?
```js
import { CLIInterface } from "@nan0web/interface"
const cli = new CLIInterface({ logger: console })
cli.output({
	content: ["normal msg"],
	priority: 0,
	meta: {},
	error: null,
})
cli.output({
	content: ["warn msg"],
	priority: 10,
	meta: {},
	error: null,
})
cli.output({
	content: ["fatal msg"],
	priority: 20,
	meta: {},
	error: null,
})
```
## Factory helper

`createCLIInterface` returns an `InterfaceCore` instance that already wraps a `CLIInterface`.

How to obtain an InterfaceCore via the factory?
```js
import { createCLIInterface, InterfaceCore } from "@nan0web/interface"
const core = createCLIInterface()
```
## Registering a simple protocol

Demonstrates how a protocol can be added to the core.

How to register a trivial echo protocol and process input?
```js
import { InterfaceCore } from "@nan0web/interface"
class Echo {
	constructor(trigger) {
		this._trigger = trigger
	}
	accepts(msg) {
		return msg.value === this._trigger
	}
	async process(msg) {
		return {
			content: ["echo:", msg.value],
			priority: 0,
			meta: {},
			error: null,
		}
	}
}
const stdin = new Readable({
	read() {
		this.push("ping\n")
		this.push(null)
	},
})
const core = new InterfaceCore(new CLIInterface({ stdin, logger: console }))
core.register(new Echo("ping"))
const status = await core.step()
console.info(status) // ← idle
```
## API overview

The package exports the following symbols:

- `createCLIInterface(config)` – factory returning a ready core.
- `CLIInterface` – low‑level I/O implementation.
- `InterfaceCore` – protocol manager.

All exported symbols should be present

## TypeScript declarations

The `types` field points to the generated declaration file.

Uses .d.ts for autocomplete

## Contributing

How to contribute? - [check here](./CONTRIBUTING.md)

## License

How to license ISC? - [check here](./LICENSE)
