const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ababilit:bYpBAUmDZ4sGf8Y@cluster0.dmtd1.mongodb.net/online-help-bd?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

app.use(bodyParser.json());
app.use(cors());





client.connect(err => {
    const usersCollection = client.db("online-help-bd").collection("users");
    const ordersCollection = client.db("online-help-bd").collection("orders");

    app.get('/', (req, res) => {
        res.send('Database Connected')
    })




    app.post('/adduser', (req, res) => {
        usersCollection.find({ email: req.body.email })
            .toArray((err, existUser) => {
                if (existUser.length) {
                    res.send(existUser[0])

                } else {
                    usersCollection.insertOne(req.body)
                        .then(result => {
                            res.send(req.body);
                        })
                }
            })
    });





    app.post('/neworder', (req, res) => {
        console.log(req.body)
        ordersCollection.insertOne(req.body)
            .then(result => {
               console.log(result)

            })

    });



    app.get('/users', (req, res) => {
        usersCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })



});


app.listen(process.env.PORT || 5000)