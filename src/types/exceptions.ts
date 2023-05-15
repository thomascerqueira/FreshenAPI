import { ValidationError } from 'express-validator';

export interface ApiException {
  error: string | Array<ValidationError>;
  status: number;
}
