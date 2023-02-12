export enum RelationModifier {
    Improve = 'Improve',
    Impair = 'Impair',
    Neutral = 'Neutral',
}

export enum RelationTag {
    Relative = 'Relative',
    Friend = 'Friend',
    Buddy = 'Buddy',
    Contact = 'Contact',
    Stranger = 'Stranger',
}


export enum MoodTag {
    Anger = 'Anger',
    Anxious = 'Anxious',
    Excited = 'Excited',
    Happy = 'Happy',
    Scared = 'Scared',
}


export interface ITagInput {
    mood: MoodTag,
    relation: RelationModifier,
}



export interface ITagResult {
    mood: MoodTag,
    relation: RelationTag,
}