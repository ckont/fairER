import json, os,sys
from pathlib import Path
import runpy



def stringToBool(arg):
    if arg == '0':
        return False
    else:
        return True

def getAccuracy(algo, dataset, explanation):
    runAlgorithm(algo, dataset, explanation)
    with open('data/json_data/evaluation_data.json') as json_file:
        data = json.load(json_file)
    return str(data['accuracy'])


def getEOD(arg, dataset, explanation):
    runAlgorithm(arg, dataset, explanation)
    with open('data/json_data/evaluation_data.json') as json_file:
        data = json.load(json_file)
    return str(data['EOD'])


def getSPD(arg, dataset, explanation):
    runAlgorithm(arg, dataset, explanation)
    with open('data/json_data/evaluation_data.json') as json_file:
        data = json.load(json_file)
    return str(data['SPD'])


def runAlgorithm(algo, dataset, explanation): 

    cur_dir = os.path.abspath(".")
    parent_dir = Path(os.getcwd()).parent.absolute()
    os.chdir(parent_dir)
    
    os.system('python3 main_'+algo+'.py '+dataset+' '+str(explanation))
    os.chdir(cur_dir)
