import { NextApiRequest, NextApiResponse } from 'next';

import joi from 'joi';
import { BaseError } from '../../../core/errors';
import { getCharacters } from '../../../service/character';

const bodyValidator = joi.object<{
  prompt: string,
  player: string,
  tags: string,
}>({
  prompt: joi.string().required().min(10),
  player: joi.string().required(),
  tags: joi.array().items(joi.string()).optional().default([])
}).required()

/**
 * @swagger
 * /api/characters:
 *   get:
 *     description: returns list of available characters
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         example: so-Secure)
 *     responses: 
 *       200:
 *         content:
 *           application/json:
 *             schema: 
 *               type: array
 *               items: 
 *                 type: object
 *                 properties: 
 *                   id: 
 *                     type: string
 *                     example: Character ID
 *                   name: 
 *                     type: string
 *                     example: Character name
 *                   bio: 
 *                     type: string
 *                     example: Character background
 *                   image: 
 *                     type: string
 *                     example: Character image
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.headers['x-api-key'] !== 'so-Secure)') {
      return res.status(400).json({
        error: 'invalid auth'
      });
    }
    const chars = getCharacters();
    return res.json(chars)
}
