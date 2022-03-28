from pathlib import Path
from flask import Flask, render_template, request, json
from werkzeug.utils import secure_filename
import library.methods as methods
import sys, os
sys.path.append(os.path.abspath('../'))
import util

app = Flask(__name__)
UPLOAD_DATASET_FOLDER = 'data/datasets'
UPLOAD_JSON_FOLDER = 'data/datasets'
ALLOWED_EXTENSIONS = {'json', 'zip'}

# Navigate user to the home page
@app.route('/')
def index():
    return render_template('index.html')

# Navigate user to the requests page
@app.route('/requests')
def requests():
    return render_template('requests.html')

# Navigate user to the api info page
@app.route('/api/info')
def apiInfo():
    return render_template('api.html')



#####################################################################
# @parameters:                                                      #
#          --dataset -> the dataset to get the accuracy             #
#          --alg -> run the specific algorithm to get the accuracy  #
#####################################################################
@app.route("/requests/getAccuracy")
def getAccuracy():
    dataset = request.args.get('dataset')
    alg = request.args.get('alg')
    explanation = 0
    accuracy = methods.getAccuracy(alg, dataset, explanation)
    
    response = app.response_class(
        response=json.dumps({'accuracy': accuracy}),
        mimetype='application/json'
    )

    return response

###############################################################
# @parameters:                                                #
#          --dataset -> the dataset to get the SPD            #
#          --alg -> run the specific algorithm to get the SPD #
###############################################################
@app.route("/requests/getSPD")
def getSPD():
    dataset = request.args.get('dataset')
    alg = request.args.get('alg')
    explanation = request.args.get('explanation')
    spd = methods.getSPD(alg, dataset, explanation)
    
    response = app.response_class(
        response=json.dumps({'spd': spd}),
        mimetype='application/json'
    )
    return response


###############################################################
# @parameters:                                                #
#          --dataset -> the dataset to get the EOD            #
#          --alg -> run the specific algorithm to get the EOD #
###############################################################
@app.route("/requests/getEOD")
def getEOD():
    dataset = request.args.get('dataset')
    alg = request.args.get('alg')
    explanation = request.args.get('explanation')
    eod = methods.getEOD(alg, dataset, explanation)
    
    response = app.response_class(
        response=json.dumps({'eod': eod}),
        mimetype='application/json'
    )
    return response


###############################################################################
# @parameters:                                                                #
#          --dataset -> the dataset to get the evaluation results for         #
#          --alg -> run the specific algorithm to get the evaluation results  #
###############################################################################
@app.route("/requests/getEvaluationResults")
def getEvaluationResults():
    dataset = request.args.get('dataset')
    alg = request.args.get('alg')
    explanation = request.args.get('explanation')
    methods.runAlgorithm(alg, dataset, explanation)

    with open('data/json_data/evaluation_data.json') as json_file: # open the file that was created
        data = json.load(json_file) # get the data from this file

    # construct the response with the evaluation results as a table in html format
    accuracy = str(data['accuracy'])
    spd =  str(data['SPD'])
    eod = str(data['EOD'])

    response = app.response_class(
        response=json.dumps({'accuracy': accuracy, 'spd': spd, 'eod': eod}),
        mimetype='application/json'
    )
    return response

###############################################################################
# @parameters:                                                                #
#          --dataset -> the dataset to get the preds for                      #
#          --alg -> run the specific algorithm to get the preds               #
###############################################################################
@app.route('/requests/getPreds', methods=['GET'])
def getPreds():
    dataset = request.args.get('dataset')
    alg = request.args.get('alg')
    explanation = request.args.get('explanation')
    
    methods.runAlgorithm(alg, dataset, explanation)

    with open('data/json_data/preds_data.json') as json_file: # open the file that was created
        data = json.load(json_file) # get the data from this file

    response = app.response_class(
        response=json.dumps({'preds': str(data)}),
        mimetype='application/json'
    )
    return response

