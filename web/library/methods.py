import pandas as pd
import json
import os
import csv
import sys
import pickle
import zipfile
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
    print(arg)

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


def getAttributes(table, dataset):

    if table == 'right':
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


def deleteCachedData(dataset):
    path = Path(os.getcwd())
    parent_path = Path(os.getcwd()).parent.absolute()
    os.chdir(parent_path)
    best_model_path = Path(
        'resources', 'DeepMatcherDatasets', dataset, 'best_model.pth')
    cached_data_path = Path(
        'resources', 'DeepMatcherDatasets', dataset, 'cacheddata.pth')
    dm_results_path = Path(
        'resources', 'DeepMatcherDatasets', dataset, 'dm_results.csv')

    if os.path.exists(best_model_path):
        os.remove(best_model_path)
    if os.path.exists(cached_data_path):
        os.remove(cached_data_path)
    if os.path.exists(dm_results_path):
        os.remove(dm_results_path)

    os.chdir(path)


def eval_to_json(accuracy, spd, eod):
    data = {'accuracy': accuracy, 'SPD': spd, 'EOD': eod}
    json_string = json.dumps(data)
    with open('web/data/json_data/evaluation_data.json', 'w+') as outfile:
        outfile.write(json_string)


def clusters_to_json(clusters):
    data = {'clusters': clusters}
    json_string = json.dumps(data)
    with open('web/data/json_data/clusters_data.json', 'w+') as outfile:
        outfile.write(json_string)


def preds_to_json(data_path):
    csv_to_json(data_path + '/dm_results.csv',
                'web/data/json_data/preds_data.json')


def extract_dataset(filename):
    dataset_path = os.path.join('web', 'data', 'uploads', 'datasets')

    # new directory name 
    directory = os.path.splitext(filename)[0]

    cur_dir = os.path.abspath(".")
    parent_dir = Path(os.getcwd()).parent.absolute()
    os.chdir(parent_dir)
    path = os.path.join(parent_dir, 'resources', 'OtherDatasets', directory)
    os.mkdir(path)
    
    with zipfile.ZipFile(os.path.join(dataset_path, filename), 'r') as zip_ref:
        zip_ref.extractall(path)

    os.chdir(cur_dir)


def check_for_duplicates(filename):
    filename = os.path.splitext(filename)[0]
    cur_dir = os.path.abspath(".")
    parent_dir = Path(os.getcwd()).parent.absolute()
    os.chdir(parent_dir)
    exists = os.path.exists(os.path.join('resources', 'OtherDatasets', filename))
    if not exists:
        os.chdir(cur_dir)
        return True 
    else:
        os.chdir(cur_dir)
        return False

def delete_dataset_zip(filename):
    path = os.path.join('data', 'uploads', 'datasets',filename)
    if os.path.exists(path):
        os.remove(path)

def datasets_names_to_json():
    list1 = []
    list2 = []
    cur_dir = os.path.abspath(".")
    parent_dir = Path(os.getcwd()).parent.absolute()
    os.chdir(parent_dir)
    rootdir = os.path.join('resources', 'DeepMatcherDatasets')
    for path in Path(rootdir).iterdir():
        if path.is_dir():
            list1.append(os.path.basename(path))

    rootdir = os.path.join('resources', 'OtherDatasets')
    for path in Path(rootdir).iterdir():
        if path.is_dir():
            list2.append(os.path.basename(path))
    
    os.chdir(cur_dir)
    return list1 + list2