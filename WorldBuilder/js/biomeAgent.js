/* jshint esversion: 6 */
class biomeAgent {
  constructor (seedPoint, tokens, limit) {
    this.seed = seedPoint;
    this.tokens = tokens;
    this.limit = limit;
    this.direction = Map.randomDirection();
  }

  findCoastline (map) {
    let visited = new List();
    visited.append(map.getRandomPointOfType('ocean'));

    return 0;
  }

  BFS (graph, s) {
    if (graph === null) {
      console.log('Graph Error: calling BFS() on null Graph reference');
      return;
    }
    if (s < 1 || s > graph.order) {
      console.log('Graph Error: calling BFS() on invalid source vertex');
      return;
    }
    graph.source = graph.vertices[s - 1];
    for (let i = 0; i < graph.order; i++) {
      graph.vertices[i].color = 'w';
      graph.vertices[i].distance = Number.POSITIVE_INFINITY;
      graph.vertices[i].parent = null;
    }
    graph.source.color = 'g';
    graph.source.distance = 0;
    graph.source.parent = null;
    const Q = new List();
    Q.append(s);
    while (Q.length() > 0) {
      Q.moveFront();
      const x = Q.get();
      Q.deleteFront();
      (graph.Adj[x - 1]).moveFront();
      while ((graph.Adj[x - 1]).index() > -1) {
        if (graph.vertices[(graph.Adj[x - 1]) - 1].get().color === 'w') {
          graph.vertices[(graph.Adj[x - 1]) - 1].get().color = 'g';
          graph.vertices[(graph.Adj[x - 1]) - 1].get().distance = (graph.vertices[x - 1].distance) + 1;
          graph.vertices[(graph.Adj[x - 1]) - 1].get().parent = graph.vertices[x - 1];
          Q.append((graph.Adj[x - 1]).get());
        }
        (graph.Adj[x - 1]).moveNext();
      }
      (graph.vertices[x - 1].color) = 'b';
    }
  }
}
