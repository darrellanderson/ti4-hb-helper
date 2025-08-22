import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen";
import { GenCards } from "../gen-cards";
import { GenFactionBreakthrough } from "../gen-faction-breakthrough";
import { GenFactionLeaders } from "../gen-faction-leaders";
import { GenFactionPromissory } from "../gen-faction-promissory";
import { GenFactionSheet } from "../gen-faction-sheet";
import { GenFactionTech } from "../gen-faction-tech";
import { GenInject } from "../gen-inject/gen-inject";
import { GenPlanetAttachment } from "../gen-planet-attachment";
import { GenPlanetCards } from "../gen-planet-cards";
import { GenSystemAttachment } from "../gen-system-attachment";
import { GenSystems } from "../gen-systems";

export class GenAll extends AbstractGen {
  private readonly _gens: Array<AbstractGen>;

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
    this._gens = [
      new GenCards(homebrew),
      new GenFactionBreakthrough(homebrew),
      new GenFactionLeaders(homebrew),
      new GenFactionPromissory(homebrew),
      new GenFactionSheet(homebrew),
      new GenFactionTech(homebrew),
      new GenInject(homebrew),
      new GenPlanetAttachment(homebrew),
      new GenPlanetCards(homebrew),
      new GenSystemAttachment(homebrew),
      new GenSystems(homebrew),
    ];
  }

  async generate(errors: Array<string>): Promise<void> {
    for (const gen of this._gens) {
      gen.setPrebuildDir(this.getPrebuildDir());
      await gen.generate(errors);
    }
  }
}
