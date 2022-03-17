import gender_guesser.detector as gender

d = gender.Detector(case_sensitive=False)  # to avoid creating many Detectors


# returns True if the given value (assumed to be coming from the protected attribute) is considered protected
def pair_is_protected(tuple=None, dataset='datasets/Test', returnCond=False):

    if dataset == 'Amazon-Google':
        if returnCond == True:
            return "('microsoft' in str(tuple.left_manufacturer)) or ('microsoft' in str(tuple.right_manufacturer))"
        else:
            return ('microsoft' in str(tuple.left_manufacturer)) or \
                ('microsoft' in str(tuple.right_manufacturer))
    elif dataset == 'Beer':
        if returnCond == True:
            return "('Red' in str(tuple.left_Beer_Name)) or ('Red' in str(tuple.right_Beer_Name))"
        else:
            return ('Red' in str(tuple.left_Beer_Name)) or ('Red' in str(tuple.right_Beer_Name))
    elif dataset == 'DBLP-ACM':
        if returnCond == True:
            return "('female' in d.get_gender(last_author_fname_l)) or ('female' in d.get_gender(last_author_fname_r))"
        else:
            # main_author_fname_l = str(tuple.left_authors).split(" ")[0].replace('.','')
            # main_author_fname_r = str(tuple.right_authors).split(" ")[0].replace('.', '')
            last_author_fname_l = str(tuple.left_authors).split(
                ",")[-1].strip().split(" ")[0].replace('.', '')
            last_author_fname_r = str(tuple.left_authors).split(
                ",")[-1].strip().split(" ")[0].replace('.', '')
            last_author_is_female = ('female' in d.get_gender(last_author_fname_l)) or \
                                    ('female' in d.get_gender(last_author_fname_r))

            # print(main_author_fname_l, 'is detected as ', 'protected' if main_author_is_female else 'nonprotected')
            # unknown (name not found), andy (androgynous), male, female, mostly_male, or mostly_female
            return last_author_is_female  # DBLP-ACM
        # return (tuple.left_year > 2000) or (tuple.right_year > 2000)  # DBLP-ACM
    elif dataset == 'DBLP-GoogleScholar':
        # return ('acm' in str(tuple.left_venue)) or ('acm' in str(tuple.right_venue))  # DBLP-Scholar
        # DBLP-Scholar
        if returnCond == True:
            return "('vldb j' in str(tuple.left_venue)) or ('vldb j' in str(tuple.right_venue))"
        else:
            return ('vldb j' in str(tuple.left_venue)) or ('vldb j' in str(tuple.right_venue))
    elif dataset == 'Fodors-Zagats':
        # Fodors-Zagats
        if returnCond == True:
            return "('asian' == str(tuple.left_entity_type)) or ('asian' == str(tuple.right_entity_type))"
        else:
            return ('asian' == str(tuple.left_entity_type)) or ('asian' == str(tuple.right_entity_type))
    elif dataset == 'iTunes-Amazon':
        # return ('Rock' in str(tuple.left_Genre)) or ('Rock' in str(tuple.right_Genre))  # iTunes-Amazon
        # return (', 201' in str(tuple.left_Released)) or (', 201' in str(tuple.right_Released))  # iTunes-Amazon
        # iTunes-Amazon
        if returnCond == True:
            return "('Dance' in str(tuple.left_Genre)) or ('Dance' in str(tuple.right_Genre))"
        else:
            return ('Dance' in str(tuple.left_Genre)) or ('Dance' in str(tuple.right_Genre))
        # main_author_fname_l = str(tuple.left_Artist_Name).split(" ")[0].replace('.', '')
        # main_author_fname_r = str(tuple.right_Artist_Name).split(" ")[0].replace('.', '')
        # main_author_is_female = ('female' in d.get_gender(main_author_fname_l)) or \
        #                         ('andy' == d.get_gender(main_author_fname_l)) or \
        #                         ('female' in d.get_gender(main_author_fname_r)) or \
        #                         ('andy' == d.get_gender(main_author_fname_r))
        # print(main_author_fname_l, 'is detected as ', 'protected' if main_author_is_female else 'nonprotected')
        # unknown (name not found), andy (androgynous), male, female, mostly_male, or mostly_female
        # return main_author_is_female
    elif dataset == 'Walmart-Amazon':
        # Walmart-Amazon
        if returnCond == True:
            return "('printers' in str(tuple.left_category)) or ('printers' in str(tuple.right_category))"
        else:
            return ('printers' in str(tuple.left_category)) or ('printers' in str(tuple.right_category))
    else:
        return ', 201' not in tuple.right_Released  # datasets/test


