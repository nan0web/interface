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
 * @property {Record<string, any>} meta - Additional metadata.
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
 * @property {(input: InputMessage) => boolean} accepts - Determines if the protocol should handle the input.
 * @property {(input: InputMessage) => Promise<OutputMessage|null>} process - Handles a matching input.
 */
/**
 * Runtime placeholders for type imports.
 * These objects are never used at runtime; they exist solely for TypeScript
 * declaration generation via JSDoc.
 */
export const InputMessage: {};
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
    meta: Record<string, any>;
    /**
     * - Optional error object.
     */
    error: Error | null;
};
export const OutputMessage: {};
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
export const Interface: {};
export type Protocol = {
    /**
     * - Determines if the protocol should handle the input.
     */
    accepts: (input: InputMessage) => boolean;
    /**
     * - Handles a matching input.
     */
    process: (input: InputMessage) => Promise<OutputMessage | null>;
};
export const Protocol: {};
