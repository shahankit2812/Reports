module.exports.generateTemplate = (result,refinedTest)=>{
    return `<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Report</title>
</head>
<body>
    <div>
<label>
    Test results for ${result.name}
</label>
</div>
<br>
<div>
<table border="1" id="myTable">
        <tr>
            <th>
                S.No.
            </th>
            <th onclick="sortTable(1)">
                Result (Sorted Column)
            </th>
            <th>
                Test Case
            </th>
            <th>
                Browsers
            </th>
        </tr>
        ${Object.values(refinedTest).map(test, Object.values(refinedTest).findIndex(test)).join('')}
    </table>
    </div>
    <script src="sortTable.js"></script>
</body>
</html> `
}

function test(t, index) {
    return `<tr>
    <td>
        ${index}
    </td>
    <td>
        ${t.errs.length == 0 ? 'Passed' : 'Failed'}
    </td>
    <td>
        ${t.name}
    </td>
    <td>
        ${t.userAgent}
    </td>
</tr>`
}