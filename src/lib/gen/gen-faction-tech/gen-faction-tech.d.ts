import { HomebrewModuleType, TechSchemaType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
export declare class GenFactionTech extends AbstractGen {
    private readonly _techNsidNameToColor;
    constructor(homebrew: HomebrewModuleType);
    loadTechColors(techs: Array<TechSchemaType>): void;
    generate(errors: Array<string>): Promise<void>;
}
