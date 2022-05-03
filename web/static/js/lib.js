function editCondition() {
    var htmlRes = '<div class="mb-3">' +
        '<label for="old-protected-condition" class="form-label"><b>Old Protected Condition</b></label>' +
        '<div id="old-protected-condition"></div>' +
        '</div><br><br>';
    $('#protected-container').html(htmlRes)
    getCondition('old-protected-condition') //'<br><button type="button" class="btn btn-success" onclick="postProtectedCondition()">Send</button>' +
    show_condition_input_fields('protected-container')

    getPredictions('fairER', 'general-container') //show predictions
}

function show_condition_input_fields(container) {
    $("#protected-container").css("display", "block");
    var htmlRes = '<div id="change-condition-inputs">'
    htmlRes += '<div id="left-table"><label for="left-tbl" class="form-label"><b>Left Table Attribute</b></label>'
    htmlRes += '<select class="form-select" id="left-tbl"></select>'

    htmlRes += '<label for="left-value" class="form-label"><b>Left Attribute Value</b></label>';
    htmlRes += '<input type="text" class="form-control" id="left-value"></div>';

    htmlRes += '<div id="right-table"><label for="right-tbl" class="form-label"><b>Right Table Attribute</b></label>'
    htmlRes += '<select class="form-select" id="right-tbl"></select>'
    htmlRes += '<label for="right-value" class="form-label"><b>Right Attribute Value</b></label>';
    htmlRes += '<input type="text" class="form-control" id="right-value"></div>';

    htmlRes += '</div><br><button type="button" class="btn btn-secondary" style="margin:0" onclick="constract_new_condition()">Constract Condition</button>'
    htmlRes += '<div id="new-cond-container"></div>'
    $('#' + container).append(htmlRes)
    fill_dropdowns()
}

