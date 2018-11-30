// have function that takes base64 encoded image and returns musicXML
// moonlight should have a python api but theres a chance we'll need to
// execute bash commands from the node environment

var ps = require('python-shell');

var express = require('express');
var app = express();

//Currently throws an error that the file cannot be found
app.listen(3000, function () {
  console.log('server running on port 3000');
})

app.get('/moonlight', callMoonlight);

function callMoonlight(req, res){
    var options = {
      pythonPath: '/usr/local/bin/python2',
      args: [req.query.image], //input image to be processed
      pythonOptions: ['--output_type=MusicXML']
    }
    ps.PythonShell.run('./moonlight/bazel-bin/moonlight/omr2', options,
      function(err, data){
        if (err) res.send(err);
        res.send(data.toString())

      });
}
