from dbm.ndbm import library
from flask import Flask, render_template, request, json
import library.methods as methods


app = Flask(__name__)


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

    result = methods.protectedCond(dataset)
    response = app.response_class(
        response = json.dumps({'res': str(result)}),
        mimetype = 'application/json'
    )
    return response



if __name__ == "__main__":
    app.run(debug=True)