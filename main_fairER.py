from matching import run_deepmatcher as dm
from matching import run_deepmatcher_w_mojito as dmm
#from matching import run_maggelan_matcher_w_lemon as mml
import sys, os, util, time, json
import pandas as pd
from clustering import fair_unique_mapping_clustering as fumc
import evaluation.accuracy as eval
import evaluation.fairness as f_eval
import web.library.methods as methods


def run(data, data_path, train_file, valid_file, test_file, explanation,k_results):
    ###########
    # Matching
    ###########
    if not os.path.exists(data_path + '/dm_results.csv'):
        if explanation:
            preds = dmm.run(data_path, train_file, valid_file, test_file)
        else:
            preds = dm.run(data_path, train_file, valid_file, test_file)  # , unlabeled_file)
        preds.to_csv(data_path + '/dm_results.csv')

    preds = pd.read_csv(data_path + '/dm_results.csv')  # unnecessary read for the 1st time, but throws error otherwise
    # print(preds)

    # Ranking of matching results in desc. match score
    preds = preds.sort_values(by='match_score', ascending=False)
    # print("Initial Ranking:\n", preds[:k_results].to_string(index=False))

    #################################
    # Fair Unique Mapping Clustering
    #################################

    initial_pairs = [(int(a.id.split('_')[0]), int(a.id.split('_')[1]), a.match_score, util.pair_is_protected(a, data))
                     for a in preds.itertuples(index=False)]

    clusters = fumc.run(initial_pairs, k_results)
    # print("\nclustering results:\n", clusters)


    ####################################################
    # Write clusters to json file
    ####################################################
    data = {'clusters': clusters}
    json_string = json.dumps(data)
    with open('web/data/json_data/clusters_data.json', 'w+') as outfile:
        outfile.write(json_string)

    ###########################
    # Write preds to json file
    ###########################
    methods.csv_to_json(data_path + '/dm_results.csv',
                      'web/data/json_data/preds_data.json')



    return clusters, preds


# This pipeline performs a Fair version of Unique Mapping Clustering (creates two PQs instead of one)
# instead of running the fa*ir algorithm for re-ranking
if __name__ == '__main__':
    k = 20

    datasets_path = 'resources/DeepMatcherDatasets/'
    data = sys.argv[1]

    print('\n', data, '\n')

    data_path = datasets_path + data + '/'
    train_file = 'joined_train.csv'
    valid_file = 'joined_valid.csv'
    test_file = 'joined_test.csv'
    # unlabeled_file = sys.argv[5] if args else data+path+'test_unlabeled.csv'  # unlabeled data for predictions
    explanation = methods.stringToBool(sys.argv[2])

    av_time = 0
    for _ in range(10):
        start_time = time.time()
        clusters, preds = run(data, data_path, train_file, valid_file, test_file, explanation,k)
        ex_time = time.time() - start_time
        av_time += ex_time

    #############################
    # Evaluation
    #############################
    #print("--- %s seconds ---" % (av_time / 10.0))

    accuracy = eval.get_accuracy(clusters, preds)
    #print("accuracy:", accuracy)

    spd = f_eval.get_spd(clusters, preds, data)
    #print("SPD:", spd)

    eod = f_eval.get_eod(clusters, preds, data)
    #print("EOD:", eod)
    #print()


        
    ########################################
    # Write evaluation results to json file 
    ########################################
    data = {'accuracy': accuracy, 'SPD': spd, 'EOD': eod, 'time' : str(av_time / 10.0)}
    json_string = json.dumps(data)
    with open('web/data/json_data/evaluation_data.json', 'w+') as outfile:
        outfile.write(json_string)

