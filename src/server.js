const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: '*'
}));

const bodyParser = require('body-parser');

const bitmessage = require('./lib/main')('localhost', 8444, 'rafaelabne', '123456')

//setting up confg file
app.listen(3000, () => {
    console.log(`server started on PORT: 3000 in node js.`)
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());   


app.post('/createRandomAddress', (req, res) => {
    try {
        let { address } = req.body;
        bitmessage.addresses.createRandom(address, function (cb) {
            return res.json(cb)
        })
    } catch (err) {
        console.dir(err);
    }
});

app.post('/sendMessage', (req, res) => {
    try {
        let { toAddress, fromAddress, message, subject } = req.body;
        bitmessage.messages.send(toAddress, fromAddress, subject, message, function (cb) {
            return res.json(cb)
        })
    } catch (err) {
        console.dir(err);
    }
});

app.get('/getMessages', (req, res) => {
    try {
        bitmessage.messages.inbox.list(function (cb) {
            return res.json(cb)
        })
    } catch (err) {
        console.dir(err);
    }
});

app.get('/getAllInboxMessagesIds', (req, res) => {
    try {
        bitmessage.messages.inbox.listInboxMessagesIds(function (cb) {
            return res.json(cb)
        })
    } catch (err) {
        console.dir(err);
    }
});

app.get('/getAllInboxMessages', (req, res) => {
    try {
        bitmessage.messages.inbox.list(function (cb) {
            return res.json(cb)
        })
    } catch (err) {
        console.dir(err);
    }
});

app.post('/getSentMessagesBySender', (req, res) => {
    try {
        let { fromAddress } = req.body;
        bitmessage.messages.sent.getSentMessagesBySender(fromAddress, function (cb) {
            return res.json(cb)
        })
    } catch (err) {
        console.dir(err);
    }
});

app.get('/getAllMessagesSent', (req, res) => {
    try {
        bitmessage.messages.sent.list(function (cb) {
            return res.json(cb)
        })
    } catch (err) {
        console.dir(err);
    }
});

app.get('/getMessageId', (req, res) => {
    try {
        let { id, read } = req.query;
        let res2 = bitmessage.messages.inbox.single(id, function(cb){
            return res.json(cb);
        }, true);
    } catch (err) {
        console.dir(err);
    }
});

app.get('/getContactsBook', (req, res) => {
    try {
        bitmessage.addressbook.list(function(cb){
            return res.json(cb);
        });
    } catch (err) {
        console.dir(err);
    }
});

app.delete('/deleteContactBook', (req, res) => {
    try {
        let { address } = req.body;
        bitmessage.addressbook.deleteEntry(address, function(cb){
            return res.json(cb);
        });
    } catch (err) {
        console.dir(err);
    }
});

app.post('/addAddressBook', (req, res) => {
    try {
        let { address, label } = req.body;
        bitmessage.addressbook.addEntry(address, label, function(cb){
            return res.json(cb);
        });
    } catch (err) {
        console.dir(err);
    }
});