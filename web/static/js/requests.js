function postProtectedCondition() {
    var dataset = $('#dataset-val').val();
    var condition = $('#protected-textarea').val();
    $.ajax({
        url: '/requests/postProtectedCondition',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ 'dataset': dataset, 'condition': condition }),
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
        url: "/requests/getProtectedCondition?dataset=" + dataset,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            if (container_id != null)
                $('#' + container_id).html(obj.res)
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
        url: "/requests/getTableAttributes?dataset=" + dataset + "&table=" + table,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            htmlRes = tupleAttributesToInput(obj, table);
            $('#protected-container').css('text-align', 'center')
            $('#protected-container').html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function tupleIsProtectedJSON(table) {
    var dataset = $('#dataset-val').val()

    var form_data = new FormData($('#json-upload-form')[0]);
    if (form_data.get("json-upload-file")["name"].length == 0) {
        pretty_alert('error', 'Error!', 'You did not select a JSON!')
        return;
    }
    form_data.append('dataset', dataset)
    form_data.append('table', table)
    $.ajax({
        type: 'POST',
        url: '/requests/tupleIsProtectedJSON',
        processData: false,
        contentType: false,
        async: false,
        cache: false,
        data: form_data,
        success: function (data) {
            if (data.res == 'nofile')
                pretty_alert('error', 'Error!', 'You did not select a dataset to upload!')

            else if (data.res == 'datasetexists')
                pretty_alert('error', 'Error!', 'A duplicate dataset\'s name found on the system!')

            else if (data.res == 'notallowed')
                pretty_alert('error', 'Error!', 'Dataset\s file extention should be .zip!')
            else
                if (data.res == 'True')
                    $('#protected-container').html('<b>Tuple is protected!</b>');
                else
                    $('#protected-container').html('<b>Tuple is not protected!</b>');
        }
    });
}

function pairIsProtectedJSON() {
    var dataset = $('#dataset-val').val()

    var form_data = new FormData($('#json-upload-form')[0]);
    if (form_data.get("json-upload-file")["name"].length == 0) {
        pretty_alert('error', 'Error!', 'You did not select a JSON!')
        return;
    }
    form_data.append('dataset', dataset)
    $.ajax({
        type: 'POST',
        url: '/requests/pairIsProtectedJSON',
        processData: false,
        contentType: false,
        async: false,
        cache: false,
        data: form_data,
        success: function (data) {
            if (data.res == 'nofile')
                pretty_alert('error', 'Error!', 'You did not select a dataset to upload!')

            else if (data.res == 'datasetexists')
                pretty_alert('error', 'Error!', 'A duplicate dataset\'s name found on the system!')

            else if (data.res == 'notallowed')
                pretty_alert('error', 'Error!', 'Dataset\s file extention should be .zip!')
            else
                if (data.res == 'True')
                    $('#protected-container').html('<b>Pair is protected!</b>');
                else
                    $('#protected-container').html('<b>Pair is not protected!</b>');
        }
    });
}

function tupleIsProtected(table) {
    var dataset = $('#dataset-val').val()
    var json_str = '{ "attributes" : [';

    $("form#attr-form :input").each(function () {
        json_str += '{ "' + $(this).attr('id') + '": "' + $(this).val() + '" },';
    });
    json_str = json_str.slice(0, -1); //remove the last comma
    json_str += ' ]}';

    $.ajax({
        type: "POST",
        url: '/requests/tupleIsProtected',
        contentType: 'application/json',
        data: JSON.stringify({ "dataset": dataset, table: table, json: json_str }),
        success: (data) => {
            if (data.res == 'True')
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
        url: "/requests/getTableAttributes?dataset=" + dataset + "&table=right",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var right_obj = JSON.parse(response);

            $.ajax({
                type: "GET",
                url: "/requests/getTableAttributes?dataset=" + dataset + "&table=left",
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

function pairIsProtected() {
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
        type: "POST",
        url: '/requests/pairIsProtected',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({ 'dataset': dataset, 'json1': str1, 'json2': str2 }),
        success: function (data) {

            if (data.res == 'True')
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
    $('#' + container_id).html('<div class="loader"></div>')
    $.ajax({
        type: "GET",
        url: "/requests/getPreds?alg=" + alg + "&dataset=" + dataset + "&explanation=1",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            var jsonData = eval(obj.preds);
            htmlRes = predsTableBuilder(jsonData);
            $('#' + container_id).html(htmlRes);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getClusters(alg, container_id) {
    var dataset = $('#dataset-val').val();
    $('#' + container_id).html('<div class="loader"></div>')
    $.ajax({
        type: "GET",
        url: "/requests/getClusters?alg=" + alg + "&dataset=" + dataset + "&explanation=1",
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
            $('#' + container_id).html(clustersTableBuilder(header, body));

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getEvaluation(alg, arg, container_id) {
    $('#' + container_id).html('<div class="loader"></div>')
    var dataset = $('#dataset-val').val()
    $.ajax({
        type: "GET",
        url: "/requests/get" + arg + "?alg=" + alg + "&dataset=" + dataset + "&explanation=1",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            const obj = JSON.parse(response);

            if (arg == "EvaluationResults")
                header = ["Dataset", "Algorithm", "Accuracy", "SPD", "EOD"];
            else
                header = ["Dataset", "Algorithm", arg];

            if (arg == "Accuracy")
                body = [dataset, alg, obj.accuracy];
            else if (arg == "SPD")
                body = [dataset, alg, obj.spd];
            else if (arg == "EOD")
                body = [dataset, alg, obj.eod];
            else
                body = [dataset, alg, obj.accuracy, obj.spd, obj.eod];

            htmlRes = tableBuilder(header, body, 'eval-table');
            $('#' + container_id).html(htmlRes);
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
        url: "/requests/getStatistics?dataset=" + dataset,
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

function uploadDataset() {
    var form_data = new FormData($('#dataset-upload-form')[0]);
    if (form_data.get("dataset-upload-file")["name"].length == 0) {
        pretty_alert('error', 'Error!', 'You did not select a dataset to upload!')
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/requests/uploadDataset',
        processData: false,
        contentType: false,
        async: false,
        cache: false,
        data: form_data,
        success: function (data) {
            if (data.res == 'uploaded')
                pretty_alert('success', 'Done!', 'Dataset has been uploaded successfully!')

            else if (data.res == 'nofile')
                pretty_alert('error', 'Error!', 'You did not select a dataset to upload!')

            else if (data.res == 'datasetexists')
                pretty_alert('error', 'Error!', 'A duplicate dataset\'s name found on the system!')

            else
                pretty_alert('error', 'Error!', 'Dataset\s file extention should be .zip!')
        }
    });
}

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/requests/getDatasetsNames",
        success: function (response) {
            datasets_names_list = response.res
            if (datasets_names_list.length == 0) {
                htmlRes = '<p style="color:red">No datasets found on system!</p>' +
                    '<b><p>Press the button to download the Datasets from DeepMatcher.</b></p>' +
                    '<button type="button" class="btn btn-success" onclick="download_dm_datasets()" style="margin-left: 40%">Download</button>';
                $('#datasets-container').html(htmlRes)
            }
            else {
                first_dataset = datasets_names_list.shift();
                $('#dataset-val').html('<option value="' + first_dataset + '" selected>' + first_dataset + '</option>')

                datasets_names_list.forEach(item =>
                    $('#dataset-val').append('<option value="' + item + '">' + item + '</option>')
                );
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
});

function download_dm_datasets() {
    htmlRes = '<b><p>Datasets are dowloading.</b></p><p>Estimated time: 30sec. (depending on your network speed).</p>' +
        '<div class="loader"></div>';
    $('#datasets-container').html(htmlRes)
    $.ajax({
        url: '/requests/downloadDMdatasets',
        type: 'POST',
        success: function () {
            $('#datasets-container').html('')
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Done!',
                text: 'The page will be reloaded.',
                showConfirmButton: false,
                timer: 3000
            })
            setTimeout(function () { location.reload(); }, 3000);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getExplanation() {
    $('#fairer-container').html('<div class="loader"></div>')
    var dataset = $('#dataset-val').val()

    $.ajax({
        type: "GET",
        url: "/requests/getExplanation?dataset=" + dataset,
        dataType: 'text',
        success: function (response) {
            const obj = JSON.parse(response);
            var image1 = new Image();
            image1.src = 'data:image/png;base64,'+obj.base64_1;
            image1.id = 'explanation-img'
            $('#fairer-container').html(image1);

            var image2 = new Image();
            image2.src = 'data:image/png;base64,'+obj.base64_2;
            image2.id = 'explanation-img'
            $('#fairer-container').append(image2);
        },
        error: function (error) {
            console.log(error);
        }
    });
}