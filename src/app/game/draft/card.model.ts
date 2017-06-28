export class Card {
    title: string;
    powers;

    constructor(title: string, powers: any) {
        this.title = title;
        this.powers = powers;
    }

    getPower(power: string): string {
        return this.powers[power];
    }
}