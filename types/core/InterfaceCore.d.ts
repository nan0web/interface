export default InterfaceCore;
export type InputMessage = {
    /**
     * - Ввід користувача
     */
    value: string | null;
    waiting: boolean;
    options: string[];
    time: number;
    /**
     * - Скасовано?
     */
    escaped?: boolean | undefined;
};
export type OutputMessage = {
    content: string[];
    priority: number;
    meta: any;
    error: Error | null;
};
export type Interface = {
    /**
     * - Запитання, що відбувається
     */
    input: () => Promise<InputMessage | null>;
    /**
     * - Повідомлення про дію
     */
    output: (msg: OutputMessage) => void;
    /**
     * - Чи можна працювати?
     */
    ready: () => boolean;
    /**
     * - Скасування, не як «вихід», а як «я завершив»
     */
    stop: () => void;
};
export type Protocol = any;
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
declare class InterfaceCore {
    /**
     * @param {Interface} implementation
     */
    constructor(implementation: Interface);
    _impl: Interface;
    _protocols: Map<any, any>;
    /**
     * Зареєструвати як дія, що приймається
     * @param {Protocol} protocol
     */
    register(protocol: Protocol): this;
    input(): Promise<InputMessage | null>;
    output(msg: any): void;
    ready(): boolean;
    stop(): void;
    /**
     * Головна дія: прийняти вхід, знайти протокол, повернути результат
     * @returns {Promise<'done' | 'idle'>}
     */
    step(): Promise<'done' | 'idle'>;
    /**
     * Почати цикл обробки
     * @returns {Promise<void>}
     */
    loop(): Promise<void>;
}
