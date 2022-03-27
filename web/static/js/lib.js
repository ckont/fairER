function editCondition(){  
    getPredictions('fairER', 'general-container') //show predictions
    var htmlRes =   '<div class="mb-3">'+
                        '<label for="protected-textarea" class="form-label"><b>Edit Protected Condition</b></label>'+
                        '<textarea class="form-control" id="protected-textarea" rows="3" cols="100"></textarea>'+
                        '<br><button type="button" class="btn btn-success" onclick="postProtectedCondition()">Send</button>'+
                    '</div>';
    $('#protected-container').html(htmlRes)
    getCondition('protected-textarea')
}


/* Radio button (right or left) */
function getTableOptions(){
    $('#general-container').html('')
    var htmlRes =   '<b>Select the table proper table:</b><div class="form-check">'+
                        '<input class="form-check-input" type="radio" id="left-radio" onclick="getAttributes(\'left\')">'+
                        '<label class="form-check-label" for="left-radio">Left</label>'+
                    '</div>'+
                    '<div class="form-check">'+
                        '<input class="form-check-input" type="radio" id="right-radio" onclick="getAttributes(\'right\')">'+
                        '<label class="form-check-label" for="right-radio">Right</label>'+
                    '</div>';
    $('#protected-container').html(htmlRes)
}

function tupleAttributesToInput(attr_list, table) {
    var htmlRes = '</div> <form id="attr-form">';

    for (var value of attr_list) {
        htmlRes += '<div><label for="' + value + '" class="form-label"><b>' + value + '</b></label>';
        htmlRes += '<input type="text" class="form-control" id="' + value + '"></div>';
    }

    htmlRes += '<br><button type="button" class="btn btn-success" onclick="getTupleIsProtected(\''+table+'\')">Check</button></form>';
    htmlRes +=  '<p id="or-keyword"><b>Or</b></p><div class="mb-3">'+
                    '<label for="formFile" class="form-label"><b>Upload your json file</b></label>'+
                    '<input class="form-control" type="file" id="formFile" accept=".json">'+
                    '<button type="button" class="btn btn-link" onclick="json_tupple_info()">JSON file structure</button>'+
                '</div>';
    return htmlRes;
}
/* Message showing the right json structure to represent a tuple */
function json_tupple_info(){
    JSONsample =    '{ "<b>attributes</b>" : [ <br>{ "Beer_Name" : "Rocket City Red" },<br>'+
                    '{ "Brew_Factory_Name" : "Tarraco Beer"},<br>'+
                     '            ...          <br>'+
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

    htmlRes += "<br><button type='button' class='btn btn-success' onclick='getPairIsProtected();'>Check</button></form>";
    htmlRes +=  '<p id="or-keyword"><b>Or</b></p><div class="mb-3">'+
                    '<label for="formFile" class="form-label"><b>Upload your json file</b></label>'+
                    '<input class="form-control" type="file" id="formFile" accept=".json" multiple>'+
                    '<button type="button" class="btn btn-link" onclick="json_pair_info()">JSON file structure</button>'+
                '</div>';
    return htmlRes;
}
/* Message showing the right json structure to represent a pair */
function json_pair_info(){
    JSONsample =    '{ "<b>right_table</b>" : <br>[ { "Beer_Name" : "Rocket City Red" },<br>'+
                    '{ "Brew_Factory_Name" : "Tarraco Beer"},<br>'+
                     '            ...          <br>'+
                    '{ "RAttributeN" : "RvalueN"} ] }<br><br><b>and</b><br><br>'

    JSONsample +=    '{ "<b>left_table</b>" : [ <br>{ "Beer_Name" : "Ruby Red American Ale" },<br>'+
                    '{ "Brew_Factory_Name" : "Tarraco Beer"},<br>'+
                     '            ...          <br>'+
                    '{ "LAttributeM" : "LvalueM"} ] }<br>'
    
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

function getExplanation(){
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
    table = '<table class="table" id="'+id+'"><thead><tr>';

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

function pretty_alert(icon, title, text){
    Swal.fire({
        position: 'center',
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: false,
        timer: 3000
    })
}
