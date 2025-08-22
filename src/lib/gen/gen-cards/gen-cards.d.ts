import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
/**
 * Cards directly linked to factions (e.g. leader suite)
 * are generated using that data, so any kruft cards do
 * not get added.
 *
 * This generator is for other cards types that cannot be
 * inferred otherwise (e.g. action cards).
 */
export declare class GenCards extends AbstractGen {
    constructor(homebrew: HomebrewModuleType);
    generate(errors: Array<string>): Promise<void>;
}
