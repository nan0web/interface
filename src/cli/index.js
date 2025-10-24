import InterfaceCore from '../core/index.js'
import { Logger } from '@nan0web/log'

export class CLIInterface {
	/**
	 * @param {object} input
	 * @param {Logger} [input.logger]
	 * @param {NodeJS.ReadStream} [input.stdin]
	 * @param {NodeJS.WriteStream} [input.stdout]
	 */
	constructor({ logger = new Logger('info'), stdin = process.stdin, stdout = process.stdout } = {}) {
		this.logger = logger
		this.stdin = stdin
		this.stdout = stdout
		this._ready = true
	}

	ready() {
		return this._ready && !this.stdin.destroyed && this.stdout.writable
	}

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

	output(msg) {
		if (!msg || !this.ready()) return
		if (msg.error) {
			this.logger.error('[ERROR]', msg.error.message)
			if (msg.content) this.logger.log(msg.content)
			return
		}

		switch (msg.priority) {
			case 10: // HIGH — критичне звернення
				this.logger.warn(...msg.content)
				break
			case 20: // CRITICAL
				this.logger.error('FATAL:', ...msg.content)
				break
			default:
				this.logger.info(...msg.content)
		}
	}

	stop() {
		this._ready = false
		this.logger.info('CLI: Сесія завершена користувачем.')
	}
}

export default function createCLIInterface(config) {
	return new InterfaceCore(new CLIInterface(config))
}
