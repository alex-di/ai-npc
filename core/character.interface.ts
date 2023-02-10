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
 */
export interface ICharacter {
    id: string
    name: string;
    bio: string;
    image?: string;
}