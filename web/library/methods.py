import pandas as pd
import json
import os
import csv
import sys
import pickle
from pathlib import Path
sys.path.append(os.path.abspath('../'))
import util


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


def protectedCond(dataset):
    data = {}
    pickle_path = 'data/pickle_data/protected_conditions.pkl'
    curr_dir = os.path.split(os.getcwd())[1]
    if curr_dir == 'fairER':
        pickle_path = 'web/' + pickle_path
    if os.path.exists(pickle_path) and os.path.getsize(pickle_path) > 0:
        with open(pickle_path, 'rb') as pkl_file:
            data = pickle.load(pkl_file)

    condition = data.get(dataset)
    return condition 


def hasCustomCond(dataset):
    data = {}
    pickle_path = 'data/pickle_data/protected_conditions.pkl'
    if os.path.exists(pickle_path) and os.path.getsize(pickle_path) > 0:
        with open(pickle_path, 'rb') as pkl_file:
            data = pickle.load(pkl_file)

    condition = data.get(dataset)
    if condition == None: 
        return False
    else:
        return True

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


def checkTupleProtected(dataset, arg, json_obj):
    key = []
    value = []
    if arg == 'right':
        otherSide = 'left'
    else:
        otherSide = 'right'

    for data in json_obj:
        key.append(arg + "_" + list(data.keys())[0])
        value.append(data.get(list(data.keys())[0]))
        key.append(otherSide + "_" + list(data.keys())[0])
        value.append('')

    df = pd.DataFrame(columns=key)
    for i in range(len(json_obj)*2):
        this_column = df.columns[i]
        df[this_column] = [value[i]]

    return util.pair_is_protected(df, dataset, False)


def getAttributes(arg, dataset):

    if arg == 'right':
        file = 'tableA.csv'
    else:
        file = 'tableB.csv'

    with open('../resources/DeepMatcherDatasets/'+dataset+'/'+file) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        list_of_column_names = []

        # iterate through the rows of csv
        for row in csv_reader:
            list_of_column_names.append(row)
            break  # break the loop after the first iteration

        list_of_column_names[0].pop(0)  # we dont want 'id' attribute

        jsonString = json.dumps(list_of_column_names[0])
    return jsonString



def saveNewCond(dataset, condition):
    data = {}
    pickle_path = 'data/pickle_data/protected_conditions.pkl'
    curr_dir = os.path.split(os.getcwd())[1]
    if curr_dir == 'fairER':
        pickle_path = 'web/' + pickle_path

    if os.path.exists(pickle_path) and os.path.getsize(pickle_path) > 0:
        with open(pickle_path, 'rb') as pkl_file:
            data = pickle.load(pkl_file)

    data[dataset] = condition
    with open(pickle_path, 'wb') as pkl_file:
        pickle.dump(data, pkl_file, protocol=pickle.HIGHEST_PROTOCOL)


def condInFile(dataset):
    data = {}
    pickle_path = 'data/pickle_data/protected_conditions.pkl'

    curr_dir = os.path.split(os.getcwd())[1]
    if curr_dir == 'fairER':
        pickle_path = 'web/' + pickle_path
    
    if os.path.exists(pickle_path) and os.path.getsize(pickle_path) > 0:
        with open(pickle_path, 'rb') as pkl_file:
            data = pickle.load(pkl_file)
            if dataset not in data:
                return False
            else:
                return True
    else:
        return False





















