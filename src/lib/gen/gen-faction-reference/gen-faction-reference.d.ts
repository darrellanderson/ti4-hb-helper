import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
export declare class GenFactionReference extends AbstractGen {
    constructor(homebrew: HomebrewModuleType);
    generate(errors: Array<string>): Promise<void>;
}
