// ------ Payload handling point -------- \\
const replace = require('replace-in-file');
const Busboy = require('busboy');
const express = require('express');
const bp = require('body-parser')
const path = require('path');
const app = new express();


const PORT = 80; // Change Port here if needed

app.use(bp.json())
app.use(bp.urlencoded({
  extended: true
}))

app.post('/', async function(req, res, next) {
  const busboy = new Busboy({
    headers: req.headers
  });
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
app.listen(PORT, () => console.log(`\n========\n- PLex2Mail.Js listening for webhooks on port ${PORT} -\n========\n`));

// ----- Mailing List Handeling ------\\

var fs = require("fs");
var mailinglist = fs.readFileSync("mailinglist/mailing list.txt").toString('utf-8');
var emails = mailinglist.split("\n");

const { provider } = require('./Config.json');

if (provider == "gmail") {
  console.log("=======\nYou have selected Gmail as your mail manager!\n=======\n")
}
if (provider == "Yahoo") {
  console.log("=======\nYou have selected Yahoo as your mail manager!\n=======\n")
}
if (provider == "Outlook") {
  console.log("=======\nYou have selected Outlook as your mail manager!\n=======\n")
}
else {
  console.log(`=======\n Plex2Mail does not currently support this Email service. Please go to http://localhost:${PORT}/\n=======\n`)
};

app.get('/UpdatedMailingList', function(req, res) {
	res.set('Content-Type', 'text/plain');
  res.sendFile(__dirname + "/mailinglist/" + "mailing list.txt" );
});

app.use('/mailinglist', express.static(path.join(__dirname, 'mailinglist')));

app.use('/settings', express.static(path.join(__dirname, 'mailinglist')));

app.use('/listcontent', express.static(path.join(__dirname, 'mailinglist')));

app.post('/AddToMailList', function(req, res) {
  var data = req.body.email;
  var email = "" + data;
  console.log(req.body);

  fs.readFile('mailinglist/mailing list.txt', function(err, data) {
    if (err) throw err;
    if (data.includes(email)) {
      console.log(`=======\n${req.body.email} is already in the mailing list!\n=======\n`)
    } else {
      fs.appendFile('mailinglist/mailing list.txt', email + '\r\n', function(err) {
        if (err) throw err;
        console.log(`=======\n${req.body.email} Added\n=======\n`)

        res.redirect(301, '/mailinglist');
      });
    }
  });
});

app.post('/RemoveFromMailList', function(req, res) {

  var data = req.body.email;
  var email = "" + data;

  const options = {
    files: 'mailinglist/mailing list.txt',
    from: email,
    to: ' ',
  };

  try {
    const results = replace.sync(options);
    if (results.hasChanged === "True"){
      console.log(`=======\n${req.body.email} has been removed\n=======\n`);
    }
  } catch (error) {
    console.log(`=======\n`)
    console.error(`Could Not Remove Email: ${req.body.email}\nError:`, error);
    console.log('\n=======\n')
  }
  res.redirect(301, 'mailinglist');
});
// Error Logging Stuff

process.on('unhandledRejection', (reason, p) => {

});
