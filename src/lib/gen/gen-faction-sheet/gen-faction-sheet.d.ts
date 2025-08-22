import { FactionSchemaType, HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
export declare class GenFactionSheet extends AbstractGen {
    constructor(homebrew: HomebrewModuleType);
    generate(errors: Array<string>): Promise<void>;
    _generateOne(faction: FactionSchemaType, errors: Array<string>): Promise<void>;
}
