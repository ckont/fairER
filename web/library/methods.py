import json, os, csv
from pathlib import Path



def runAlgorithm(algo, dataset, explanation): 
    cur_dir = os.path.abspath(".")
    parent_dir = Path(os.getcwd()).parent.absolute()
    os.chdir(parent_dir) 
    os.system('python3 main_'+algo+'.py '+dataset+' '+str(explanation))
    os.chdir(cur_dir)

def runStatistics(dataset):
    cur_dir = os.path.abspath(".")
    parent_dir = Path(os.getcwd()).parent.absolute()
    os.chdir(parent_dir)
    os.system('python3 statistics.py '+dataset)
    os.chdir(cur_dir)


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


def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []
    # read csv file
    with open(csvFilePath, encoding='utf-8') as csvFile:
        # load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvFile)

        # convert each csv row into python dict
        for row in csvReader:
            # add this python dict to json array
            jsonArray.append(row)

    # convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w+', encoding='utf-8') as jsonFile:
        jsonString = json.dumps(jsonArray, indent=4)
        jsonFile.write(jsonString)
