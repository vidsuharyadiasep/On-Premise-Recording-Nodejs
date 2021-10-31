const express = require('express')
const app = express()
const port = 3000
const RecordManager = require('./recordManager')
let appid = '<APPID dari Account Agora>'
let key = ''

app.use(express.json());

// TESTING 
app.get('/', (req, res) => {
    res.send('Hello From Agora On-Premise Recording Server');
  });

app.post('/recorder/v1/start', (req, res, next) => {
    let { body } = req;
    let { channel } = body;
    if (!appid) {
        throw new Error("appid is mandatory");
    }
    if (!channel) {
        throw new Error("channel is mandatory");
    }

    RecordManager.start(key, appid, channel).then(recorder => {
        //start recorder success
        res.status(200).json({
            success: true,
            sid: recorder.sid
        });
    }).catch((e) => {
        //start recorder failed
        next(e);
    });
})

app.post('/recorder/v1/stop', (req, res, next) => {
    let { body } = req;
    let { sid } = body;
    if (!sid) {
        throw new Error("sid is mandatory");
    }

    RecordManager.stop(sid);
    res.status(200).json({
        success: true
    });
})

//Handle Request from Client UI
app.post('/recorder/v1/start:channel', (req, res, next) => {
    let  { channel } = req.params.channel;
    if (!channel) {
        throw new Error("channel is mandatory");
    }

    RecordManager.start(key, appid, channel).then(recorder => {
        //start recorder success
        res.status(200).json({
            success: true,
            sid: recorder.sid
        });
    }).catch((e) => {
        //start recorder failed
        next(e);
    });
})

app.post('/recorder/v1/stop:sid', (req, res, next) => {
    let { sid } = req.params.sid;
    if (!sid) {
        throw new Error("sid is mandatory");
    }

    RecordManager.stop(sid);
    res.status(200).json({
        success: true
    });
})

app.use( (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        err: err.message || 'generic error'
    })
})

app.listen(port)