export enum EAngerVolume {
    MILD = 'mild',
}

export const addAnger = (source: string, volume: EAngerVolume) => {
    return source + `
character is not happy about some recent events
    `
}