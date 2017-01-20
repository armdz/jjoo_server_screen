var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
app.post('/upload', function(req, res){

  var form = new formidable.IncomingForm();
  var fields = [];

  form.multiples = true;
  form.uploadDir = path.join(__dirname, '/users/img');

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  form.on('field', function(name, field) {
     fields.push('"' +name+ '"'+ ':'+'"'+field+'"')
  });

  form.on('close',function(err){
 

  });

  form.on('error', function(err) {
    console.log('*** ERROR ****: \n' + err);
  });

  form.on('end', function() {
  	var str = '{'+fields.toString() +'}'
 	var to_save = JSON.parse(str)
 	console.log("*** USER DATA ****");
 	console.log(to_save);
 	console.log("*** *** *** ****");

 	var data_file_json = [];
	if (fs.existsSync('data.json')) {
		var data_file = fs.readFileSync('data.json');
		data_file_json = JSON.parse(data_file);
	}
	data_file_json.push(to_save);
	var data_to_save = JSON.stringify(data_file_json,null,2);
	fs.writeFileSync('data.json', data_to_save);

    res.end('*** SUCCESS ***');
    console.log('*** SUCCESS ***');
  });

  form.parse(req);

});

var server = app.listen(3000, function(){
	const targetDir = 'users/img';
	targetDir.split('/').forEach((dir, index, splits) => {
	  const parent = splits.slice(0, index).join('/');
	  const dirPath = path.resolve(parent, dir);
	  if (!fs.existsSync(dirPath)) {
	    fs.mkdirSync(dirPath);
	  }
	});
  	console.log('Server corriendo en 3000');
});