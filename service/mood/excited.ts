export enum EExciteVolume {
    MILD = 'mild',
}

export const addExcitement = (source: string, volume: EExciteVolume) => {
    return source + `
character is excited because he has his birthday and he got great present from his sister
    `
}