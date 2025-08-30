import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen";
import { GenCards } from "../gen-cards";
import { GenCmdCtrlTokens } from "../gen-cmd-ctrl-tokens";
import { GenFactionAlliance } from "../gen-faction-alliance";
import { GenFactionBreakthrough } from "../gen-faction-breakthrough";
import { GenFactionIcon } from "../gen-faction-icon";
import { GenFactionLeaders } from "../gen-faction-leaders";
import { GenFactionPromissory } from "../gen-faction-promissory";
import { GenFactionSheet } from "../gen-faction-sheet";
import { GenPlanetAttachment } from "../gen-planet-attachment";
import { GenPlanetCards } from "../gen-planet-cards";
import { GenSystemAttachment } from "../gen-system-attachment";
import { GenSystems } from "../gen-systems";
import { GenTech } from "../gen-tech/gen-tech";
import { GenFactionReference } from "../gen-faction-reference";

export class GenAll extends AbstractGen {
  private readonly _gens: Array<AbstractGen>;

  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
    this._gens = [
      new GenCards(homebrew),
      new GenCmdCtrlTokens(homebrew),
      new GenFactionAlliance(homebrew),
      new GenFactionBreakthrough(homebrew),
      new GenFactionIcon(homebrew),
      new GenFactionLeaders(homebrew),
      new GenFactionPromissory(homebrew),
      new GenFactionReference(homebrew),
      new GenFactionSheet(homebrew),
      new GenPlanetAttachment(homebrew),
      new GenPlanetCards(homebrew),
      new GenSystemAttachment(homebrew),
      new GenSystems(homebrew),
      new GenTech(homebrew),
    ];
  }

  async generate(errors: Array<string>): Promise<void> {
    for (const gen of this._gens) {
      gen.setPrebuildDir(this.getPrebuildDir());
      await gen.generate(errors);
    }
  }

  writeOutputFiles(): void {
    super.writeOutputFiles();
    for (const gen of this._gens) {
      gen.writeOutputFiles();
    }
  }
}
