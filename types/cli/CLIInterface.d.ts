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
    constructor({ logger, stdin, stdout }?: {
        logger?: Logger | undefined;
        stdin?: (NodeJS.ReadStream & {
            fd: 0;
        }) | undefined;
        stdout?: (NodeJS.WriteStream & {
            fd: 1;
        }) | undefined;
    });
    logger: Logger;
    stdin: NodeJS.ReadStream & {
        fd: 0;
    };
    stdout: NodeJS.WriteStream & {
        fd: 1;
    };
    _ready: boolean;
    /**
     * Returns whether the interface is ready to process input and output.
     *
     * @returns {boolean}
     */
    ready(): boolean;
    /**
     * Reads a line from the input stream.
     *
     * @returns {Promise<null|{value:string,waiting:boolean,options:Array<string>,time:number,escaped:boolean}>}
     */
    input(): Promise<null | {
        value: string;
        waiting: boolean;
        options: Array<string>;
        time: number;
        escaped: boolean;
    }>;
    /**
     * Writes an output message to the logger.
     *
     * @param {Object} msg - OutputMessage object.
     * @param {Array<string>} msg.content - Text lines to output.
     * @param {number} msg.priority - Priority level (0 = normal, 10 = warning, 20 = critical).
     * @param {Object} msg.meta - Additional metadata (unused here).
     * @param {Error|null} msg.error - Optional error object.
     */
    output(msg: {
        content: Array<string>;
        priority: number;
        meta: any;
        error: Error | null;
    }): void;
    /**
     * Stops the interface and logs the termination.
     */
    stop(): void;
}
import { Logger } from '@nan0web/log';
