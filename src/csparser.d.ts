declare module "csparser"

interface IPosition {
    line: number;
    column: number;
    offset: number;
}

interface ILocation {
    start: IPosition;
    end: IPosition;
}

export interface PeggySyntaxError {
    message: string;
    location: ILocation;
}