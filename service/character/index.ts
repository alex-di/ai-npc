import { ICharacter } from '../../core/character.interface';
import { IHistory } from '../../core/history.interface';
import { History } from '../../models/history.model';
import dbConnect from '../../utils/dbConnect';
import characters from './data/chars.json';

dbConnect();
export const findCharacter = (id: string): ICharacter => {
    console.log('(findCharacter)', {id})
    return characters.find(({ id: charId }) => {
        console.log({ id, charId })
        return charId === id});
}

export const getCharacters = (): ICharacter[] => {
    return characters
}

export const getHistory = async ({ playerId, characterId }: {playerId: string, characterId: string}) => {
    // @ts-ignore
    return await History.find({characterId, playerId } ).limit(100).sort({ createdAt: -1 });
}
export const saveHistory = async (input: Omit<IHistory, '_id'>) => {
    const h = new History( input );
    return h.save()
}