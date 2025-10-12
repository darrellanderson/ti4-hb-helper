import {
  FactionSchemaType,
  HomebrewModuleType,
  PlanetAttachmentSchemaType,
  SystemAttachmentSchemaType,
  SystemSchemaType,
  TechSchemaType,
} from "ti4-ttpg-ts";

const factions: Array<FactionSchemaType> = [
  {
    name: "Test Faction",
    nsidName: "my-faction",
    abbr: "my-faction-abbr",
    abilities: ["my-ability"],
    breakthroughs: ["my-breakthrough"],
    commodities: 2,
    factionTechs: ["my-faction-tech-1", "my-faction-tech-2"],
    home: 998,
    leaders: {
      agents: ["my-agent"],
      commanders: ["my-commander"],
      heroes: ["my-hero"],
      mechs: ["my-mech"],
    },
    promissories: ["my-promissory"],
    startingTechs: ["my-starting-tech-1", "my-starting-tech-2"],
    startingUnits: {},
    unitOverrides: [],
    homeSurrogate: 999,
    extras: [{ nsid: "my-type:my-source/my-extra" }],
  },
];

const planetAttachments: Array<PlanetAttachmentSchemaType> = [
  {
    name: "My Planet Attachment",
    nsidName: "my-planet-attachment",
  },
  {
    name: "My Planet Attachment Face Down",
    nsidName: "my-planet-attachment-face-down",
    imgFaceDown: true,
  },
];

const systemAttachments: Array<SystemAttachmentSchemaType> = [
  {
    name: "My System Attachment",
    nsidName: "my-system-attachment",
  },
  {
    name: "My System Attachment Face Down",
    nsidName: "my-system-attachment-face-down",
    imgFaceDown: true,
  },
];

const systems: Array<SystemSchemaType> = [
  {
    tile: 998,
    class: "off-map",
    isHome: true,
    planets: [
      {
        name: "My Planet",
        nsidName: "my-planet",
      },
      {
        name: "My Legendary Planet",
        nsidName: "my-legendary-planet",
        isLegendary: true,
        legendaryNsidName: "my-legendary-planet",
      },
    ],
    planetsFaceDown: [
      {
        name: "My Planet Face Down",
        nsidName: "my-planet-face-down",
      },
    ],
  },

  {
    tile: 999, // home surrogate
    isExcludeFromDraft: true,
  },
];

const technologies: Array<TechSchemaType> = [
  {
    name: "My Technology 1",
    nsidName: "my-faction-tech-1",
    color: "blue",
    prerequisites: {},
    isFactionTech: true,
  },
  {
    name: "My Technology 2",
    nsidName: "my-faction-tech-2",
    color: "blue",
    prerequisites: {},
    isFactionTech: true,
  },
];

export const TestHomebrew: HomebrewModuleType = {
  sourceAndPackageId: { source: "my-source", packageId: "my-package-id" },
  factions,
  planetAttachments,
  systems,
  systemAttachments,
  technologies,
};
