declare module "csparser"

interface IPosition {
    line: number;
    column: number;
}

interface ILocation {
    start: IPosition;
}

export interface PeggySyntaxError {
    message: string;
    location: ILocation;
}