export default {
  async fetch(request, env) {
    const id = env.CONNECTIONS.idFromName('GLOBAL');
    const stub = env.CONNECTIONS.get(id);
    return stub.fetch(request);
  }
}

