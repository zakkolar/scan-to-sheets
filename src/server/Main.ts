function showRowScanner(){
    const html = HtmlService.createHtmlOutputFromFile("ui/ScanToRow")
        .setTitle('Scan to row')
        .setWidth(300)
    SpreadsheetApp.getUi().showSidebar(html);

}
// @ts-ignore
global.showRowScanner = showRowScanner;


function onOpen(){
    SpreadsheetApp.getUi().createMenu("Barcode Scanner Tools")
        .addItem("Scan to rows", "showRowScanner")
        .addToUi();
}
// @ts-ignore
global.onOpen = onOpen;


function getColumnList(){
    const sheet = SpreadsheetApp.getActiveSheet();
    const columns = sheet.getRange(1,1,1, sheet.getLastColumn());
    return columns.getValues()[0];
}
// @ts-ignore
global.getColumnList = getColumnList;

function formatDate() {
    const d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    return `${month}/${day}/${year}`;
}

function addRow(row){
    for(let i=0; i<row.length; i++){
        switch (row[i]){
            case "~TODAY~":
                row[i] = formatDate();
                break;
            case "~EMPTY~":
                row[i] = "";
                break;
        }
    }
    SpreadsheetApp.getActiveSheet().appendRow(row);
}
// @ts-ignore
global.addRow = addRow;
