const request = require('supertest');
const path = require('path');
const fs = require('fs');
const { app } = require('..');

describe('API health and metrics', () => {
  it('responds to the health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns general API availability message', async () => {
    const response = await request(app).get('/api/data');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  it('returns player metrics payload from fixture', async () => {
    const fixturePath = path.resolve(__dirname, '..', '..', 'output', 'player_metrics.json');
    if (!fs.existsSync(fixturePath)) {
      throw new Error('player_metrics.json fixture is missing');
    }

    const response = await request(app).get('/api/metrics/players');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('name');
  });
});
