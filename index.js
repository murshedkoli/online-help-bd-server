const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');


const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://ababilit:bYpBAUmDZ4sGf8Y@cluster0.dmtd1.mongodb.net/online-help-bd?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()

app.use(bodyParser.json());
app.use(cors());





client.connect(err => {
    const usersCollection = client.db("online-help-bd").collection("users");
    const ordersCollection = client.db("online-help-bd").collection("orders");
    const rechargeRequestCollection = client.db("online-help-bd").collection("recharge-request");
    const admin = client.db("online-help-bd").collection("admin");
    const vouchersCollection = client.db("online-help-bd").collection("vouchers");

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
        ordersCollection.insertOne(req.body)
            .then(result => {
                res.send(result)

            })

    });


    
    app.post('/newvoucher', (req, res) => {
        vouchersCollection.insertOne(req.body)
            .then(result => {
                res.send(result)

            })

    });


    app.post('/recharge-request', (req, res) => {
        rechargeRequestCollection.insertOne(req.body)
            .then(result => {
                res.send(result)

            })

    });



    app.get('/users', (req, res) => {
        usersCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/vouchers', (req, res) => {
        vouchersCollection.find()
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/voucher', (req, res) => {
        vouchersCollection.find({email: req.query.email})
            .toArray((err, document) => {
                res.send(document[0]);
            })
    })


    app.get('/single-user', (req, res) => {
        usersCollection.find({ email: req.query.email })
            .toArray((err, document) => {
                res.send(document[0]);
            })
    })

    app.get('/orders', (req, res) => {
        admin.find({ email: req.query.email })
            .toArray((err, document) => {
                if (document.length) {
                    ordersCollection.find()
                        .toArray((err, documents) => {
                            res.send(documents);
                        })
                } else {
                    ordersCollection.find({ email: req.query.email })
                        .toArray((err, documents) => {
                            res.send(documents);
                        })
                }
            })
    })


    app.get('/recharge-requests', (req, res) => {
        admin.find({ email: req.query.email })
            .toArray((err, document) => {
                if (document.length) {
                    rechargeRequestCollection.find()
                    .toArray((err, documents) => {
                        res.send(documents);
                    })
                } else {
                    rechargeRequestCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents);
            })
                }
            })
       
        
    })


    app.get('/pendingorders', (req, res) => {
        admin.find({ email: req.query.email })
            .toArray((err, documents) => {
                if (documents.length) {
                    ordersCollection.find({ status: 'pending' })
                        .toArray((err, documents) => {
                            res.send(documents);
                        })
                } else {
                    ordersCollection.find({ status: 'pending', email: req.query.email })
                        .toArray((err, documents) => {
                            res.send(documents);
                        })
                }
            })
    })

    app.get('/completeorders', (req, res) => {
        admin.find({ email: req.query.email })
        .toArray((err, document) => {
            if (document.length) {
                ordersCollection.find({ status: 'complete' })
                    .toArray((err, documents) => {
                        res.send(documents);
                    })
            } else {
                ordersCollection.find({ status: 'complete', email: req.query.email })
                    .toArray((err, documents) => {
                        res.send(documents);
                    })
            }
        })
    })

    app.get('/singleorder', (req, res) => {
        ordersCollection.find({ _id: ObjectId(req.query.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })


    app.get('/single-recharge', (req, res) => {
        rechargeRequestCollection.find({ _id: ObjectId(req.query.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })



    app.get('/loggedUser', (req, res) => {
        usersCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })



    app.patch('/confirm/:id', (req, res) => {
        const id = req.params.id;
        const data = req.body;

        usersCollection.updateOne({ _id: ObjectId(id) },
            { $set: { balance: data.ammount } }
        )
            .then(result => {
                res.send(result)

            })


    })




    app.patch('/updatestatus/:id', (req, res) => {
        const id = req.params.id;
        const data = req.body;

        ordersCollection.updateOne({ _id: ObjectId(id) },
            { $set: { status: data.orderStatus, attachment: data.idUrl } }
        )
            .then(result => {
                res.send(result)

            })


    })


    app.patch('/update-recharge/:id', (req, res) => {
        const id = req.params.id;
        const data = req.body;

        rechargeRequestCollection.updateOne({ _id: ObjectId(id) },
            { $set: { status: 'Complete' } }
        )
            .then(result => {

                usersCollection.updateOne({ email: data.email },
                    { $set: { balance: data.paymentAmmount } }
                )

                res.send(result)


            })


    })



    console.log('connected')

});


app.listen(process.env.PORT || 5000)