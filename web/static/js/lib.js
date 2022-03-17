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

    if (option == "select") {
        upload_dataset.hide();
        select_dataset.show();
        evaluation_button.prop('disabled', false);
    }
    else {
        $('#table-container').html("");
        upload_dataset.show();
        select_dataset.hide();
        evaluation_button.prop('disabled', true);
    }
}

function clearTables() {
    $('#table-container').html(""); 
}

function simpleTableBuilder(header, body) {
    str = tableInitPart;

    for (var hVal of header)
        str += '<th scope="col">' + hVal + '</th>'
    str += '</tr></thead><tbody><tr>'

    for (var bVal of body)
        str += '<td>' + bVal + '</td>'
    str += '</tr></tbody></table>'

    return str;
}


const tableInitPart = '<button type="button" class="btn btn-danger" onclick="clearTables();">Clear Table</button>' +
    '<button type="button" class="btn btn-success" onclick="htmlToCSV();">Download as CSV</button>' +
    '<br><br><table class="table" id="table"><thead><tr>';


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