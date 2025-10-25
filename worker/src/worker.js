function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export class CounterDO {
  constructor(state) {
    this.state = state;
  }

  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'OPTIONS') return json({ ok: true });

    let value = (await this.state.storage.get('value')) || 0;

    if (path.endsWith('/hit') && req.method === 'POST') {
      value += 1;
      await this.state.storage.put('value', value);
      return json({ value });
    }

    if (req.method === 'GET') {
      return json({ value });
    }

    return json({ error: 'Not found' }, 404);
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const { pathname } = url;

    if (req.method === 'OPTIONS') return json({ ok: true });

    const map = {
      '/api/visitors': 'visitors',
      '/api/visitors/hit': 'visitors',
      '/api/installs': 'installs',
      '/api/installs/hit': 'installs',
    };

    const basePath = pathname.endsWith('/hit') ? pathname.replace('/hit','') : pathname;
    const name = map[basePath];
    if (!name) return json({ error: 'Not found' }, 404);

    const id = env.COUNTER.idFromName(name);
    const stub = env.COUNTER.get(id);

    const doUrl = new URL('https://do/' + (pathname.endsWith('/hit') ? 'hit' : 'get'));
    const method = pathname.endsWith('/hit') ? 'POST' : 'GET';
    return stub.fetch(new Request(doUrl, { method }));
  },
};
