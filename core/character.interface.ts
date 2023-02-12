import { ActionTag } from "./action.interface";
import { MoodTag, RelationModifier, RelationTag } from "./tag.inteface";

/**
 * @swagger
 * components:
 *  schemas:
 *    Character:
 *      type: object
 *      properties: 
 *        id: 
 *          type: string
 *          description: Character ID
 *        name: 
 *          type: string
 *          description: Character name
 *        bio: 
 *          type: string
 *          description: Character background
 *        image: 
 *          type: string
 *          description: Character image
 *        relation:
 *          type: string
 *          enum: [Relative, Friend, Buddy, Contact, Stranger]
 */
export interface ICharacter {
    id: string
    name: string;
    bio: string;
    image?: string;
    relation: RelationTag;
    mood: MoodTag;
    dialogue: Record<string, IDialogue>
}


export interface IDialogue {
    setting: string;
    start: string;
    options: IDialogueOption[]
}

export interface IDialogueOption {
    mood: MoodTag;
    relation: RelationModifier;
    action: ActionTag;
    prompt: string;
}