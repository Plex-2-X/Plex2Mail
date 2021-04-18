// ----- Mailing List Handeling ------\\
var fs = require("fs");
var mailinglist = fs.readFileSync("./mailing list.txt");
var emails = mailinglist.split("\n")

// ------ Payload handling point -------- \\

const Busboy = require('busboy');
const express = require('express');
const app = new express();

const PORT = 1337 // Change Port here if needed

app.post('/', async function(req, res, next) {
	const busboy = new Busboy({headers: req.headers});
	let payload = null;

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		file.resume(); // Still trying to figure out how to save poster images but i have a small brain so for now we are gonna skip the file saving.
	});

	busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
		if (fieldname === 'payload') {
			try {
				payload = JSON.parse(val);
			} catch (e) {
				console.log(e);
			}
		}
	});

	busboy.on('finish', async function() {
		if (payload) {

			// --- check payload.event for scrobble (aka "90% completed") --- \\

			if (payload.event === 'media.scrobble') {

				// Add IF statements for detecting types of media

				console.log(`\n========\n${payload.Account.title} finished an episode: \n= ${payload.Metadata.grandparentTitle} \n= ${payload.Metadata.parentTitle} \n= ${payload.Metadata.title}`);
			}

			// --- check payload.event for play --- \\

			if (payload.event === 'media.play') {

				// --- check media.play for episodes --- \\

				if (payload.Metadata.type === 'episode') {

				}

				// --- check media.play for movies --- \\

				if (payload.Metadata.type === 'movie') {

				}

				// --- check media.play for tracks --- \\

				if (payload.Metadata.type === 'track') {
					console.log(`track event triggered by ${payload.Account.title}`)
					// console.log(`\n========\n${payload.Account.title} is now listening to: \n= ${payload.Metadata.parentTitle} \n= ${payload.Metadata.title}\n========`);
				}

			}

			// --- check payload.event for stop --- \\

			if (payload.event === 'media.stop') {

			}

			// --- check payload.event for resume --- \\

			if (payload.event === 'media.resume') {

			}

			// --- check payload.event for pause --- \\

			if (payload.event === 'media.pause') {

			}

			if (payload.event === 'library.new') {
				// --- Check library.new for movies --- \\

				if (payload.Metadata.type === 'movie') {

				}

				// --- check library.new for episodes --- \\

				if (payload.Metadata.type === 'episode') {

					console.log("lirary.new: new episode has been added")
				}

				// --- check library.new for tracks --- \\

				if (payload.Metadata.type === 'track') {
					// Nothing here yet, Decide if you want this later.
					console.log("lirary.new: new track has been added")
				}
			}
		} else {

			console.log(`\n========\n[${payload.Account.title}] ${payload.event}: \n= ${payload.Metadata.grandparentTitle} \n= ${payload.Metadata.parentTitle} \n= ${payload.Metadata.title}\n========`);

		}
    res.writeHead(303, {
      Connection: 'close',
      Location: '/'
    });
    res.end();
	})

	return req.pipe(busboy);
});

client.once('ready', () => {
	app.listen(PORT, () => console.log(`\n========\n- Plex2Discord.Js listening for webhooks on port ${PORT} -\n========`));
});



// Error Logging Stuff

process.on('unhandledRejection', (reason, p) => {

});
