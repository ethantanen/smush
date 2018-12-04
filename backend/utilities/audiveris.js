

var file_path = ""
var text = "-export -batch"

$.ajax({
  type: "POST",
  url: "Audiveris/bin/Audiveris",
  data: { param: text+file_path}
}).done(function( o ) {
   // do something
});
