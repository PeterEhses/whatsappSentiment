function downloadObjectAsJson(exportObj, exportName){

  document.body.innerHTML = "<div id='green'></div>";

   /*var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
   var downloadAnchorNode = document.createElement('a');
   var linkText = document.createTextNode("Download "+exportName);
   downloadAnchorNode.appendChild(linkText);
   downloadAnchorNode.setAttribute("href",     dataStr);
   downloadAnchorNode.setAttribute("download", exportName + ".json");
   document.body.appendChild(downloadAnchorNode);
   */
 }

// not working with large file sizes (10k lines required)
