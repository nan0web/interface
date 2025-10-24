import { describe, it } from 'node:test'
import assert from 'node:assert'

import createCLIInterface from './index.js'
import InterfaceCore from '../core/InterfaceCore.js'

describe('createCLIInterface factory', () => {
	it('should be a function', () => {
		assert.strictEqual(typeof createCLIInterface, 'function')
	})

	it('should create an InterfaceCore instance wrapping a CLIInterface', () => {
		const core = createCLIInterface()
		assert.ok(core instanceof InterfaceCore)
		// basic contract checks
		assert.strictEqual(typeof core.input, 'function')
		assert.strictEqual(typeof core.output, 'function')
		assert.strictEqual(typeof core.ready, 'function')
		assert.strictEqual(typeof core.stop, 'function')
	})
})
