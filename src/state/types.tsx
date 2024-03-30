
export interface Dictionary {
    [key: number]: { velocity: number, animating: boolean, transValue: number };
}

export type SharedData = {
    pageNumberGarage: number;
    pageNumberWinner: number;
    winner: number;
    carRaceState: Dictionary;
    cars: any[];
    totalCars: number;
};