###############################################################################
# @parameters:                                                                #
#          --dataset -> the dataset to get the clusters for                   #
#          --arg -> run the specific algorithm to get the clusters            #
###############################################################################
@app.route('/requests/getClusters', methods=['GET'])
def getClust():
    alg = request.args.get('alg')
    dataset = request.args.get('dataset')
    explanation = request.args.get('explanation')
    methods.runAlgorithm(alg, dataset, explanation)  

    with open('data/json_data/clusters_data.json') as json_file:
        data = json.load(json_file)

    response = app.response_class(
        response=str(data),
        mimetype='application/json'
    )
    return response


#######################################################################
# @parameters:                                                        #
#          --dataset -> the dataset to get the statistics for         #
#          --arg -> run the specific algorithm to get the statistics  #
#######################################################################
@app.route('/requests/getStatistics', methods=['GET'])
def getStats():
    dataset = request.args.get('dataset')
    
    methods.runStatistics(dataset)
    
    with open('data/json_data/statistics_data.json') as json_file:
        data = json.load(json_file)
    
    response = app.response_class(
        response=json.dumps({'num_protected_matches': data['num_protected_matches'],
                            'num_nonprotected_matches':  data['num_nonprotected_matches'],
                            'avg_score_protected': data['avg_score_protected'],
                            'avg_score_nonprotected': data['avg_score_nonprotected'],
                            'avg_score_protected_matches': data['avg_score_protected_matches'],
                            'avg_score_nonprotected_matches': data['avg_score_nonprotected_matches']}),
        mimetype='application/json'
    )
 
    return response

#############################################################################
# @parameters:                                                              #
#          --dataset -> the dataset that contains this tuple                #
#          --arg -> left or right table                                     #
#          --json -> a json object that contains the values for this tuple  #
#############################################################################
@app.route("/requests/getProtectedCondition")
def getProtectedCondition():
    dataset = request.args.get('dataset')

    result = util.pair_is_protected(None, dataset, True)
    response = app.response_class(
        response = json.dumps({'res': str(result)}),
        mimetype = 'application/json'
    )
    return response



###############################################################
# @parameters:                                                #
#          --dataset -> the dataset to get the attributes for #
#          --table -> left or right table                     #
###############################################################
@app.route("/requests/getTableAttributes")
def getTablesAttributes():
    dataset = request.args.get('dataset')
    table = request.args.get('table')
    attributes_json = methods.getAttributes(table, dataset)
    
    response = app.response_class(
        response=attributes_json,
        mimetype='application/json'
    )
    return response


#############################################################################
# @parameters:                                                              #
#          --dataset -> the dataset that contains this tuple                #
#          --arg -> left or right table                                     #
#          --json -> a json object that contains the values for this tuple  #
#############################################################################
@app.route("/requests/getTupleIsProtected")
def getTupleIsProtected():
    dataset = request.args.get('dataset')
    table = request.args.get('table')
    json_str = request.args.get('json')
    #attributes_json = mylib.getAttributes(arg, dataset)

    json_obj = json.loads(json_str)
    result = methods.checkTupleProtected(dataset, table, json_obj["attributes"])
    response = app.response_class(
        response = json.dumps({'res': str(result)}),
        mimetype = 'application/json'
    )
    return response

##################################################################################
# @parameters:                                                                   #
#          --dataset -> the dataset that contains this tuple                     #
#          --json1 -> a json object that contains the values of the first table  #
#          --json1 -> a json object that contains the values of the second table #
##################################################################################
@app.route("/requests/getPairIsProtected")
def getPairIsProtected():
    dataset = request.args.get('dataset')
    json_str1 = request.args.get('json1')
    json_str2 = request.args.get('json2')

    json_obj1 = json.loads(json_str1)
    json_obj2 = json.loads(json_str2)
    result1 = methods.checkTupleProtected(dataset, 'right', json_obj1["right_table"])
    result2 = methods.checkTupleProtected(dataset, 'left', json_obj2["left_table"])
    pair_is_protected = result1 or result2

    response = app.response_class(
        response = json.dumps({'res': str(pair_is_protected)}),
        mimetype = 'application/json'
    )
    return response


####################################################################################
# @parameters:                                                                     #
#          --dataset -> the dataset for which the protected condition will change  #  
#          --condition -> the new condition                                        #
####################################################################################
@app.route("/requests/postProtectedCondition", methods=['POST'])
def postProtectedCondition():
    dataset = request.json['dataset']
    condition = request.json['condition']
    methods.saveNewCond(dataset, condition)
    methods.deleteCachedData(dataset)
    response = app.response_class(
        response = json.dumps({'res': 'succeed'}),
        mimetype = 'application/json'
    )
    return response



