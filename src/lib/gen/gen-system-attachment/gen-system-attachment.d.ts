import { HomebrewModuleType, SystemAttachmentSchemaType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
/**
 * Create system attachment tokens.
 *
 * Input: prebuild/token/attachment/system/*.jpg
 *
 * Output:
 * - assets/Templates/token/attachment/system/*.json
 * - assets/Textures/token/attachment/system/*.jpg
 */
export declare class GenSystemAttachment extends AbstractGen {
    constructor(homebrew: HomebrewModuleType);
    generate(errors: Array<string>): Promise<void>;
    _generateModels(): void;
    _generateToken(systemAttachmentSchema: SystemAttachmentSchemaType, errors: Array<string>): void;
}
