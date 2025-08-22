import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen";
/**
 * Create the inject.js file.
 *
 * We cannot use the given "homebrew" because it maybe contain
 * script items that do not serialize.  Instead, copy the homebrew
 * definition from a known location.
 */
export declare class GenInject extends AbstractGen {
    constructor(homebrew: HomebrewModuleType);
    generate(errors: Array<string>): Promise<void>;
    _generateHomebrewFile(errors: Array<string>): void;
    _generateInjectFile(_errors: Array<string>): void;
}
