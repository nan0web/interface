/**
 * @typedef {Object} InputMessage
 * @property {string|null} value - Ввід користувача
 * @property {boolean} waiting
 * @property {string[]} options
 * @property {number} time
 * @property {boolean} [escaped] - Скасовано?
 */

/**
 * @typedef {Object} OutputMessage
 * @property {string[]} content
 * @property {number} priority
 * @property {Object} meta
 * @property {Error|null} error
 */

/**
 * @typedef {Object} Interface
 * @property {() => Promise<InputMessage|null>} input - Запитання, що відбувається
 * @property {(msg: OutputMessage) => void} output - Повідомлення про дію
 * @property {() => boolean} ready - Чи можна працювати?
 * @property {() => void} stop - Скасування, не як «вихід», а як «я завершив»
 */

/**
 * @typedef {Object} Protocol
 * @method {(input: InputMessage) => Promise<OutputMessage | null>} process
 * @method {(input: InputMessage) => boolean} accepts
 */

class InterfaceCore {
	/**
	 * @param {Interface} implementation
	 */
	constructor(implementation) {
		this._impl = implementation
		this._protocols = new Map()
	}

	/**
	 * Зареєструвати як дія, що приймається
	 * @param {Protocol} protocol
	 */
	register(protocol) {
		// Перевіряємо, що є `accepts`
		if (typeof protocol.accepts !== 'function') {
			throw new Error('Protocol must have .accepts(input)')
		}
		// Перевіряємо, що є `process`
		if (typeof protocol.process !== 'function') {
			throw new Error('Protocol must have .process(input)')
		}
		const name = protocol.constructor.name || 'Anonymous'
		this._protocols.set(name, protocol)
		return this
	}

	async input() {
		return this._impl.input()
	}

	output(msg) {
		return this._impl.output(msg)
	}

	ready() {
		return this._impl.ready()
	}

	stop() {
		return this._impl.stop()
	}

	/**
	 * Головна дія: прийняти вхід, знайти протокол, повернути результат
	 * @returns {Promise<'done' | 'idle'>}
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
				content: ['Не визначена дія.', '', 'Введіть команду, або "exit" для виходу.'],
				priority: 0,
				meta: { type: 'help' },
				error: null
			})
		}

		return 'idle'
	}

	/**
	 * Почати цикл обробки
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

export default InterfaceCore
