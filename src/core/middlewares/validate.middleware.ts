import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.method === 'GET' ? req.query : req.body;
    const { error, value } = schema.validate(data, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return res.status(400).json({ error: errorMessage });
    }
    
    if (req.method === 'GET') {
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, value);
    } else {
      req.body = value;
    }
    
    next();
  };
};
