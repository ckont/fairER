function getEval(arg) {
    var table_container = $('#table-container');
    var table_loader = $('#table-loader');
    clearTables();
    table_loader.show();
    var dataset = $('#dataset-val').val()
    alg = $("#algoForm input[type='radio']:checked").val()

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/get" + arg + "?alg=" + alg + "&dataset=" + getDatasetName(dataset)+"&explanation=0",
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
    arg = $("#algoForm input[type='radio']:checked").val()

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getPreds?alg=" + arg + "&dataset=" + getDatasetName(dataset)+"&explanation=0",
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

function getCondition(){
    var protected_container = $('#protected-container');
    var protected_loader = $('#protected-loader');
    var dataset = $('#dataset-val').val();
    clearTables();
    protected_loader.show();

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:5000/requests/getProtectedCondition?dataset=" + getDatasetName(dataset),
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            protected_loader.hide();
            var obj = JSON.parse(response);
            protected_container.show();
            protected_container.html(obj.res);
        },
        error: function (error) {
            console.log(error);
        }
    });
}