def tuple_is_protected(tuple, table, dataset='datasets/Test'):
    if dataset == 'Amazon-Google':
        if table == 'right':
            return ('microsoft' in str(tuple.right_manufacturer))
        else:
            return ('microsoft' in str(tuple.left_manufacturer))
    elif dataset == 'Beer':
        if table == 'right':
            return ('Red' in str(tuple.right_Beer_Name))
        else:
            return ('Red' in str(tuple.left_Beer_Name))
    elif dataset == 'DBLP-ACM':
        # main_author_fname_l = str(tuple.left_authors).split(" ")[0].replace('.','')
        # main_author_fname_r = str(tuple.right_authors).split(" ")[0].replace('.', '')
        last_author_fname_l = str(tuple.left_authors).split(
            ",")[-1].strip().split(" ")[0].replace('.', '')
        last_author_fname_r = str(tuple.left_authors).split(
            ",")[-1].strip().split(" ")[0].replace('.', '')
        if table == 'right':
            last_author_is_female = (
                'female' in d.get_gender(last_author_fname_r))
        else:
            last_author_is_female = (
                'female' in d.get_gender(last_author_fname_l))

        # print(main_author_fname_l, 'is detected as ', 'protected' if main_author_is_female else 'nonprotected')
        # unknown (name not found), andy (androgynous), male, female, mostly_male, or mostly_female
        return last_author_is_female  # DBLP-ACM
        # return (tuple.left_year > 2000) or (tuple.right_year > 2000)  # DBLP-ACM
    elif dataset == 'DBLP-GoogleScholar':
        # return ('acm' in str(tuple.left_venue)) or ('acm' in str(tuple.right_venue))  # DBLP-Scholar
        if table == 'right':
            return ('vldb j' in str(tuple.right_venue))
        else:
            return ('vldb j' in str(tuple.left_venue))
    elif dataset == 'Fodors-Zagats':
        if table == 'right':
            return ('asian' == str(tuple.right_entity_type))
        else:
            return ('asian' == str(tuple.left_entity_type))
    elif dataset == 'iTunes-Amazon':
        if table == 'right':
            return ('Dance' in str(tuple.right_Genre))
        else:
            return ('Dance' in str(tuple.left_Genre))
        # return ('Rock' in str(tuple.left_Genre)) or ('Rock' in str(tuple.right_Genre))  # iTunes-Amazon
        # return (', 201' in str(tuple.left_Released)) or (', 201' in str(tuple.right_Released))  # iTunes-Amazon
        # main_author_fname_l = str(tuple.left_Artist_Name).split(" ")[0].replace('.', '')
        # main_author_fname_r = str(tuple.right_Artist_Name).split(" ")[0].replace('.', '')
        # main_author_is_female = ('female' in d.get_gender(main_author_fname_l)) or \
        #                         ('andy' == d.get_gender(main_author_fname_l)) or \
        #                         ('female' in d.get_gender(main_author_fname_r)) or \
        #                         ('andy' == d.get_gender(main_author_fname_r))
        # print(main_author_fname_l, 'is detected as ', 'protected' if main_author_is_female else 'nonprotected')
        # unknown (name not found), andy (androgynous), male, female, mostly_male, or mostly_female
        # return main_author_is_female
    elif dataset == 'Walmart-Amazon':
        if table == 'right':
            return ('printers' in str(tuple.right_category))
        else:
            return ('printers' in str(tuple.left_category))
    else:
        return ', 201' not in tuple.right_Released  # datasets/test
