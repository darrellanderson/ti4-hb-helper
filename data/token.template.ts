export const TOKEN_TEMPLATE = {
  Type: "Generic",
  GUID: "", // hex string
  Name: "", // e.g. "Geoform"
  Metadata: "", // e.g. "token.attachment.system:pok/geoform",
  CollisionType: "Regular",
  Friction: 0.7,
  Restitution: 0.3,
  Density: 0.93,
  SurfaceType: "Cardboard",
  Roughness: 1,
  Metallic: 0,
  PrimaryColor: {
    R: 255,
    G: 255,
    B: 255,
  },
  SecondaryColor: {
    R: 0,
    G: 0,
    B: 0,
  },
  Flippable: true,
  AutoStraighten: false,
  ShouldSnap: false,
  ScriptName: "",
  Blueprint: "",
  Models: [
    {
      Model: "token/round.obj",
      Offset: {
        X: 0,
        Y: 0,
        Z: 0,
      },
      Scale: {
        X: 1,
        Y: 1,
        Z: 1,
      },
      Rotation: {
        X: 0,
        Y: 0,
        Z: 0,
      },
      Texture: "", // face, e.g. "token/attachment/system/pok/geoform.jpg",
      NormalMap: "",
      ExtraMap: "",
      IsTransparent: false,
      CastShadow: true,
      UseOverrides: true,
      SurfaceType: "Cardboard",
    },
    {
      Model: "token/round.obj",
      Offset: {
        X: 0,
        Y: 0,
        Z: 0,
      },
      Scale: {
        X: 1,
        Y: 1,
        Z: 1,
      },
      Rotation: {
        X: 180,
        Y: 0,
        Z: 0,
      },
      Texture: "", // back
      NormalMap: "",
      ExtraMap: "",
      IsTransparent: false,
      CastShadow: true,
      UseOverrides: true,
      SurfaceType: "Cardboard",
    },
  ],
  Collision: [
    {
      Model: "token/round.col.obj",
      Offset: {
        X: 0,
        Y: 0,
        Z: 0,
      },
      Scale: {
        X: 1,
        Y: 1,
        Z: 1,
      },
      Rotation: {
        X: 0,
        Y: 0,
        Z: 0,
      },
      Type: "Convex",
    },
  ],
  Lights: [],
  SnapPointsGlobal: false,
  SnapPoints: [],
  ZoomViewDirection: {
    X: 0,
    Y: 0,
    Z: 1,
  },
  GroundAccessibility: "ZoomAndContext",
  Tags: [],
};
