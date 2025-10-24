export default function createCLIInterface(config: any): InterfaceCore;
export class CLIInterface {
    /**
     * @param {object} input
     * @param {Logger} [input.logger]
     * @param {NodeJS.ReadStream} [input.stdin]
     * @param {NodeJS.WriteStream} [input.stdout]
     */
    constructor({ logger, stdin, stdout }?: {
        logger?: Logger | undefined;
        stdin?: NodeJS.ReadStream | undefined;
        stdout?: NodeJS.WriteStream | undefined;
    });
    logger: Logger;
    stdin: NodeJS.ReadStream;
    stdout: NodeJS.WriteStream;
    _ready: boolean;
    ready(): boolean;
    input(): Promise<any>;
    output(msg: any): void;
    stop(): void;
}
import InterfaceCore from '../core/index.js';
import { Logger } from '@nan0web/log';
