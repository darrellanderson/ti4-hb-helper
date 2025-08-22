import { HomebrewModuleType, SystemSchemaType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
export declare class GenSystems extends AbstractGen {
    constructor(homebrew: HomebrewModuleType);
    generate(errors: Array<string>): Promise<void>;
    _generateOne(system: SystemSchemaType, errors: Array<string>): Promise<void>;
    _generateModels(): void;
    _generateTemplate(system: SystemSchemaType): void;
    _generate1024(srcBuffer: Buffer, dst1024filename: string): Promise<void>;
    _generate512(srcBuffer: Buffer, dst512filename: string): Promise<void>;
}
