function getEval(arg) {
    var table_container = $('#table-container');
    var table_loader = $('#table-loader');
    clearTables();
    table_loader.show();
    var dataset = $('#dataset-val').val()
    alg = $("#algoForm input[type='radio']:checked").val()

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/get" + arg + "?alg=" + alg + "&dataset=" + getDatasetName(dataset) + "&explanation=0",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            table_loader.hide();
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

            htmlRes = tableBuilder(header, body);
            table_container.html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getPreds() {
    var table_container = $('#table-container');
    var table_loader = $('#table-loader');
    clearTables()
    table_loader.show();
    var dataset = $('#dataset-val').val()
    alg = $("#algoForm input[type='radio']:checked").val()

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getPreds?alg=" + alg + "&dataset=" + getDatasetName(dataset) + "&explanation=0",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            table_loader.hide();
            var obj = JSON.parse(response);
            var jsonData = eval(obj.preds);

            htmlRes = predsTableBuilder(jsonData);
            table_container.html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getClusters() {
    var table_container = $('#table-container');
    var table_loader = $('#table-loader');
    clearTables()
    table_loader.show();
    var dataset = $('#dataset-val').val();
    alg = $("#algoForm input[type='radio']:checked").val()

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getClusters?alg=" + alg + "&dataset=" + getDatasetName(dataset),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            table_loader.hide();
            let json_str = String(response).replace(/'/g, '"');
            const obj = JSON.parse(json_str);

            header = ["TableA", "TableB"];
            var body = [];
            for (var cluster of obj.clusters) {
                body.push(cluster);
            }
            table_container.html(clustersTableBuilder(header, body));

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getStatistics() {
    var table_container = $('#table-container');
    var table_loader = $('#table-loader');
    clearTables();
    table_loader.show();
    var dataset = $('#dataset-val').val()

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getStatistics?dataset=" + getDatasetName(dataset),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            table_loader.hide();
            const obj = JSON.parse(response);

            header = ["Number of Protected Matches", "Number of non-Protected Matches",
                "Avg. Score Protected", "Agv. Score non-Protected", "Avg Score Protected Matches",
                "Avg Score non-Protected Matches"];
            body = [obj.num_protected_matches, obj.num_nonprotected_matches, obj.avg_score_protected,
            obj.avg_score_nonprotected, obj.avg_score_protected_matches, obj.avg_score_nonprotected_matches];

            htmlRes = tableBuilder(header, body);
            table_container.html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getCondition() {
    var protected_container = $('#protected-container');
    var dataset = $('#dataset-val').val();
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getProtectedCondition?dataset=" + getDatasetName(dataset),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            protected_container.show();
            protected_container.html(obj.res);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getPairFields() {
    var protected_container = $('#protected-container');
    var protected_loader = $('#protected-loader');
    var dataset = $('#dataset-val').val();
    clearTables();
    protected_loader.show();

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getTableAttributes?dataset=" + getDatasetName(dataset) + "&arg=right",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            protected_loader.hide();
            var obj1 = JSON.parse(response);


            $.ajax({
                type: "GET",
                url: "http://127.0.0.1:5000/requests/getTableAttributes?dataset=" + getDatasetName(dataset) + "&arg=left",
                contentType: "application/json",
                dataType: 'text',
                success: function (response) {
                    protected_loader.hide();
                    var obj2 = JSON.parse(response);

                    protected_container.show();
                    protected_container.html(pairAttributesToInput(obj1, obj2));
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
    var protected_container = $('#protected-container');
    var protected_loader = $('#protected-loader');
    var dataset = $('#dataset-val').val()

    //Build a json with all the data from the form
    var str1 = '{ "right_table" : [';

    $("form#attr-form :input").each(function () {
        if (leftOrRightTable($(this).attr('id')) == 'right')
            str1 += '{ "' + clearPrefix($(this).attr('id')) + '": "' + $(this).val() + '" },';
    });
    str1 = str1.slice(0, -1); //remove the last comma
    str1 += ' ]}';

    var str2 = '{ "left_table" : [';

    $("form#attr-form :input").each(function () {
        if (leftOrRightTable($(this).attr('id')) == 'left')
            str2 += '{ "' + clearPrefix($(this).attr('id')) + '": "' + $(this).val() + '" },';
    });
    str2 = str2.slice(0, -1); //remove the last comma
    str2 += ' ]}';


    clearTables();
    protected_loader.show();

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getPairIsProtected?dataset=" + getDatasetName(dataset) + "&json1=" + str1 + "&json2=" + str2,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            protected_loader.hide();
            var obj = JSON.parse(response);

            protected_container.html(obj.res);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getTupleIsProtected() {
    var protected_container = $('#protected-container');
    var protected_loader = $('#protected-loader');
    var dataset = $('#dataset-val').val()


    var str = '{ "attributes" : [';

    $("form#attr-form :input").each(function () {
        str += '{ "' + $(this).attr('id') + '": "' + $(this).val() + '" },';
    });
    str = str.slice(0, -1); //remove the last comma
    str += ' ]}';
    if(document.getElementById('rightOption').checked)
        arg = 'right'
    else
        arg = 'left'
    clearTables();
    protected_loader.show();

    

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getTupleIsProtected?dataset=" + getDatasetName(dataset) + "&arg=" + arg + "&json=" + str,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            protected_loader.hide();
            var obj = JSON.parse(response);

            protected_container.html(obj.res);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

function getAttributes(arg) {
    var table_container = $('#table-container');
    var protected_loader = $('#protected-loader');
    //clearTables();
    protected_loader.show();
    var dataset = $('#dataset-val').val()

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getTableAttributes?dataset=" + getDatasetName(dataset) + "&arg=" + arg,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            protected_loader.hide();
            var obj = JSON.parse(response);

            htmlRes = tupleAttributesToInput(obj, arg);
            table_container.html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function postProtectedCondition(dataset, condition) {
    var protected_loader = $('#protected-loader');
    clearTables();
    protected_loader.show();
    alert(condition)

    $.ajax({
        url: 'http://127.0.0.1:5000/requests/postProtectedCondition',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({'dataset': getDatasetName(dataset), 'condition' : condition}),
        success: function (response) {
            protected_loader.hide();
        },
        error: function (error) {
            console.log(error);
        }
    });
}   