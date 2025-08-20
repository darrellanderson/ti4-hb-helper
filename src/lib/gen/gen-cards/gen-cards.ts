import { HomebrewModuleType } from "ti4-ttpg-ts-types";
import { AbstractGen } from "../abstract-gen/abstract-gen";

const CARD_TYPES_LANDSCAPE: Array<string> = ["technology"];

const CARD_TYPES_PORTRAIT: Array<string> = [
  "action",
  "agenda",
  "exploration-cultural",
  "exploration-hazardous",
  "exploration-frontier",
  "exploration-industrial",
  "objective-public-1",
  "objective-public-2",
  "objective-secret",
  "relic",
];

/**
 * Cards directly linked to factions (e.g. leader suite)
 * are generated using that data, so any kruft cards do
 * not get added.
 *
 * This generator is for other cards types that cannot be
 * inferred otherwise (e.g. action cards).
 */
export class GenCards extends AbstractGen {
  constructor(homebrew: HomebrewModuleType) {
    super(homebrew);
  }

  async generate(errors: Array<string>): Promise<void> {
    // TODO
  }
}
