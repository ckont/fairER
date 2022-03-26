function postProtectedCondition() {
    var dataset = $('#dataset-val').val();
    var condition = $('#protected-textarea').val();
    $.ajax({
        url: 'http://127.0.0.1:5000/requests/postProtectedCondition',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({'dataset': getDatasetName(dataset), 'condition' : condition}),
        success: function () {
            
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Done!',
                text: 'Protected Condition has been changed successfully!',
                showConfirmButton: false,
                timer: 3000
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}   

function getCondition(container_id) {
    var dataset = $('#dataset-val').val();
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getProtectedCondition?dataset=" + getDatasetName(dataset),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            if(container_id != null)
                $('#'+container_id).html(obj.res)
            else
                return obj.res;      
        },
        error: function (error) {
            console.log(error);
            return error;
        }
    });
}

function getAttributes(table) {
    var dataset = $('#dataset-val').val()
    
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getTableAttributes?dataset=" + getDatasetName(dataset) + "&table=" + table,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            htmlRes = tupleAttributesToInput(obj, table);
            $('#protected-container').css('text-align','center')
            $('#protected-container').html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getTupleIsProtected(table) {
    var dataset = $('#dataset-val').val()
    var json_str = '{ "attributes" : [';

    $("form#attr-form :input").each(function () {
        json_str += '{ "' + $(this).attr('id') + '": "' + $(this).val() + '" },';
    });
    json_str = json_str.slice(0, -1); //remove the last comma
    json_str += ' ]}';

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getTupleIsProtected?dataset=" + getDatasetName(dataset) + "&table=" + table + "&json=" + json_str,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            if(obj.res == 'True')
                $('#protected-container').html('<b>Tuple is protected!</b>');
            else
                $('#protected-container').html('<b>Tuple is not protected!</b>');
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getPairFields() {
    $('#general-container').html('')
    var dataset = $('#dataset-val').val();

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getTableAttributes?dataset=" + getDatasetName(dataset) + "&table=right",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var right_obj = JSON.parse(response);

            $.ajax({
                type: "GET",
                url: "http://127.0.0.1:5000/requests/getTableAttributes?dataset=" + getDatasetName(dataset) + "&table=left",
                contentType: "application/json",
                dataType: 'text',
                success: function (response) {
                    var left_obj = JSON.parse(response);
                    $('#protected-container').html(pairAttributesToInput(right_obj, left_obj));
                },
                error: function (error) {
                    console.log(error);
                }
            });


        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getPairIsProtected() {
    var dataset = $('#dataset-val').val()

    //Build a json with all the data from the form
    var str1 = '{ "right_table" : [';

    $("form#attr-form :input").each(function () {
        if ($(this).attr('id') && attr_prefix($(this).attr('id')) == 'right')
            str1 += '{ "' + clearPrefix($(this).attr('id')) + '": "' + $(this).val() + '" },';
    });
    str1 = str1.slice(0, -1); //remove the last comma
    str1 += ' ]}';

    var str2 = '{ "left_table" : [';

    $("form#attr-form :input").each(function () {
        if ($(this).attr('id') && attr_prefix($(this).attr('id')) == 'left')
            str2 += '{ "' + clearPrefix($(this).attr('id')) + '": "' + $(this).val() + '" },';
    });
    str2 = str2.slice(0, -1); //remove the last comma
    str2 += ' ]}';
    

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getPairIsProtected?dataset=" + getDatasetName(dataset) + "&json1=" + str1 + "&json2=" + str2,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);

            if(obj.res == 'True')
                $('#protected-container').html('<b>Pair is protected!</b>');
            else
                $('#protected-container').html('<b>Pair is not protected!</b>');
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getPredictions(alg, container_id) {
    var dataset = $('#dataset-val').val()
    $('#'+container_id).html('<div class="loader"></div>') 
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getPreds?alg=" + alg + "&dataset=" + getDatasetName(dataset) + "&explanation=" + getExplanation(),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            var jsonData = eval(obj.preds);
            htmlRes = predsTableBuilder(jsonData);
            $('#'+container_id).html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getClusters(alg, container_id) {
    var dataset = $('#dataset-val').val();
    $('#'+container_id).html('<div class="loader"></div>') 
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getClusters?alg=" + alg + "&dataset=" + getDatasetName(dataset) + "&explanation=" + getExplanation(),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            let json_str = String(response).replace(/'/g, '"');
            const obj = JSON.parse(json_str);

            header = ["TableA", "TableB"];
            var body = [];
            for (var cluster of obj.clusters) {
                body.push(cluster);
            }
            $('#'+container_id).html(clustersTableBuilder(header, body));

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getEvaluation(alg, arg, container_id) {
    $('#'+container_id).html('<div class="loader"></div>') 
    var dataset = $('#dataset-val').val()
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/get" + arg + "?alg=" + alg + "&dataset=" + getDatasetName(dataset) + "&explanation="+getExplanation(),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            const obj = JSON.parse(response);

            if (arg == "EvaluationResults")
                header = ["Dataset", "Algorithm", "Accuracy", "SPD", "EOD"];
            else
                header = ["Dataset", "Algorithm", arg];
            
            if (arg == "Accuracy")
                body = [getDatasetName(dataset), alg, obj.accuracy];
            else if (arg == "SPD")
                body = [getDatasetName(dataset), alg, obj.spd];
            else if (arg == "EOD")
                body = [getDatasetName(dataset), alg, obj.eod];
            else
                body = [getDatasetName(dataset), alg, obj.accuracy, obj.spd, obj.eod];

            htmlRes = tableBuilder(header, body, 'eval-table');
            $('#'+container_id).html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getStatistics() {
    $('#statistics-container').html('<div class="loader"></div>') 
    var dataset = $('#dataset-val').val()

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getStatistics?dataset=" + getDatasetName(dataset),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            const obj = JSON.parse(response);
            header = ["Number of Protected Matches", "Number of non-Protected Matches",
                "Avg. Score Protected", "Agv. Score non-Protected", "Avg Score Protected Matches",
                "Avg Score non-Protected Matches"];
            body = [obj.num_protected_matches, obj.num_nonprotected_matches, obj.avg_score_protected,
            obj.avg_score_nonprotected, obj.avg_score_protected_matches, obj.avg_score_nonprotected_matches];

            htmlRes = tableBuilder(header, body, 'statistics-table');
            $('#statistics-container').html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}