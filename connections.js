export class Connections {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.clients = new Map();
    this.nextId = 1;
  }
  async fetch(request) {
    if (request.headers.get('upgrade') !== 'websocket') {
      return new Response('Expected websocket', { status: 400 });
    }
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    server.accept();
    const clientId = String(this.nextId++);
    this.clients.set(clientId, server);
    server.addEventListener('message', (evt) => {
      for (const [id, ws] of this.clients) {
        try {
          if (ws.readyState === 1) ws.send(`[${clientId}] ${evt.data}`);
        } catch {}
      }
    });
    server.addEventListener('close', () => {
      this.clients.delete(clientId);
    });
    server.addEventListener('error', () => {
      this.clients.delete(clientId);
    });
    return new Response(null, { status: 101, webSocket: client });
  }
}
