import os
import sys
import deepmatcher as dm
import pandas as pd
# to install deepmatcher on Windows 10: pip install git+https://github.com/anhaidgroup/deepmatcher#egg=deepmatcher
# also update deepmatcher/data/field.py, and two more files in the same folder to "from torchtext.legacy import data"


def train_or_load_pretrained_model(model, data_path, train_file, valid_file, test_file, epochs=3):
    train, validation, test = dm.data.process(path=data_path, train=train_file, validation=valid_file, test=test_file)
    try:
        model.load_state(os.path.join(data_path, 'best_model.pth'))
        print('Using the pre-trained model best_model.pth. Delete it or rename it to re-train the model.')
    except:
        print('No pre-trained model found stored as best_model.pth in the current path.')
        print('Starting training and storing model at current path as best_model.pth ...')
        model.run_train(train, validation, best_save_path=os.path.join(data_path, 'best_model.pth'), epochs=epochs)
        print('Starting evaluation...')
        model.run_eval(test)
    return model


def get_predictions_from_unlabeled_data(model, unlabeled_file):
    print('Starting predictions on unlabeled data stored in ' + unlabeled_file)
    unlabeled = dm.data.process_unlabeled(path=unlabeled_file, trained_model=model)

    predictions = pd.DataFrame(model.run_prediction(unlabeled, output_attributes=True))
    # print(predictions.to_csv(columns=['left_id', 'right_id', 'match_score'], index=False))

    return predictions


def get_predictions_from_labeled_data(model, path, file):
    print('Starting predictions on labeled data stored in ' + file)
    processed = dm.data.process(path=path, train=file)
    predictions = pd.DataFrame(model.run_prediction(processed, output_attributes=True))

    return predictions


def run(data_path, train_file, valid_file, test_file, unlabeled_file=None, epochs=2): #TODO: more epochs for testing
    print('Running DeepMatcher with data from folder: ' + str(data_path))

    model = train_or_load_pretrained_model(dm.MatchingModel(), data_path, train_file, valid_file, test_file, epochs)
    if unlabeled_file:
        return get_predictions_from_unlabeled_data(model, unlabeled_file)
    else:
        return get_predictions_from_labeled_data(model, data_path, test_file)


if __name__ == '__main__':

    args = True if len(sys.argv[1:]) > 4 else False  # checks if user provided runtime arguments or not

    data_path = sys.argv[1] if args else '../resources/datasets/test/'  # the folder containing train,valid,test data
    train_file = sys.argv[2] if args else 'test_train.csv'
    valid_file = sys.argv[3] if args else 'test_valid.csv'
    test_file = sys.argv[4] if args else 'test_test.csv'
    unlabeled_file = sys.argv[5] if args else '../resources/datasets/test/test_unlabeled.csv'  # unlabeled data for predictions

    preds = run(data_path, train_file, valid_file, test_file, unlabeled_file)
    print(preds)