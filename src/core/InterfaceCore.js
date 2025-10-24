/**
 * @typedef {Object} InputMessage
 * @property {string|null} value - User input value.
 * @property {boolean} waiting - Indicates if waiting for further input.
 * @property {string[]} options - Available options for the user.
 * @property {number} time - Timestamp of the input.
 * @property {boolean} [escaped] - true if the user signaled exit.
 */

/**
 * @typedef {Object} OutputMessage
 * @property {string[]} content - Lines of text to be displayed.
 * @property {number} priority - Priority level (0 = normal, 10 = warning, 20 = critical).
 * @property {Object} meta - Additional metadata.
 * @property {Error|null} error - Optional error object.
 */

/**
 * @typedef {Object} Interface
 * @property {() => Promise<InputMessage|null>} input - Retrieves user input.
 * @property {(msg: OutputMessage) => void} output - Sends a message to the user.
 * @property {() => boolean} ready - Returns true if the interface can operate.
 * @property {() => void} stop - Terminates the interface.
 */

/**
 * @typedef {Object} Protocol
 * @property {(input: InputMessage) => Promise<OutputMessage|null>} process - Handles a matching input.
 * @property {(input: InputMessage) => boolean} accepts - Determines if the protocol should handle the input.
 */

/**
 * Core class that orchestrates input handling, protocol dispatch, and output emission.
 *
 * @class
 * @param {Interface} implementation - The concrete interface implementation.
 */
export default class InterfaceCore {
	/**
	 * @param {Interface} implementation
	 */
	constructor(implementation) {
		this._impl = implementation
		this._protocols = new Map()
	}

	/**
	 * Registers a protocol that can accept and process certain inputs.
	 *
	 * @param {Protocol} protocol - Protocol to register.
	 * @throws {Error} If the protocol lacks required methods.
	 * @returns {this}
	 */
	register(protocol) {
		if (typeof protocol.accepts !== 'function') {
			throw new Error('Protocol must have .accepts(input)')
		}
		if (typeof protocol.process !== 'function') {
			throw new Error('Protocol must have .process(input)')
		}
		const name = protocol.constructor.name || 'Anonymous'
		this._protocols.set(name, protocol)
		return this
	}

	/**
	 * Delegates input retrieval to the underlying implementation.
	 *
	 * @returns {Promise<InputMessage|null>}
	 */
	async input() {
		return this._impl.input()
	}

	/**
	 * Delegates output emission to the underlying implementation.
	 *
	 * @param {OutputMessage} msg
	 */
	output(msg) {
		return this._impl.output(msg)
	}

	/**
	 * Checks if the underlying implementation is ready.
	 *
	 * @returns {boolean}
	 */
	ready() {
		return this._impl.ready()
	}

	/**
	 * Stops the underlying implementation.
	 */
	stop() {
		return this._impl.stop()
	}

	/**
	 * Main processing step: obtains input, finds a matching protocol, and emits output.
	 *
	 * @returns {Promise<'done'|'idle'>} - 'done' when finished, 'idle' when ready for next step.
	 */
	async step() {
		if (!this.ready()) return 'done'

		const input = await this.input()
		if (!input) {
			this.stop()
			return 'done'
		}

		const message = {
			value: input.value,
			time: input.time || Date.now(),
			options: input.options || [],
			escaped: input.escaped === true
		}

		let handled = false
		for (const protocol of this._protocols.values()) {
			if (protocol.accepts(message)) {
				const output = await protocol.process(message)
				if (output) {
					this.output(output)
				}
				handled = true
				break
			}
		}

		if (!handled) {
			this.output({
				content: ['Undefined action.', '', 'Enter a command, or "exit" to quit.'],
				priority: 0,
				meta: { type: 'help' },
				error: null
			})
		}

		return 'idle'
	}

	/**
	 * Runs a processing loop until the interface is no longer ready or a 'done' status is returned.
	 *
	 * @returns {Promise<void>}
	 */
	async loop() {
		while (this.ready()) {
			const status = await this.step()
			if (status === 'done') {
				break
			}
			await new Promise(r => setTimeout(r, 10))
		}
	}
}
