import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen";
export declare class GenAll extends AbstractGen {
    private readonly _gens;
    constructor(homebrew: HomebrewModuleType);
    generate(errors: Array<string>): Promise<void>;
    writeOutputFiles(): void;
}