def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/requests/uploadDataset", methods=['POST'])
def uploadDataset():
    # check if the post request has the file part
    if 'dataset-upload-file' not in request.files:
        response = app.response_class(
            response = json.dumps({'res': 'nofile'}),
            mimetype = 'application/json'
        )
    file = request.files['dataset-upload-file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        response = app.response_class(
            response = json.dumps({'res': 'nofile'}),
            mimetype = 'application/json'
        )
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        if methods.check_for_duplicates(filename):
            file.save(os.path.join(UPLOAD_DATASET_FOLDER, filename))
            methods.extract_dataset(filename)
            methods.delete_dataset_zip(filename)
            methods.read_uploaded_dataset(os.path.splitext(filename)[0])
            response = app.response_class(
                response = json.dumps({'res': 'uploaded'}),
                mimetype = 'application/json'
            )
        else:
            response = app.response_class(
                response = json.dumps({'res': 'datasetexists'}),
                mimetype = 'application/json'
            )
    else:
        response = app.response_class(
            response = json.dumps({'res': 'notallowed'}),
            mimetype = 'application/json'
        )
    
    return response



@app.route("/requests/getDatasetsNames", methods=['GET'])
def getDatasetsNames():
    data_names_json = methods.datasets_names_to_json()
    response = app.response_class(
        response = json.dumps({'res': sorted(data_names_json)}),
        mimetype = 'application/json'
    )
    return response


@app.route("/requests/downloadDMdatasets", methods=['POST'])
def downloadDMdatasets():
    methods.download_dataset()
    methods.read_dm_datasets()
    response = app.response_class(
        response = json.dumps({'res': 'succeed'}),
        mimetype = 'application/json'
    )
    return response

@app.route("/requests/tupleIsProtectedJSON", methods=['POST'])
def tupleIsProtectedJSON():
    # check if the post request has the file part
    if 'json-upload-file' not in request.files:
        response = app.response_class(
            response = json.dumps({'res': 'nofile'}),
            mimetype = 'application/json'
        )
        return response
    file = request.files['json-upload-file']
    dataset = request.form["dataset"]
    table = request.form["table"]

    if file.filename == '':
        response = app.response_class(
            response = json.dumps({'res': 'nofile'}),
            mimetype = 'application/json'
        )
        return response

    if file and allowed_file(file.filename):
        contents = file.read()
        json_obj = json.loads(contents)

        result = methods.checkTupleProtected(dataset, table, json_obj["attributes"])  
        response = app.response_class(
            response = json.dumps({'res': str(result)}),
            mimetype = 'application/json'
        )
    else:
        response = app.response_class(
            response = json.dumps({'res': 'notallowed'}),
            mimetype = 'application/json'
        )
    
    return response


@app.route("/requests/pairIsProtectedJSON", methods=['POST'])
def pairIsProtectedJSON():
    # check if the post request has the file part
    if 'json-upload-file' not in request.files:
        response = app.response_class(
            response = json.dumps({'res': 'nofile'}),
            mimetype = 'application/json'
        )
        return response
    file = request.files['json-upload-file']
    dataset = request.form["dataset"]

    if file.filename == '':
        response = app.response_class(
            response = json.dumps({'res': 'nofile'}),
            mimetype = 'application/json'
        )
        return response
        
    if file and allowed_file(file.filename):
        contents = file.read()
        json_obj = (json.loads(contents))["tables"]

        result1 = methods.checkTupleProtected(dataset, 'right', json_obj[1]["right"])
        result2 = methods.checkTupleProtected(dataset, 'left', json_obj[0]["left"])
        pair_is_protected = result1 or result2  
        response = app.response_class( 
            response = json.dumps({'res': str(pair_is_protected)}),
            mimetype = 'application/json'
        )
    else:
        response = app.response_class(
            response = json.dumps({'res': 'notallowed'}),
            mimetype = 'application/json'
        )
    
    return response


if __name__ == "__main__":
    app.run(debug=True)