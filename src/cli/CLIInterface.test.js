import { describe, it } from 'node:test'
import assert from 'node:assert'

import CLIInterface from './CLIInterface.js'

describe('CLIInterface – construction', () => {
	it('should construct with default options without throwing', () => {
		const cli = new CLIInterface()
		assert.ok(cli)
		assert.ok(cli.logger)
		assert.ok(cli.stdin)
		assert.ok(cli.stdout)
		assert.strictEqual(cli._ready, true)
	})
})

describe('CLIInterface – output handling (mock logger)', () => {
	const logs = []
	const mockLogger = {
		info: (...args) => logs.push({ level: 'info', args }),
		warn: (...args) => logs.push({ level: 'warn', args }),
		error: (...args) => logs.push({ level: 'error', args })
	}
	const cli = new CLIInterface({ logger: mockLogger, stdin: { on: () => {}, off: () => {} }, stdout: { writable: true } })

	it('should log normal message with info level', () => {
		cli.output({
			content: ['hello'],
			priority: 0,
			meta: {},
			error: null
		})
		assert.strictEqual(logs.length, 1)
		assert.strictEqual(logs[0].level, 'info')
		assert.deepStrictEqual(logs[0].args, ['hello'])
		logs.length = 0
	})

	it('should log warning message with warn level', () => {
		cli.output({
			content: ['warn msg'],
			priority: 10,
			meta: {},
			error: null
		})
		assert.strictEqual(logs.length, 1)
		assert.strictEqual(logs[0].level, 'warn')
		assert.deepStrictEqual(logs[0].args, ['warn msg'])
		logs.length = 0
	})

	it('should log critical message with error level', () => {
		cli.output({
			content: ['fatal'],
			priority: 20,
			meta: {},
			error: null
		})
		assert.strictEqual(logs.length, 1)
		assert.strictEqual(logs[0].level, 'error')
		assert.deepStrictEqual(logs[0].args, ['FATAL:', 'fatal'])
		logs.length = 0
	})

	it('should log error object using logger.error', () => {
		const err = new Error('boom')
		cli.output({
			content: ['oops'],
			priority: 0,
			meta: {},
			error: err
		})
		assert.strictEqual(logs.length, 1)
		assert.strictEqual(logs[0].level, 'error')
		assert.deepStrictEqual(logs[0].args, ['[ERROR]', 'boom'])
	})
})