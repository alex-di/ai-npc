import { NextApiRequest, NextApiResponse } from 'next';
import joi from 'joi';
import { BaseError } from '../../../../core/errors';
import { reply } from '../../../../domain';

const bodyValidator = joi.object<{
  prompt: string,
  playerId: string,
  tags: string[],
}>({
  prompt: joi.string().required().min(10),
  playerId: joi.string().required(),
  tags: joi.array().items(joi.string()).optional().default([])
}).required()

/**
 * @swagger
 * /api/characters/{id}:
 *   post:
 *     description: Returns the answer according to specified character bio. It combines player chat history with historical and input tags to determine behaviour
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         example: so-Secure)
 *       - in: path
 *         name: id
 *         required: true
 *         example: baldis
 *         schema: 
 *           type: string
 *     requestBody:
 *       required: true
 *       description: Updated conversation
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 required: true
 *                 type: string
 *                 description: New dialog entry.
 *                 example: Hi. What are you doing?
 *               playerId:
 *                 required: true
 *                 type: string
 *                 description: player uid to manage historical data
 *                 example: abcd12-3423
 *               tags:
 *                 type: array
 *                 description: player uid to manage historical data
 *                 example: ['mood:angry']
 *                 items:
 *                   type: string
 *     responses: 
 *       200:
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 *               properties: 
 *                 characterId: 
 *                   type: string
 *                   example: Character ID
 *                 playerId: 
 *                   type: string
 *                   example: Player Id
 *                 reply: 
 *                   type: string
 *                   example: Character reply for prompt
 *                 prompt: 
 *                   type: string
 *                   example: User prompt
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id }= req.query;

  if (!id) {
    return res.status(400).json({
      error: 'no id'
    });
  }
  if (req.headers['x-api-key'] !== 'so-Secure)') {
    return res.status(400).json({
      error: 'invalid auth'
    });
  }

  const { error, value } = bodyValidator.validate(req.body);

  if (error) {
    return res.status(400).json({
      error
    });
  }

  try {
    res.status(200).json({ result: await reply({
      ...value,
      characterId: id.toString(),
    }) });
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
