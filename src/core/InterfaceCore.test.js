import { describe, it } from 'node:test'
import assert from 'node:assert'

import InterfaceCore from './InterfaceCore.js'

/**
 * Minimal mock implementation used for testing InterfaceCore methods.
 */
class MockImpl {
	constructor () {
		this._ready = true
		this._output = null
		this._stopped = false
	}
	ready () { return this._ready }
	input () {
		// default input returns a simple message; can be overridden per test.
		return Promise.resolve({
			value: 'test',
			time: Date.now(),
			options: [],
			escaped: false
		})
	}
	output (msg) { this._output = msg }
	stop () { this._stopped = true }
}

/**
 * Simple protocol that accepts any input whose value equals a pre‑defined string.
 */
class EchoProtocol {
	constructor (trigger) {
		this._trigger = trigger
	}
	accepts (msg) { return msg.value === this._trigger }
	async process (msg) {
		return {
			content: ['echo:', msg.value],
			priority: 0,
			meta: {},
			error: null
		}
	}
}

describe('InterfaceCore – protocol registration', () => {
	it('should reject protocol without .accepts', () => {
		const core = new InterfaceCore(new MockImpl())
		const bad = { process: () => {} }
		assert.throws(() => core.register(bad), {
			message: 'Protocol must have .accepts(input)'
		})
	})

	it('should reject protocol without .process', () => {
		const core = new InterfaceCore(new MockImpl())
		const bad = { accepts: () => true }
		assert.throws(() => core.register(bad), {
			message: 'Protocol must have .process(input)'
		})
	})

	it('should store a valid protocol', () => {
		const core = new InterfaceCore(new MockImpl())
		const proto = new EchoProtocol('hello')
		core.register(proto)
		assert.ok(core._protocols.has('EchoProtocol'))
	})
})

describe('InterfaceCore – step processing', () => {
	it('should handle matched protocol and emit output', async () => {
		const impl = new MockImpl()
		impl.input = () => Promise.resolve({
			value: 'ping',
			time: Date.now(),
			options: [],
			escaped: false
		})
		const core = new InterfaceCore(impl)
		const proto = new EchoProtocol('ping')
		core.register(proto)

		const status = await core.step()
		assert.strictEqual(status, 'idle')
		assert.deepStrictEqual(impl._output, {
			content: ['echo:', 'ping'],
			priority: 0,
			meta: {},
			error: null
		})
	})

	it('should fallback to help message when no protocol matches', async () => {
		const impl = new MockImpl()
		impl.input = () => Promise.resolve({
			value: 'unknown',
			time: Date.now(),
			options: [],
			escaped: false
		})
		const core = new InterfaceCore(impl)
		// no protocols registered
		const status = await core.step()
		assert.strictEqual(status, 'idle')
		assert.ok(Array.isArray(impl._output.content))
		assert.ok(impl._output.content[0].includes('Undefined action'))
	})

	it('should stop when ready() returns false', async () => {
		const impl = new MockImpl()
		impl._ready = false
		const core = new InterfaceCore(impl)
		const status = await core.step()
		assert.strictEqual(status, 'done')
		assert.strictEqual(impl._stopped, false) // stop is called only when input null
	})

	it('should stop when input() returns null', async () => {
		const impl = new MockImpl()
		impl.input = () => Promise.resolve(null)
		const core = new InterfaceCore(impl)
		const status = await core.step()
		assert.strictEqual(status, 'done')
		assert.ok(impl._stopped)
	})
})

describe('InterfaceCore – loop control', () => {
	it('should iterate until ready becomes false', async () => {
		const impl = new MockImpl()
		let count = 0
		impl.input = () => {
			if (count++ < 2) {
				return Promise.resolve({
					value: 'loop',
					time: Date.now(),
					options: [],
					escaped: false
				})
			}
			return Promise.resolve(null) // end after two iterations
		}
		const core = new InterfaceCore(impl)
		const proto = new EchoProtocol('loop')
		core.register(proto)

		await core.loop()
		assert.strictEqual(count, 3) // two real inputs + final null
		assert.ok(impl._stopped)
	})
})
