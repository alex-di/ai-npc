import {Decimal} from 'decimal.js';

import { ActionTag } from "../../core/action.interface";
import { ICharacter } from "../../core/character.interface";
import { IHistory } from "../../core/history.interface";
import { ITagInput, MoodTag, RelationModifier, RelationTag } from "../../core/tag.inteface";
import moodMap from '../data/mood.json';


const relationInNum = new Map([
    [0, RelationTag.Stranger],
    [1, RelationTag.Contact],
    [2, RelationTag.Buddy],
    [3, RelationTag.Friend],
    [4, RelationTag.Relative],
])

export const processTags = (inputTags: ITagInput, character: ICharacter,  history: IHistory[]): string => {

    const computedHistoryTags: Array<ITagInput & { action?: ActionTag }> = history.map(({ tags }) => {
        return {
            ...tags,
        }
    });
                
            
    console.log(computedHistoryTags)
    const preRes = computedHistoryTags.reduce((acc, { mood, action, relation }, idx, source) => {
        switch(relation) {
            case RelationModifier.Impair: 
                acc.relation = acc.relation.minus(new Decimal(0.7).div(source.length) )
                break;
            case RelationModifier.Improve: 
                acc.relation = acc.relation.plus(new Decimal(0.7).div(source.length) )
                break;
            default:
                break;
        }

        acc.mood[mood] = acc.mood[mood].add(new Decimal(1).div(idx || 1));
        return acc;
    }, { 
        relation: new Decimal(0), 
        mood: Object.values(MoodTag).reduce((o, m) => {
            o[m] = new Decimal(m === character.mood ? 1.5 : 0)
            return o;
        }, {} as Record<MoodTag, Decimal>)
    })


    console.log({preRes})
    
    const result = {
        mood: Object.entries(preRes.mood).sort(([, numA], [, numB]) => numB.minus(numA).toNumber())[0][0] || character.mood,
        relation: relationInNum.get(preRes.relation.round().toNumber()) || character.relation,
    }

    console.log(`(processTags) relation: ${result.relation}, mood: ${result.mood}`)
    return moodMap[result.relation][result.mood];
}