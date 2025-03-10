import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('GET /', () => {
  it('should return "hello world" and status code 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('hello world');
  });
});
