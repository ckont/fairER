import gender_guesser.detector as gender
import web.library.methods as methods

d = gender.Detector(case_sensitive=False)  # to avoid creating many Detectors


# returns True if the given value (assumed to be coming from the protected attribute) is considered protected
# if return_condition is True, the condition will be returned as string
def pair_is_protected(tuple=None, dataset='datasets/Test', return_condition=False, explanation=0):
    # if the dataset has not a custom condition, then 'condition_in_file' is a None object
    condition_in_file = methods.protectedCond(dataset)
    # otherwise 'condition_in_file' contains the custom condition
    if(return_condition):
        return get_condition(dataset, explanation) if condition_in_file is None else condition_in_file
    else:
        return eval(get_condition(dataset, explanation)) if condition_in_file is None else eval(condition_in_file)

    '''elif dataset == 'DBLP-ACM': 
        if return_condition:
            return default_conditions['DBLP-ACM'] if condition_in_file is None else condition_in_file 
        else:
            last_author_fname_l = str(tuple.left_authors).split(
                ",")[-1].strip().split(" ")[0].replace('.', '')
            last_author_fname_r = str(tuple.left_authors).split(
                ",")[-1].strip().split(" ")[0].replace('.', '')
            last_author_is_female = ('female' in d.get_gender(last_author_fname_l)) or \
                                    ('female' in d.get_gender(last_author_fname_r))

            return last_author_is_female if condition_in_file is None else eval(condition_in_file)  '''


default_conditions = {'Amazon-Google': "('microsoft' in str(tuple.left_manufacturer)) or ('microsoft' in str(tuple.right_manufacturer))",
                      'Beer': "('Red' in str(tuple.left_Beer_Name)) or ('Red' in str(tuple.right_Beer_Name))",
                      'DBLP-ACM': "('female' in d.get_gender(last_author_fname_l)) or ('female' in d.get_gender(last_author_fname_r))",
                      'DBLP-GoogleScholar': "('vldb j' in str(tuple.left_venue)) or ('vldb j' in str(tuple.right_venue))",
                      'Fodors-Zagats': "('asian' == str(tuple.left_entity_type)) or ('asian' == str(tuple.right_entity_type))",
                      'iTunes-Amazon': "('Dance' in str(tuple.left_Genre)) or ('Dance' in str(tuple.right_Genre))",
                      'Walmart-Amazon': "('printers' in str(tuple.left_category)) or ('printers' in str(tuple.right_category))"}


default_conditions_w_exp = {'Amazon-Google': "('microsoft' in str(tuple.ltable_manufacturer)) or ('microsoft' in str(tuple.rtable_manufacturer))",
                            'Beer': "('Red' in str(tuple.ltable_Beer_Name)) or ('Red' in str(tuple.rtable_Beer_Name))",
                            'DBLP-ACM': "('female' in d.get_gender(last_author_fname_l)) or ('female' in d.get_gender(last_author_fname_r))",
                            'DBLP-GoogleScholar': "('vldb j' in str(tuple.ltable_venue)) or ('vldb j' in str(tuple.rtable_venue))",
                            'Fodors-Zagats': "('asian' == str(tuple.ltable_entity_type)) or ('asian' == str(tuple.rtable_entity_type))",
                            'iTunes-Amazon': "('Dance' in str(tuple.ltable_Genre)) or ('Dance' in str(tuple.rtable_Genre))",
                            'Walmart-Amazon': "('printers' in str(tuple.ltable_category)) or ('printers' in str(tuple.rtable_category))"}


def get_condition(dataset, explanation):
    return default_conditions_w_exp[dataset] #'''if int(explanation) else default_conditions[dataset]'''     Returns always conditions compatible for explanation