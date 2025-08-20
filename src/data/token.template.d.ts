export declare const TOKEN_TEMPLATE: {
    Type: string;
    GUID: string;
    Name: string;
    Metadata: string;
    CollisionType: string;
    Friction: number;
    Restitution: number;
    Density: number;
    SurfaceType: string;
    Roughness: number;
    Metallic: number;
    PrimaryColor: {
        R: number;
        G: number;
        B: number;
    };
    SecondaryColor: {
        R: number;
        G: number;
        B: number;
    };
    Flippable: boolean;
    AutoStraighten: boolean;
    ShouldSnap: boolean;
    ScriptName: string;
    Blueprint: string;
    Models: {
        Model: string;
        Offset: {
            X: number;
            Y: number;
            Z: number;
        };
        Scale: {
            X: number;
            Y: number;
            Z: number;
        };
        Rotation: {
            X: number;
            Y: number;
            Z: number;
        };
        Texture: string;
        NormalMap: string;
        ExtraMap: string;
        IsTransparent: boolean;
        CastShadow: boolean;
        UseOverrides: boolean;
        SurfaceType: string;
    }[];
    Collision: {
        Model: string;
        Offset: {
            X: number;
            Y: number;
            Z: number;
        };
        Scale: {
            X: number;
            Y: number;
            Z: number;
        };
        Rotation: {
            X: number;
            Y: number;
            Z: number;
        };
        Type: string;
    }[];
    Lights: never[];
    SnapPointsGlobal: boolean;
    SnapPoints: never[];
    ZoomViewDirection: {
        X: number;
        Y: number;
        Z: number;
    };
    GroundAccessibility: string;
    Tags: never[];
};
