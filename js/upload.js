function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.
  // files is a FileList of File objects. List some properties.
  for (var i = 0, f; f = files[i]; i++) {
      if (!f.type.match('text.*')) {
        array.splice(f, 1);
      }
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
           Data_Store.setText(e.target.result);
         };
      })(f);

      reader.readAsText(f, "utf-8");
      document.body.innerHTML = "<div id='green'></div><div id='buttons'> <button onclick='counterplus()'>Nächste Nachricht</button> <button onclick='switchopacity()'>Anderen Nutzer Fokussieren</button> <div id='status'><p id='user'>user</p><p id='time'>time</p></div> </div>";
      //globeinit();

  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);
