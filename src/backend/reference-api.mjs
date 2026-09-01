import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const schemaPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../references/ballistics-reference-schema.json');
const port = Number(process.env.ARTY_REFERENCE_PORT || 8090);

const schema = JSON.parse(await readFile(schemaPath, 'utf8'));

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

function validatePayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) errors.push('payload ต้องเป็น object');
  if (payload?.operationalCalculationEnabled === true) errors.push('ไม่อนุญาตให้เปิดการคำนวณเชิงปฏิบัติการ');
  for (const field of schema.restrictedPayloadPolicy.blockedFields) {
    if (payload && Object.prototype.hasOwnProperty.call(payload, field)) errors.push(`ไม่อนุญาต field: ${field}`);
  }
  return { valid: errors.length === 0, errors, mode: 'schema-validation-only' };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/v1/health') {
    return json(res, 200, { status: 'ONLINE', service: 'arty-reference-api', mode: 'schema-validation-only', operationalCalculationEnabled: false });
  }
  if (req.method === 'GET' && url.pathname === '/api/v1/reference/schema') return json(res, 200, schema);
  if (req.method === 'GET' && url.pathname === '/api/v1/reference/tables') return json(res, 200, { tables: schema.tableCatalog });
  if (req.method === 'POST' && url.pathname === '/api/v1/reference/validate') {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { return json(res, 200, validatePayload(JSON.parse(body || '{}'))); }
      catch { return json(res, 400, { valid: false, errors: ['JSON ไม่ถูกต้อง'] }); }
    });
    return;
  }
  return json(res, 404, { error: 'ไม่พบ endpoint' });
});

server.listen(port, () => console.log(`ARTY reference API listening on ${port}`));
