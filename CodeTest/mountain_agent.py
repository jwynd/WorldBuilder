import numpy as np
from sklearn import preprocessing
import matplotlib.pyplot as plt


#direction
# -x+
# 123 +
# 0 4 y
# 765 -




class mountain_agent:
    #starting pos
    x_coord = 0
    y_coord = 0
    tokens = 0
    direction = 0
    width = 0
    height_min = 0
    height_max = 0
    #turn every 'n' cells, in future will have some randomness added to it
    turn_period = 0
    #how often we create foothills branching off
    foothill_period = 0


def run_mountain_agent(agent):
    i = 1
    j = 0
    while agent.tokens > 0:
        elevate_wedge(agent.x_coord, agent.y_coord, np.random.randint(agent.height_min, agent.height_max), agent.width, agent.direction)
        if agent.foothill_period > 0 and i % agent.foothill_period == 0:
            #foothill parameters are hard coded but they should be some ratio to the size of the mountains, needs to be figured out
            make_foothill(agent.x_coord, agent.y_coord, get_90_degree_offset(agent.direction), 50, 10, 5, 10)
            make_foothill(agent.x_coord, agent.y_coord, get_neg_90_degree_offset(agent.direction), 50, 10, 5, 10)
        if agent.turn_period > 0 and i % agent.turn_period == 0:
            # j just records the number of turns we do for testing
            j = j + 1
            rotate_agent(agent)
        move_agent(agent, agent.direction)
        agent.tokens = agent.tokens - 1
        i = i + 1
    print(j)
   
def elevate_wedge(x, y, height, width, direction):
    #horizontal or vertical mountains
    if direction == 0 or direction == 2 or direction == 4 or direction == 6:
        for i in range(0, width + 1):
            for j in range(0, i + 1):
                new_map[x+i-j,y+j] = new_map[x+i-j,y+j] + height
                if i > 0 and i != j:
                    new_map[x-i+j,y+j] = new_map[x-i+j,y+j] + height
                if j > 0:
                    new_map[x+i-j,y-j] = new_map[x+i-j,y-j] + height
                if j > 0 and i != j:
                    new_map[x-i+j,y-j] = new_map[x-i+j,y-j] + height
    else: #diagonal mountains
        new_map[x,y] = new_map[x,y] + height
        for i in range(0, width + 1):
            for j in range(-i, i):
                new_map[x+i,y+j] = new_map[x+i,y+j] + height
                new_map[x+j,y-i] = new_map[x+j,y-i] + height
                new_map[x-i,y-j] = new_map[x-i,y-j] + height
                new_map[x-j,y+i] = new_map[x-j,y+i] + height

def move_agent(agent, direction):
    if direction == 0:
        agent.y_coord = agent.y_coord - 1
    elif direction == 1:
        agent.x_coord = agent.x_coord + 1
        agent.y_coord = agent.y_coord - 1
    elif direction == 2:
        agent.x_coord = agent.x_coord + 1
    elif direction == 3:
        agent.x_coord = agent.x_coord + 1
        agent.y_coord = agent.y_coord + 1
    elif direction == 4:
        agent.y_coord = agent.y_coord + 1
    elif direction == 5:
        agent.x_coord = agent.x_coord - 1
        agent.y_coord = agent.y_coord + 1
    elif direction == 6:
        agent.x_coord = agent.x_coord - 1
    elif direction == 7:
        agent.x_coord = agent.x_coord - 1
        agent.y_coord = agent.y_coord - 1
    if agent.x_coord < 0 or agent.y_coord < 0 or agent.x_coord >= len(new_map) or agent.y_coord >= len(new_map):
        agent.tokens = 0

#rotate randomly 45 degrees right or left
def rotate_agent(agent):
    value = np.random.randint(0,2)
    if value == 0:
        agent.direction = agent.direction - 1
    if value == 1:
        agent.direction = agent.direction + 1
      
    if agent.direction > 7:
        agent.direction = 0
    elif agent.direction < 0:
        agent.direction = 7


def make_foothill(x, y, direction, length, width, min_height, max_height):
    foothill_agent = mountain_agent()
    foothill_agent.x_coord = x
    foothill_agent.y_coord = y
    foothill_agent.tokens = length
    foothill_agent.direction = direction
    foothill_agent.width = width
    foothill_agent.height_min = min_height
    foothill_agent.height_max = max_height
    foothill_agent.turn_period = 0
    
    run_mountain_agent(foothill_agent)

#used for creating the foothills
def get_90_degree_offset(direction):
    if direction + 2 <= 7:
        return direction + 2
    elif direction + 2 == 8:
        return 0
    elif direction + 2 == 9:
        return 1
    
def get_neg_90_degree_offset(direction):
    if direction - 2 >= 0:
        return direction - 2
    elif direction - 2 == -1:
        return 7
    elif direction - 2 == -2:
        return 6

"""
def test_diag(width, height, x, y):
    for i in range(0, width + 1):
        for j in range(-i, i):
            new_map[x+i,y+j] = new_map[x+i,y+j] + height
            new_map[x+j,y-i] = new_map[x+j,y-i] + height
            new_map[x-i,y-j] = new_map[x-i,y-j] + height
            new_map[x-j,y+i] = new_map[x-j,y+i] + height
"""  


""" to run: """
#run all definitions above

#create new map
new_map = np.zeros([500,500])

#create and edit parameters for mountain agent
new_agent = mountain_agent()
new_agent.x_coord = 250
new_agent.y_coord = 250
new_agent.tokens = 300
new_agent.direction = 0
new_agent.width = 30
new_agent.height_min = 20
new_agent.height_max = 30
new_agent.turn_period = 100
new_agent.foothill_period = 20

#run agent and display map
run_mountain_agent(new_agent)
plt.pcolormesh(new_map)











