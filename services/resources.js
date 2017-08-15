var fs = require("fs");
var path = require("path");
var async = require("async");

var RES_DIR = "resources";

var cache; 

app.get("/res.css", function(req, res, next) {
	res.setHeader("Content-Type", "text/css");
	if (cache) return res.end(cache);

	fs.readdir(path.join(process.cwd(), RES_DIR), function(err, files) {
		if (err) {
			console.error(err);
			res.end(500);
			return;
		}

		files = files
			.filter(function(fname) { return fname.match(".png$") });

		var lines = [], stylesheet;

		async.each(files, function(fname, cb) {
			var className = fname.split(".").slice(0,-1).join(".");
			fs.readFile(path.join(RES_DIR, fname), function(err, buf) {
				if (err) return cb(err);
				lines.push("."+className+" { background-image: url('data:image/png;base64,"+buf.toString("base64")+"'); }");
				cb();
			});
		}, function(err) {
			if (err) { 
				console.error(err);
				res.end(500);
				return;
			}

			stylesheet = lines.join("\n");
			if (process.env.NODE_ENV=="production") cache = stylesheet;
			res.end(stylesheet);
		});
	});
});

exports = app;