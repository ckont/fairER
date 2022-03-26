from matching import run_deepmatcher as dm
import sys ,json , os, util, time
import pandas as pd
from clustering import unique_mapping_clustering as umc
import evaluation.accuracy as eval
import evaluation.fairness as f_eval
import web.library.methods as methods



def run(data, data_path, train, valid, test, k_results):
    ###########
    # Matching
    ###########

    # comment out after the first run (it writes output to file, which does not need to be re-written in every run)
    if os.path.exists(data_path + '/dm_results.csv'):
        preds = pd.read_csv(data_path + '/dm_results.csv')
    else:
        preds = dm.run(data_path, train, valid, test)  # , unlabeled_file)
        preds.to_csv(data_path + '/dm_results.csv')
        # print(preds)

    # Ranking of matching results in desc. match score
    preds = preds.sort_values(by='match_score', ascending=False)
    # print("Initial Ranking:\n", preds[:k].to_string(index=False))

    initial_pairs = [(int(a.id.split('_')[0]), int(a.id.split('_')[1]), a.match_score, util.pair_is_protected(a, data))
                     for a in preds.itertuples()]

    #############################
    # Unique Mapping Clustering
    #############################

    original_clusters = umc.run(initial_pairs[:k_results])
    # print("\nclustering results:\n", original_clusters)


    # Write clusters to json file
    methods.clusters_to_json(original_clusters) 
    # Write preds to json file
    methods.preds_to_json(data_path)
    

    return original_clusters, preds


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

    av_time = 0
    for _ in range(10):
        start_time = time.time()
        clusters, preds = run(data, data_path, train_file, valid_file, test_file, k)
        ex_time = time.time() - start_time
        av_time += ex_time

    ############################
    # Evaluation
    ############################
    #print("--- %s seconds ---" % (av_time / 10.0))

    accuracy = eval.get_accuracy(clusters, preds)
    #print("accuracy:", accuracy)

    spd = f_eval.get_spd(clusters, preds, data)
    #print("SPD:", spd)

    eod = f_eval.get_eod(clusters, preds, data)
    #print("EOD:", eod)
    #print()

    # Write evaluation results to json file
    methods.eval_to_json(accuracy, spd, eod)