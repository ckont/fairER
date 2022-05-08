function deleteDataset(dataset) {
    $.ajax({
        type: 'DELETE',
        url: "/requests/deleteDataset?dataset=" + dataset,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = response;
            //If there is no exception 
            if (obj.exception == undefined) {
                Swal.fire(
                    'Deleted!',
                    '<b>"' + dataset + '"</b> has been deleted.',
                    'success'
                )
                setTimeout(function () { location.reload(); }, 3500);
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function postProtectedCondition() {
    left_attribute = $("#left-tbl").val();
    left_func = $("#left-func").val();
    left_value = $("#left-value").val();
    logical_op = $("#logical-operator").val();
    right_attribute = $("#right-tbl").val();
    right_func = $("#right-func").val();
    right_value = $("#right-value").val();

    var dataset = $('#dataset-val').val();
    $.ajax({
        url: '/requests/postProtectedCondition',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            'dataset': dataset,
            'left_attribute': left_attribute,
            'left_func': left_func,
            'left_value': left_value,
            'logical_op': logical_op,
            'right_attribute': right_attribute,
            'right_func': right_func,
            'right_value': right_value
        }),
        success: function (response) {
            var obj = response;
            //If there is no exception 
            if (obj.exception == undefined) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Done!',
                    text: 'Protected Condition has been changed successfully!',
                    showConfirmButton: false,
                    timer: 3000
                })
                setTimeout(function () { location.reload(); }, 3500);
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getCondition(container_id) {
    $("#protected-container").css("display", "flex");
    $("#protected-container").css("margin-left", "0");
    var dataset = $('#dataset-val').val();
    $.ajax({
        type: "GET",
        url: "/requests/getProtectedCondition?dataset=" + dataset,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            //If there is no exception 
            if (obj.exception == undefined) {
                if (container_id != null) {
                    let hrmlRes = '<label for="condition" class="form-label"><b>Condition:</b></label>'
                    hrmlRes += '<p id="condition">&emsp;' + obj.condition + '</p>'
                    $('#' + container_id).html(hrmlRes)
                }
                else{

                    return obj.condition;
                }
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)
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
            //If there is no exception 
            if (obj.exception == undefined) {
                htmlRes = tupleAttributesToInput(obj, table);
                $('#protected-container').css('text-align', 'center')
                $('#protected-container').html(htmlRes);
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}
function tupleIsProtectedJSON(table) {
    
    if (has_condition() == false) 
        return;  

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
            //If there is no exception 
            if (data.exception == undefined) {
                if (data.status == 'nofile')
                    pretty_alert('error', 'Error!', 'You did not select a dataset to upload!')

                else if (data.status == 'datasetexists')
                    pretty_alert('error', 'Error!', 'A duplicate dataset\'s name found on the system!')

                else if (data.status == 'notallowed')
                    pretty_alert('error', 'Error!', 'Dataset\s file extention should be .zip!')
                else {
                    if (data.status == 'True')
                        $('#protected-container').html('<b>Tuple is protected!</b>');
                    else
                        $('#protected-container').html('<b>Tuple is not protected!</b>');
                }
            }
            //If there is an exception, print details about it
            else print_exception(data.exception_type, data.exception, data.filename, data.func_name, data.line_number)
        }
    });
}

function pairIsProtectedJSON() {
   
    if (has_condition() == false) 
        return;  

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
            //If there is no exception 
            if (data.exception == undefined) {
                if (data.res == 'nofile')
                    pretty_alert('error', 'Error!', 'You did not select a dataset to upload!')

                else if (data.status == 'datasetexists')
                    pretty_alert('error', 'Error!', 'A duplicate dataset\'s name found on the system!')

                else if (data.status == 'notallowed')
                    pretty_alert('error', 'Error!', 'Dataset\s file extention should be .zip!')
                else {
                    if (data.status == 'True')
                        $('#protected-container').html('<b>Pair is protected!</b>');
                    else
                        $('#protected-container').html('<b>Pair is not protected!</b>');
                }
            }
            //If there is an exception, print details about it
            else print_exception(data.exception_type, data.exception, data.filename, data.func_name, data.line_number)
        }
    });
}

function tupleIsProtected(table) {
   
    if (has_condition() == false) 
        return;  

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
            //If there is no exception 
            if (data.exception == undefined) {
                if (data.is_protected == 'True')
                    $('#protected-container').html('<b>Tuple is protected!</b>');
                else
                    $('#protected-container').html('<b>Tuple is not protected!</b>');
            }
            //If there is an exception, print details about it
            else print_exception(data.exception_type, data.exception, data.filename, data.func_name, data.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getPairFields() {
   
    if (has_condition() == false) 
        return;  

    $("#protected-container").css("display", "flex");
    $("#protected-container").css("margin-left", "0");
    $('#general-container').html('')
    var dataset = $('#dataset-val').val();

    $.ajax({
        type: "GET",
        url: "/requests/getTableAttributes?dataset=" + dataset + "&table=right",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var right_obj = JSON.parse(response);
            //If there is no exception 
            if (right_obj.exception == undefined) {
                $.ajax({
                    type: "GET",
                    url: "/requests/getTableAttributes?dataset=" + dataset + "&table=left",
                    contentType: "application/json",
                    dataType: 'text',
                    success: function (response) {
                        var left_obj = JSON.parse(response);
                        //If there is no exception 
                        if (left_obj.exception == undefined)
                            $('#protected-container').html(pairAttributesToInput(right_obj, left_obj));
                        //If there is an exception, print details about it
                        else print_exception(left_obj.exception_type, left_obj.exception, left_obj.filename, left_obj.func_name, left_obj.line_number)
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }
            //If there is an exception, print details about it
            else print_exception(right_obj.exception_type, right_obj.exception, right_obj.filename, right_obj.func_name, right_obj.line_number)

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function pairIsProtected() {
   
    if (has_condition() == false) 
        return;  

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
            //If there is no exception 
            if (data.exception == undefined) {
                if (data.is_protected == 'True')
                    $('#protected-container').html('<b>Pair is protected!</b>');
                else
                    $('#protected-container').html('<b>Pair is not protected!</b>');
            }
            //If there is an exception, print details about it
            else print_exception(data.exception_type, data.exception, data.filename, data.func_name, data.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getPredictions(alg, container_id) {
   
    if (has_condition() == false) 
        return;  

    var dataset = $('#dataset-val').val()
    $('#' + container_id).html('<div class="loader"></div><p style="text-align:center; margin-top:1%">Please wait as this may take a few minutes...</p>')
    $.ajax({
        type: "GET",
        url: "/requests/getPreds?alg=" + alg + "&dataset=" + dataset + "&explanation=1",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            //If there is no exception 
            if (obj.exception == undefined) {
                var jsonData = eval(obj.preds);
                htmlRes = predsTableBuilder(jsonData);
                $('#' + container_id).html(htmlRes);
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getClusters(alg, container_id) {
   
    if (has_condition() == false) 
        return;  

    var dataset = $('#dataset-val').val();
    $('#' + container_id).html('<div class="loader"></div><p style="text-align:center; margin-top:1%">Please wait as this may take a few minutes...</p>')
    $.ajax({
        type: "GET",
        url: "/requests/getClusters?alg=" + alg + "&dataset=" + dataset + "&explanation=1",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            let json_str = String(response).replace(/'/g, '"');
            const obj = JSON.parse(json_str);
            //If there is no exception 
            if (obj.exception == undefined) {
                header = ["TableA", "TableB"];
                var body = [];
                for (var cluster of obj.clusters) {
                    body.push(cluster);
                }
                $('#' + container_id).html(clustersTableBuilder(header, body));
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getEvaluation(alg, arg, container_id) {
    
    if (has_condition() == false) 
        return;  

    $('#' + container_id).html('<div class="loader"></div><p style="text-align:center; margin-top:1%">Please wait as this may take a few minutes...</p>')
    var dataset = $('#dataset-val').val()
    $.ajax({
        type: "GET",
        url: "/requests/get" + arg + "?alg=" + alg + "&dataset=" + dataset + "&explanation=1",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            const obj = JSON.parse(response);

            //If there is no exception 
            if (obj.exception == undefined) {
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
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getStatistics() {

    if (has_condition() == false) 
        return;  

    $('#datasets-info-container').html('<div class="loader"></div><p style="text-align:center; margin-top:1%">Please wait as this may take a few minutes...</p>')
    var dataset = $('#dataset-val').val()

    $.ajax({
        type: "GET",
        url: "/requests/getStatistics?dataset=" + dataset,
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            const obj = JSON.parse(response);
            //If there is no exception 
            if (obj.exception == undefined) {
                header = ["Number of Protected Matches", "Number of non-Protected Matches",
                    "Avg. Score Protected", "Agv. Score non-Protected", "Avg Score Protected Matches",
                    "Avg Score non-Protected Matches"];
                body = [obj.num_protected_matches, obj.num_nonprotected_matches, obj.avg_score_protected,
                obj.avg_score_nonprotected, obj.avg_score_protected_matches, obj.avg_score_nonprotected_matches];

                htmlRes = tableBuilder(header, body, 'statistics-table');
                $('#datasets-info-container').html(htmlRes);
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)
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
            //If there is no exception 
            if (data.exception == undefined) {
                if (data.status == 'uploaded')
                    pretty_alert('success', 'Done!', 'Dataset has been uploaded successfully!')

                else if (data.status == 'nofile')
                    pretty_alert('error', 'Error!', 'You did not select a dataset to upload!')

                else if (data.status == 'datasetexists')
                    pretty_alert('error', 'Error!', 'A duplicate dataset\'s name found on the system!')

                else
                    pretty_alert('error', 'Error!', 'Dataset\s file extention should be .zip!')
                setTimeout(function () { location.reload(); }, 3000);
            }
            //If there is an exception, print details about it
            else print_exception(data.exception_type, data.exception, data.filename, data.func_name, data.line_number)
        }
    });
}

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "/requests/getDatasetsNames",
        success: function (response) {
            //If there is no exception 
            if (response.exception == undefined) {
                datasets_names_list = response.datasets_list
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
                    
                    
                    datasets_without_condition = response.datasets_without_condition
                    datasets_without_condition.forEach(item =>
                        datasets_without_condition.push(item)
                    );
                }
            }
            //If there is an exception, print details about it
            else print_exception(response.exception_type, response.exception, response.filename, response.func_name, response.line_number)
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
        success: function (response) {
            //If there is no exception 
            if (response.exception == undefined) {
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
            }
            //If there is an exception, print details about it
            else print_exception(response.exception_type, response.exception, response.filename, response.func_name, response.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getExplanation() {
       
    if (has_condition() == false) 
        return;  

    $('#fairer-container').html('<div class="loader"></div><p style="text-align:center; margin-top:1%">Please wait as this may take a few minutes...</p>')
    var dataset = $('#dataset-val').val()

    $.ajax({
        type: "GET",
        url: "/requests/getExplanation?dataset=" + dataset,
        dataType: 'text',
        success: function (response) {
            const obj = JSON.parse(response);
            //If there is no exception 
            if (obj.exception == undefined) {
                var image1 = new Image();
                image1.src = 'data:image/png;base64,' + obj.base64_1;
                image1.id = 'explanation-img'
                $('#fairer-container').html(image1);

                var image2 = new Image();
                image2.src = 'data:image/png;base64,' + obj.base64_2;
                image2.id = 'explanation-img'
                $('#fairer-container').append(image2);
            }
            //If there is an exception, print details about it
            else print_exception(obj.exception_type, obj.exception, obj.filename, obj.func_name, obj.line_number)
        },
        error: function (error) {
            console.log(error);
        }
    });
}