export enum ESadVolume {
    MILD = 'mild',
}

export const addSadness = (source: string, volume: ESadVolume) => {
    return source + `
character is sad because he lost his dog
    `
}