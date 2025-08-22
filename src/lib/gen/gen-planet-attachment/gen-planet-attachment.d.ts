import { HomebrewModuleType, PlanetAttachmentSchemaType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";
/**
 * Create planet attachment tokens.
 *
 * Input: prebuild/token/attachment/planet/*.jpg
 *
 * Output:
 * - assets/Templates/token/attachment/planet/*.json
 * - assets/Textures/token/attachment/planet/*.jpg
 */
export declare class GenPlanetAttachment extends AbstractGen {
    constructor(homebrew: HomebrewModuleType);
    generate(errors: Array<string>): Promise<void>;
    _generateModels(): void;
    _generateToken(planetAttachmentSchema: PlanetAttachmentSchemaType, errors: Array<string>): void;
}
