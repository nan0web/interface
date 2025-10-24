import { describe, it, before, beforeEach } from "node:test"
import assert from "node:assert/strict"
import { Readable } from "node:stream"
import FS from "@nan0web/db-fs"
import { NoConsole } from "@nan0web/log"
import {
	DocsParser,
	DatasetParser,
} from "@nan0web/test"
import {
	createCLIInterface,
	CLIInterface,
	InterfaceCore,
} from "./index.js"

const fs = new FS()
/**
 * Load package manifest once.
 */
let pkg

before(async () => {
	pkg = await fs.loadDocument("package.json", {})
})

let console

beforeEach(() => {
	console = new NoConsole()
})

/**
 * Core test suite that doubles as source for README generation.
 *
 * Block comments (` ... `) inside each `it` are extracted by DocsParser
 * to produce the final markdown document.
 */
function testRender() {
	/**
	 * @docs
	 * # @nan0web/interface
	 *
	 * The *interface* package provides a thin abstraction layer for building
	 * interactive command‑line tools. It ships with:
	 *
	 * - `CLIInterface` – low‑level I/O wrapper.
	 * - `InterfaceCore` – protocol dispatcher.
	 * - `createCLIInterface` – factory that returns a ready‑to‑use core.
	 *
	 * <!-- %PACKAGE_STATUS% -->
	 *
	 * ## Installation
	 */
	it("How to install with npm?", () => {
		/**
		 * ```bash
		 * npm install @nan0web/interface
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/interface")
	})
	/**
	 * @docs
	 */
	it("How to install with pnpm?", () => {
		/**
		 * ```bash
		 * pnpm add @nan0web/interface
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/interface")
	})
	/**
	 * @docs
	 */
	it("How to install with yarn?", () => {
		/**
		 * ```bash
		 * yarn add @nan0web/interface
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/interface")
	})

	/**
	 * @docs
	 * ## Basic usage of CLIInterface
	 *
	 * The class can be instantiated with custom streams.
	 */
	it("How to create a CLIInterface with mocked streams?", () => {
		//import { CLIInterface } from "@nan0web/interface"
		const stdin = new Readable({
			read() {
				this.push("example\n")
				this.push(null)
			},
		})
		const stdout = { writable: true }
		const cli = new CLIInterface({ stdin, stdout, logger: console })
		assert.ok(cli.ready())
		assert.ok(cli.stdin === stdin)
		assert.ok(cli.stdout === stdout)
	})
	/**
	 * @docs
	 * ## Output handling
	 *
	 * `output` forwards messages to the provided logger.
	 */
	it("How does CLIInterface output normal, warning and critical messages?", () => {
		//import { CLIInterface } from "@nan0web/interface"
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
		assert.deepStrictEqual(console.output()[0][1], "normal msg")
		assert.deepStrictEqual(console.output()[1][1], "warn msg")
		assert.deepStrictEqual(console.output()[2][1], "FATAL:")
		assert.deepStrictEqual(console.output()[2][2], "fatal msg")
	})

	/**
	 * @docs
	 * ## Factory helper
	 *
	 * `createCLIInterface` returns an `InterfaceCore` instance that already wraps a `CLIInterface`.
	 */
	it("How to obtain an InterfaceCore via the factory?", () => {
		//import { createCLIInterface, InterfaceCore } from "@nan0web/interface"
		const core = createCLIInterface()
		assert.ok(core instanceof InterfaceCore)
		assert.ok(typeof core.input === "function")
		assert.ok(typeof core.output === "function")
	})

	/**
	 * @docs
	 * ## Registering a simple protocol
	 *
	 * Demonstrates how a protocol can be added to the core.
	 */
	it("How to register a trivial echo protocol and process input?", async () => {
		//import { InterfaceCore } from "@nan0web/interface"
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
		assert.deepStrictEqual(console.output(), [
			["info", "idle"]
		])
	})

	/**
	 * @docs
	 * ## API overview
	 *
	 * The package exports the following symbols:
	 *
	 * - `createCLIInterface(config)` – factory returning a ready core.
	 * - `CLIInterface` – low‑level I/O implementation.
	 * - `InterfaceCore` – protocol manager.
	 */
	it("All exported symbols should be present", () => {
		assert.ok(createCLIInterface)
		assert.ok(CLIInterface)
		assert.ok(InterfaceCore)
	})

	/**
	 * @docs
	 * ## TypeScript declarations
	 *
	 * The `types` field points to the generated declaration file.
	 */
	it("Uses .d.ts for autocomplete", () => {
		assert.equal(pkg.types, "./types/index.d.ts")
	})

	/**
	 * @docs
	 * ## Contributing
	 */
	it("How to contribute? - [check here](./CONTRIBUTING.md)", async () => {
		assert.equal(pkg.scripts?.precommit, "npm test")
		assert.equal(pkg.scripts?.prepush, "npm test")
		assert.equal(pkg.scripts?.prepare, "husky")
		const text = await fs.loadDocument("CONTRIBUTING.md")
		const str = String(text)
		assert.ok(str.includes("# Contributing"))
	})

	/**
	 * @docs
	 * ## License
	 */
	it("How to license ISC? - [check here](./LICENSE)", async () => {
		/** @docs */
		const text = await fs.loadDocument("LICENSE")
		assert.ok(String(text).includes("ISC"))
	})
}

/* Run the test suite that also renders the documentation */
describe("README.md testing", testRender)

describe("Rendering README.md", async () => {
	let text = ""
	const format = new Intl.NumberFormat("en-US").format
	const parser = new DocsParser()
	text = String(parser.decode(testRender))
	await fs.saveDocument("README.md", text)
	const dataset = DatasetParser.parse(text, pkg.name)
	await fs.saveDocument(".datasets/README.dataset.jsonl", dataset)

	it(`document is rendered in README.md [${format(Buffer.byteLength(text))}b]`, async () => {
		const text = await fs.loadDocument("README.md")
		assert.ok(text.includes("## License"))
	})
})
