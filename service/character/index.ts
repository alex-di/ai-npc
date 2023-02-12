import { ICharacter } from '../../core/character.interface';
import { IHistory } from '../../core/history.interface';
import { MoodTag, RelationTag } from '../../core/tag.inteface';
import { History } from '../../models/history.model';
import dbConnect from '../../utils/dbConnect';
import characters from '../data/chars.json';
import {dialogues} from '../data/dialogues'

dbConnect();
export const findCharacter = (id: string): ICharacter => {
    console.log('(findCharacter)', {id})
    const base = characters.find(({ id: charId }) => {
        console.log({ id, charId })
        return charId === id
    });

    return {
        mood: MoodTag.Anxious,
        ...base,
        dialogue: dialogues[id],
        relation: base.relation as RelationTag,
    }
}

export const getCharacters = (): ICharacter[] => {
    return characters.map((char) => ({
        mood: MoodTag.Anxious,
        ...char,
        relation: char.relation as RelationTag,
        dialogue: dialogues[char.id],
    }))
}

export const getHistory = async ({ playerId, characterId }: {playerId: string, characterId: string}) => {
    // @ts-ignore
    return await History.find({characterId, playerId } ).limit(100).sort({ createdAt: -1 });
}
export const saveHistory = async (input: Omit<IHistory, '_id'>) => {
    const h = new History( input );
    return h.save()
}