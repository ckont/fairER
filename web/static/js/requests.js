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

            htmlRes = simpleTableBuilder(header, body);
            table_container.html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}