function fill_dropdowns() {
    var dataset = $('#dataset-val').val()
    $.ajax({
        type: "GET",
        url: "/requests/getTableAttributes?dataset=" + dataset + "&table=left",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            first_attr = obj.shift();
            $('#left-tbl').html('<option value="' + first_attr + '" selected>' + first_attr + '</option>')

            obj.forEach(item =>
                $('#left-tbl').append('<option value="' + item + '">' + item + '</option>')
            );
        },
        error: function (error) {
            console.log(error);
        }
    });
    $.ajax({
        type: "GET",
        url: "/requests/getTableAttributes?dataset=" + dataset + "&table=right",
        contentType: "application/json",
        dataType: 'text',
        success: function (response) {
            var obj = JSON.parse(response);
            first_attr = obj.shift();
            $('#right-tbl').html('<option value="' + first_attr + '" selected>' + first_attr + '</option>')
            obj.forEach(item =>
                $('#right-tbl').append('<option value="' + item + '">' + item + '</option>')
            );
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function constract_new_condition(container) {
    left_attribute = $("#left-tbl").val();
    left_value = $("#left-value").val();
    right_attribute = $("#right-tbl").val();
    right_value = $("#right-value").val();

    new_condition = '("' + left_value + '" in str(tuple.left_' + left_attribute + ')) or ("' + right_value + '" in str(tuple.right_' + right_attribute + '))'
    var htmlRes = '<br><br><b>New Protected Condition</b><br>' + new_condition
    htmlRes += '<br><br><button type="button" class="btn btn-success" style="margin:0" onclick="postProtectedCondition()">Send</button>'
    $("#new-cond-container").html(htmlRes)
}

/* Radio button (right or left) */
function getTableOptions() {
    $('#general-container').html('')
    var htmlRes = '<b>Table:</b><div class="form-check">' +
        '<input class="form-check-input" type="radio" id="left-radio" onclick="getAttributes(\'left\')">' +
        '<label class="form-check-label" for="left-radio">Left</label>' +
        '</div>' +
        '<div class="form-check">' +
        '<input class="form-check-input" type="radio" id="right-radio" onclick="getAttributes(\'right\')">' +
        '<label class="form-check-label" for="right-radio">Right</label>' +
        '</div>';
    $('#protected-container').html(htmlRes)
}

function tupleAttributesToInput(attr_list, table) {
    var htmlRes = '</div> <form id="attr-form">';

    for (var value of attr_list) {
        htmlRes += '<div><label for="' + value + '" class="form-label"><b>' + value + '</b></label>';
        htmlRes += '<input type="text" class="form-control" id="' + value + '"></div>';
    }

    htmlRes += '<button type="button" class="btn btn-success" onclick="tupleIsProtected(\'' + table + '\')">Check</button></form>';
    htmlRes += '<p id="or-keyword"><b>Or</b></p><div class="mb-3">' +
        '<form enctype="multipart/form-data" id="json-upload-form">' +
        '<label for="json-upload-file" class="form-label">Upload your json file</label>' +
        '<input class="form-control" name="json-upload-file" type="file" id="json-upload-file" accept=".json">' +
        '<button type="button" class="btn btn-success" onclick="tupleIsProtectedJSON(\'' + table + '\')">Upload</button>' +
        '<button type="button" class="btn btn-link" onclick="json_tupple_info()">JSON file structure</button>' +
        '</form>';
    '</div>';
    return htmlRes;
}

/* Message showing the right json structure to represent a tuple */
function json_tupple_info() {
    JSONsample = '{ "<b>attributes</b>" : [ <br>{ "Beer_Name" : "Rocket City Red" },<br>' +
        '{ "Brew_Factory_Name" : "Tarraco Beer"},<br>' +
        '            ...          <br>' +
        '{ "AttributeN" : "valueN"} ] }'
    Swal.fire('Example', JSONsample, 'info')
}

function pairAttributesToInput(right_obj, left_obj) {
    var htmlRes = '<form id="attr-form"><br><h2>Right Table Attributes</h2><br>';

    for (var value of right_obj) {
        htmlRes += '<div><label for="right-' + value + '" class="form-label">' + value + '</label>';
        htmlRes += '<input type="text" class="form-control" id="right-' + value + '"></div>';
    }

    htmlRes += '<br></br><h2>Left Table Attributes</h2><br>'

    for (var value of left_obj) {
        htmlRes += '<div><label for="left-' + value + '" class="form-label">' + value + '</label>';
        htmlRes += '<input type="text" class="form-control" id="left-' + value + '"></div>';
    }

    htmlRes += "<br><button type='button' class='btn btn-success' onclick='pairIsProtected();'>Check</button></form>";
    htmlRes += '<p id="or-keyword"><b>Or</b></p><div class="mb-3">' +
        '<form enctype="multipart/form-data" id="json-upload-form">' +
        '<label for="json-upload-file" class="form-label">Upload your json file</label>' +
        '<input class="form-control" name="json-upload-file" type="file" id="json-upload-file" accept=".json">' +
        '<button type="button" class="btn btn-success" onclick="pairIsProtectedJSON()">Upload</button>' +
        '<button type="button" class="btn btn-link" onclick="json_pair_info()">JSON file structure</button>' +
        '</form>';
    '</div>';
    return htmlRes;
}
/* Message showing the right json structure to represent a pair */
function json_pair_info() {
    JSONsample = '{ "<b>tables</b>":<br>' +
        '[ { <b>"left"</b>: [<br>' +
        '{ "Beer_Name": "Rocket City Red" }, <br>' +
        '{ "Brew_Factory_Name": "Tarraco Beer" },<br>' +
        '                  ...<br>' +
        '{ "LAttributeN": "LValueN" } ]<br>' +
        '},<br>' +
        '[ { <b>"right"</b>: [<br>' +
        '{ "Beer_Name": "Rocket City Red" }, <br>' +
        '{ "Brew_Factory_Name": "Tarraco Beer" },<br>' +
        '                  ...<br>' +
        '{ "RAttributeM": "RValueM" } ]<br>' +
        '} ]<br>' +
        '] }<br>';


    Swal.fire('Example', JSONsample, 'info')
}



/* predictions json to html table */
function predsTableBuilder(jsonData) {
    preds_HTML_table = "";
    i = 0;
    indexH = 0;
    var body = [];
    var header = [];
    var temp = [];
    for (var value in jsonData) {
        if (jsonData.hasOwnProperty(value)) {
            Object.keys(jsonData[value]).forEach(function (key) {
                header[indexH++] = key;
                if (key == header[0])
                    i = 0;
                temp.push([i++, jsonData[value][key]]);
            })
        }
    }
    temp.forEach(function (item) {
        body.push(item[1])
    });
    header = header.slice(0, i);
    preds_HTML_table = '<table class="table" id="table"><caption style="caption-side:top" ><b>Predictions</b></caption><thead><tr>'

    for (var hVal of header)
        preds_HTML_table += '<th scope="col">' + hVal + '</th>'
    preds_HTML_table += '</tr></thead><tbody><tr>'


    counter = 0;
    for (var bVal of body) {

        preds_HTML_table += '<td>' + bVal + '</td>';
        counter++;
        if (counter == i) {
            preds_HTML_table += "</tr><tr>";
            counter = 0;
        }
    }
    preds_HTML_table = preds_HTML_table.substring(0, preds_HTML_table.length - 4);
    preds_HTML_table += '</tbody></table>';

    return preds_HTML_table;
}

function getExplanationSwitch() {
    if ($('input[type=checkbox][id=explanationSwitch]:checked').val())
        return '1'
    else
        return '0'
}

function clustersTableBuilder(header, body) {
    clusters_HTML_table = '<table class="table" id="clusters-table"><caption style="caption-side:top" ><b>Clusters</b></caption><thead><tr>'
    for (var hVal of header)
        clusters_HTML_table += '<th scope="col">' + hVal + '</th>'
    clusters_HTML_table += '</tr></thead><tbody>'

    for (index = 0; index < body.length; index++) {
        clusters_HTML_table += "<tr>"
        for (var bVal of body[index])
            clusters_HTML_table += '<td>' + bVal + '</td>'
        clusters_HTML_table += "</tr>"
    }
    clusters_HTML_table += '</tbody></table>'
    return clusters_HTML_table;
}

function tableBuilder(header, body, id) {
    table = '<table class="table" id="' + id + '"><thead><tr>';

    for (var hVal of header)
        table += '<th scope="col">' + hVal + '</th>'
    table += '</tr></thead><tbody><tr>'

    for (var bVal of body)
        table += '<td>' + bVal + '</td>'
    table += '</tr></tbody></table>'

    return table;
}


function html_table_to_csv(filename) {
    if (filename == null)
        filename = "output";
    filename += ".csv";

    var data = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        data.push(row.join(","));
    }
    downloadCSVFile(data.join("\n"), filename);
}

function downloadCSVFile(csv, filename) {
    var csv_file, download_link;
    csv_file = new Blob([csv], { type: "text/csv" });
    download_link = document.createElement("a");
    download_link.download = filename;
    download_link.href = window.URL.createObjectURL(csv_file);
    download_link.style.display = "none";
    document.body.appendChild(download_link);
    download_link.click();
}


/* Return 'right' if the param string begins with the word "right"
   otherwise return 'left' */
function attr_prefix(str) {
    var temp = str.substring(0, 5);
    if (temp == 'right')
        return temp;
    else
        return 'left';
}

function clearPrefix(str) {
    if (attr_prefix(str) == 'right')
        return str.substring(6);
    else
        return str.substring(5);
}

function print_exception(type, exception, file, func, line) {
    exception_details = '<b>Exception Type:</b> ' + type.replace(/<|>/g, '') +
                        '<br><b>Exception:</b> ' + exception +
                        '<br><b>File Name:</b> ' + file +
                        '<br><b>Function Name:</b> ' + func +
                        '<br><b>Line Number:</b> ' + line
    Swal.fire({
        icon: 'error',
        title: 'Error...',
        html: exception_details
    }).then(() => {
          location.reload();
     })
}

function pretty_alert(icon, title, text) {
    Swal.fire({
        position: 'center',
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 3000
    })
}