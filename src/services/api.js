import { env } from '../config/env';
import { createApiClient } from './createApiClient';

export const apiFetch = createApiClient(env);
