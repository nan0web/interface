import { Logger } from '@nan0web/log'

/**
 * CLI interface implementation that provides the required methods for InterfaceCore.
 *
 * It does **not** extend InterfaceCore; instead it is passed to InterfaceCore
 * via the factory `createCLIInterface`.
 *
 * @class
 * @param {Object} [options] - Configuration options.
 * @param {Logger} [options.logger] - Logger instance (defaults to new Logger('info')).
 * @param {NodeJS.ReadStream} [options.stdin] - Input stream (defaults to process.stdin).
 * @param {NodeJS.WriteStream} [options.stdout] - Output stream (defaults to process.stdout).
 */
export default class CLIInterface {
	constructor({ logger = new Logger('info'), stdin = process.stdin, stdout = process.stdout } = {}) {
		this.logger = logger
		this.stdin = stdin
		this.stdout = stdout
		this._ready = true
	}

	/**
	 * Returns whether the interface is ready to process input and output.
	 *
	 * @returns {boolean}
	 */
	ready() {
		return this._ready && !this.stdin.destroyed && this.stdout.writable
	}

	/**
	 * Reads a line from the input stream.
	 *
	 * @returns {Promise<null|{value:string,waiting:boolean,options:Array<string>,time:number,escaped:boolean}>}
	 */
	async input() {
		return new Promise((resolve) => {
			const onData = (chunk) => {
				this.stdin.off('data', onData)
				const value = chunk.toString().trim()
				if (value === '') {
					resolve(null)
					return
				}
				resolve({
					value,
					waiting: false,
					options: [],
					time: Date.now(),
					escaped: value === 'exit' || value === 'quit'
				})
			}
			this.stdin.on('data', onData)
		})
	}

	/**
	 * Writes an output message to the logger.
	 *
	 * @param {Object} msg - OutputMessage object.
	 * @param {Array<string>} msg.content - Text lines to output.
	 * @param {number} msg.priority - Priority level (0 = normal, 10 = warning, 20 = critical).
	 * @param {Object} msg.meta - Additional metadata (unused here).
	 * @param {Error|null} msg.error - Optional error object.
	 */
	output(msg) {
		if (!msg || !this.ready()) return
		if (msg.error) {
			this.logger.error('[ERROR]', msg.error.message)
			return
		}
		switch (msg.priority) {
			case 10:
				this.logger.warn(...msg.content)
				break
			case 20:
				this.logger.error('FATAL:', ...msg.content)
				break
			default:
				this.logger.info(...msg.content)
		}
	}

	/**
	 * Stops the interface and logs the termination.
	 */
	stop() {
		this._ready = false
		this.logger.info('CLI: Session terminated by user.')
	}
}