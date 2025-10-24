import createCLIInterface, { CLIInterface } from "./cli/index.js"
import InterfaceCore from "./core/index.js"
import {
	InputMessage,
	OutputMessage,
	Interface,
	Protocol,
} from "./types.js"

/**
 * Public API entry point for the @nan0web/interface package.
 *
 * @module API
 */
export {
	createCLIInterface,
	CLIInterface,
	InterfaceCore,
	// Types
	InputMessage,
	OutputMessage,
	Interface,
	Protocol,
}