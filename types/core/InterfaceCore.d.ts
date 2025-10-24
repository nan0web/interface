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
    constructor(implementation: Interface);
    _impl: Interface;
    _protocols: Map<any, any>;
    /**
     * Registers a protocol that can accept and process certain inputs.
     *
     * @param {Protocol} protocol - Protocol to register.
     * @throws {Error} If the protocol lacks required methods.
     * @returns {this}
     */
    register(protocol: Protocol): this;
    /**
     * Delegates input retrieval to the underlying implementation.
     *
     * @returns {Promise<InputMessage|null>}
     */
    input(): Promise<InputMessage | null>;
    /**
     * Delegates output emission to the underlying implementation.
     *
     * @param {OutputMessage} msg
     */
    output(msg: OutputMessage): void;
    /**
     * Checks if the underlying implementation is ready.
     *
     * @returns {boolean}
     */
    ready(): boolean;
    /**
     * Stops the underlying implementation.
     */
    stop(): void;
    /**
     * Main processing step: obtains input, finds a matching protocol, and emits output.
     *
     * @returns {Promise<'done'|'idle'>} - 'done' when finished, 'idle' when ready for next step.
     */
    step(): Promise<'done' | 'idle'>;
    /**
     * Runs a processing loop until the interface is no longer ready or a 'done' status is returned.
     *
     * @returns {Promise<void>}
     */
    loop(): Promise<void>;
}
export type InputMessage = {
    /**
     * - User input value.
     */
    value: string | null;
    /**
     * - Indicates if waiting for further input.
     */
    waiting: boolean;
    /**
     * - Available options for the user.
     */
    options: string[];
    /**
     * - Timestamp of the input.
     */
    time: number;
    /**
     * - true if the user signaled exit.
     */
    escaped?: boolean | undefined;
};
export type OutputMessage = {
    /**
     * - Lines of text to be displayed.
     */
    content: string[];
    /**
     * - Priority level (0 = normal, 10 = warning, 20 = critical).
     */
    priority: number;
    /**
     * - Additional metadata.
     */
    meta: any;
    /**
     * - Optional error object.
     */
    error: Error | null;
};
export type Interface = {
    /**
     * - Retrieves user input.
     */
    input: () => Promise<InputMessage | null>;
    /**
     * - Sends a message to the user.
     */
    output: (msg: OutputMessage) => void;
    /**
     * - Returns true if the interface can operate.
     */
    ready: () => boolean;
    /**
     * - Terminates the interface.
     */
    stop: () => void;
};
export type Protocol = {
    /**
     * - Handles a matching input.
     */
    process: (input: InputMessage) => Promise<OutputMessage | null>;
    /**
     * - Determines if the protocol should handle the input.
     */
    accepts: (input: InputMessage) => boolean;
};
