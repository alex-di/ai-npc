import { NextApiRequest, NextApiResponse } from 'next';
import joi from 'joi';
import { BaseError } from '../../../../core/errors';
import { getHistory } from '../../../../service/character';


const paramsValidator = joi.object<{
  id: string,
  playerId: string,
}>({
  id: joi.string().required().min(3),
  playerId: joi.string().required(),
}).required()

/**
 * @swagger
 * /api/characters/{id}/history:
 *   get:
 *     description: returns list of available characters
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         example: so-Secure)
 *       - in: path
 *         name: id   # Note the name is the same as in the path
 *         required: true
 *         example: baldis
 *         schema:
 *           type: string
 *         description: The character ID
 *       - in: query
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         example: abcd12-3423
 *         description: The player ID
 *     responses: 
 *       200:
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: object
 *                 properties: 
 *                   characterId: 
 *                     type: string
 *                     example: Character ID
 *                   playerId: 
 *                     type: string
 *                     example: Player Id
 *                   reply: 
 *                     type: string
 *                     example: Character reply for prompt
 *                   prompt: 
 *                     type: string
 *                     example: User prompt
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.headers['x-api-key'] !== 'so-Secure)') {
      return res.status(400).json({
        error: 'invalid auth'
      });
    }

    const { error, value } = paramsValidator.validate(req.query);

    if (error) {
      return res.status(400).json({
        error
      });
    }

    try {
      return res.json(await getHistory({ ...value, characterId: value.id}));
    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error instanceof BaseError && error.status) {
        console.error(error);
        res.status(error.status).json({ error: error.message });
      } else {
        console.error(`Error with request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
}
