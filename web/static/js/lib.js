function getDatasetName(index) {
    const datasetName = ["Beer", "iTunes-Amazon", "Fodors-Zagats",
        "DBLP-ACM", "DBLP-GoogleScholar", "Amazon-Google", "Walmart-Amazon"];
    return datasetName[parseInt(index)];
}

/* Open the specific URL in a new tab*/
function goToUrl(url) {
    window.open(url, '_blank');
}

/* Perform some changes in the interface according to user's choice (select or upload dataset) */
function datasetOptions(option) {
    var upload_dataset = $('#upload-dataset');
    var select_dataset = $('#select-dataset');
    var evaluation_button = $('#evaluation-button');
    var preds_button = $('#preds-button');
    var clusters_button = $('#clusters-button');

    if (option == "select") {
        upload_dataset.hide();
        select_dataset.show();
        evaluation_button.prop('disabled', false);
        preds_button.prop('disabled', false);
        clusters_button.prop('disabled', false);
    }
    else {
        $('#table-container').html("");
        upload_dataset.show();
        select_dataset.hide();
        evaluation_button.prop('disabled', true);
        preds_button.prop('disabled', true);
        clusters_button.prop('disabled', true);
    }
}

function clearTables() {
    $('#table-container').html("");
    $('#protected-container').html("");
}

function tableBuilder(header, body) {
    str = tableInitPart;

    for (var hVal of header)
        str += '<th scope="col">' + hVal + '</th>'
    str += '</tr></thead><tbody><tr>'

    for (var bVal of body)
        str += '<td>' + bVal + '</td>'
    str += '</tr></tbody></table>'

    return str;
}


function htmlToCSV(filename) {
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

function predsTableBuilder(jsonData) {
    str = "";
    i = 0;
    indexH = 0;
    var body = [];
    var header = [];
    var temp = [];
    for (var k in jsonData) {
        if (jsonData.hasOwnProperty(k)) {
            Object.keys(jsonData[k]).forEach(function (key) {
                header[indexH++] = key;
                if (key == header[0])
                    i = 0;
                temp.push([i++, jsonData[k][key]]);
            })
        }
    }
    temp.forEach(function (item) {
        body.push(item[1])
    });
    header = header.slice(0, i);
    str = tableInitPart;

    for (var hVal of header)
        str += '<th scope="col">' + hVal + '</th>'
    str += '</tr></thead><tbody><tr>'


    counter = 0;
    for (var bVal of body) {

        str += '<td>' + bVal + '</td>';
        counter++;
        if (counter == i) {
            str += "</tr><tr>";
            counter = 0;
        }
    }
    str = str.substring(0, str.length - 4);
    str += '</tbody></table>';

    return str;
}

function clustersTableBuilder(header, body) {
    str = tableInitPart;

    for (var hVal of header)
        str += '<th scope="col">' + hVal + '</th>'
    str += '</tr></thead><tbody>'

    for (index = 0; index < body.length; index++) {
        str += "<tr>"
        for (var bVal of body[index])
            str += '<td>' + bVal + '</td>'
        str += "</tr>"
    }
    str += '</tbody></table>'

    return str;
}

/* Return 'right' if the param string begins with the word "right"
   otherwise return 'left' */
function leftOrRightTable(str) {
    var temp = str.substring(0, 5);
    if (temp == 'right')
        return temp;
    else
        return 'left';
}

function clearPrefix(str) {
    if (leftOrRightTable(str) == 'right')
        return str.substring(6);
    else
        return str.substring(5);
}


function leftOrRight() {
    clearTables();
    $('#protected-container').show();
    str = '<p><b>Select left or right table: </b></p>' +
        '<div class="form-check form-check-inline">' +
        '<input class="form-check-input" type="radio"id="rightOption"' +
        'onclick="getAttributes(\'right\')">' +
        '<label class="form-check-label" for="rightOption">Right</label>' +
        '</div>' +
        '<div class="form-check form-check-inline">' +
        '<input class="form-check-input" type="radio" id="leftOption" ' +
        '  onclick="getAttributes(\'left\')">' +
        '<label class="form-check-label" for="leftOption">Left</label>' +
        '</div>' +
        '<button type="button" class="btn btn-primary btn-sm margin-l-r" id="check-protected-button" style="display: none;"' +
        'onclick="getTupleIsProtected()">Check' +
        '</button>';
    $('#protected-container').html(str);
}

function tupleAttributesToInput(attr_list, arg) {
    var htmlRes = '<form id="attr-form">';


    for (var value of attr_list) {
        htmlRes += '<div><label for="' + value + '" class="form-label">' + value + '</label>';
        htmlRes += '<input type="text" class="form-control" id="' + value + '"></div>';
    }

    htmlRes += "</form><p id='" + arg + "'></p>";
    htmlRes += "<div class='break'></div><button type='button' class='btn btn-success' onclick='getTupleIsProtected();'>Check</button>";
    return htmlRes;
}


function pairAttributesToInput(obj1, obj2) {
    var htmlRes = '<form id="attr-form"><br><h2>Right Table Attributes</h2><br>';


    for (var value of obj1) {
        htmlRes += '<div><label for="right-' + value + '" class="form-label">' + value + '</label>';
        htmlRes += '<input type="text" class="form-control" id="right-' + value + '"></div>';
    }

    htmlRes += '<br></br><h2>Left Table Attributes</h2><br>'

    for (var value of obj2) {
        htmlRes += '<div><label for="left-' + value + '" class="form-label">' + value + '</label>';
        htmlRes += '<input type="text" class="form-control" id="left-' + value + '"></div>';
    }

    htmlRes += "</form>";
    htmlRes += "<div class='break'></div><button type='button' class='btn btn-success' onclick='getPairIsProtected();'>Check</button>";
    return htmlRes;
}

const tableInitPart = '<button type="button" class="btn btn-danger" onclick="clearTables();">Clear Table</button>' +
    '<button type="button" class="btn btn-success" onclick="htmlToCSV();">Download as CSV</button>' +
    '<br><br><table class="table" id="table"><thead><tr>';
