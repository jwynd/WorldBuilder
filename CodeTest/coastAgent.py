
class CoastAgent:
    def __init__(self, seed, tokens):
        """
        Seed is a seeded random point and the origin of the agent, tokens are the number of points the agent will
        generate, direction is the direction the agent will move if it's on land, limit is a value indicating the point
        above which agents will subdivide tasks
        """
        self.seed = point
        self.tokens = tokens
        self.direction = randomint(1, 8)

    def generateCoast(self, seedpoint, tokens, size, limit): #Static method, user specified seed, called by user?
        CoastAgent(seedpoint, tokens, limit)

    def recurCoast(self, agent, limit):
        if agent.tokens > limit:
            child1 = CoastAgent(agent.point.borderRand, agent.tokens/2)
            child2 = CoastAgent(agent.point.borderRand, agent.tokens/2)
            recurCoast(child1, limit)
            recurCoast(child2, limit)
        else:
            for t in agent.tokens:
                agent.point = agent.point.borderRand
                if coastPoint(agent.point == False):
                    moveAgent(agent)
                pointSet = []
                repulsor = agent.point.borderRand.borderRand
                attractor = agent.point.borderRand.borderRand
                if repulsor.euclidean(attractor) == repulsor.euclidean(agent.point) + attractor.euclidean(agent.point):
                    do something
                for p in agent.point.borderAll:
                    pointSet.append(score(p, repulsor, attractor))
                raisePoint(max(pointSet))

    def coastPoint(self, point): #Returns false if point is surrounded by land, true otherwise
        for b in point.borderAll:
            if b.getBiome == "ocean":
                return true
        return false

    def raisePoint(self, x, y): #static method
        point = map.point(x, y)
        point.setElevation(1)
        point.setBiome("coast")
        return point

    def moveAgent(self, agent):

    def score(self, point, repulsor, attractor):

