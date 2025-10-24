/**
 * Factory function that creates an InterfaceCore instance wrapping a CLIInterface.
 *
 * @param {Object} config - Configuration passed to CLIInterface.
 * @returns {InterfaceCore}
 */
export default function createCLIInterface(config: any): InterfaceCore;
export { CLIInterface };
import InterfaceCore from '../core/index.js';
import CLIInterface from './CLIInterface.js';
