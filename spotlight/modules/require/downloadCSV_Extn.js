define(function () {
  return {
    commonDownloadCSV: function(list, fileName){
      
      var json = list;

      var fields = Object.keys(json[0]);
      var replacer = function(key, value) { return value === null ? '' : value; }; 
      var csv = json.map(function(row){
        return fields.map(function(fieldName){
          return JSON.stringify(row[fieldName], replacer);
        }).join(',');
      });
      csv.unshift(fields.join(',')); 
      var csvcontent = "data:text/csv;charset=utf-8," + csv.join('\r\n');
      var encodedUri = encodeURI(csvcontent);

      var downloadLink = document.createElement("a");
      downloadLink.href = encodedUri;
      downloadLink.download = fileName;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
});