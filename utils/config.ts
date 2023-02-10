import dotenv from 'dotenv'
import Joi from 'joi';

const schema = Joi.object<IConfig>({
    PORT: Joi.string()
        .alphanum()
        .min(3)
        .max(25555),

    MONGODB_URI: Joi.string().required(),
    OPENAI_API_KEY: Joi.string().required(),
}).unknown(true)

function createConfig() {
    const c = dotenv.config({
        
    })


    if (!c.parsed) {
        // throw new Error('config is undefined');
    }

    const validationResult = schema.validate(c.parsed || process.env);

    if (validationResult.error) {
        throw validationResult.error;
    }

    return validationResult.value;
}

export interface IConfig {
    PORT?: number;
    MONGODB_URI: string;
    OPENAI_API_KEY: string;
}

export const config = createConfig();