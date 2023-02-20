var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://ProyectoFinalWeb:zgFyV5wbuIJUyoTf@cluster0.ynzjk.mongodb.net/test"
const client = new MongoClient(uri);

app.use(express.static('Public'));

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use(urlencodedParser)

app.post('/APIAgregarLibro', function(req,res) {
    console.log(req.body.Autor);
    var nombre = req.body.Nombre;
    var autor = req.body.Autor;
    var fecha = req.body.Año;
    var genero = req.body.Gen;
    var estado = req.body.Estado;
    console.log(nombre + ' | ' + autor + ' | ' + fecha + '|' + genero + '|' + estado);
    libro = {"titulo": nombre, "autor": autor, "fecha": fecha, "genero": genero, "estado": estado};
    agregarLibro(libro)
    res.redirect("/home.html");
});

//Filtro de libros leidos
app.get('/APILeido', function(req,res) {

    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProyectoFinalWeb");
        var query = {estado: "Leido"}
        dbo.collection("Libros").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      }); 
});

app.get('/APIDetalles/:id', function(req,res) {
    let libro;
    console.log(req.params.id);
    var ObjectId = require("mongodb").ObjectID;

    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProyectoFinalWeb");
        var query = {_id: ObjectId(req.params.id)};
        dbo.collection("Libros").find(query).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
          })
    });
});

app.post('/APICambiarDatosLibro', function(req,res) {
    var nombre = req.body.Nombre;
    var autor = req.body.Autor;
    var fecha = req.body.Anio;
    var genero = req.body.Gen;
    var estado = req.body.Estado;
    console.log(nombre + ' | ' + autor + ' | ' + fecha + '|' + genero + '|' + estado);
    libro = {"_id": req.body.Id, "titulo": nombre, "autor": autor, "fecha": fecha, "genero": genero, "estado": estado};
    cambiarDatosLibro(libro);
    res.redirect("/home.html");
});

app.get('/APIEliminar/:id', function(req,res) {
    var ObjectId = require("mongodb").ObjectID;

    id = req.params.id;
    console.log(req.params);

    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProyectoFinalWeb");
        var query = {_id: ObjectId(id)}
        dbo.collection("Libros").deleteOne(query, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
        res.sendStatus(200);
    });
});

//Filtro de libros que se estan leyendo
app.get('/APILeyendo', function(req,res) {
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProyectoFinalWeb");
        var query = {estado: "Leyendo"}
        dbo.collection("Libros").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      }); 
});

//Filtro de libros por leer
app.get('/APIPorLeer', function(req,res) {
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("ProyectoFinalWeb");
        var query = {estado: "Por leer"}
        dbo.collection("Libros").find(query).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
      }); 
});

async function agregarLibro(myobj) {
    const uri = "mongodb+srv://ProyectoFinalWeb:zgFyV5wbuIJUyoTf@cluster0.ynzjk.mongodb.net/test"
    const client = new MongoClient(uri);

    try {
        await client.connect();
        var dbo = client.db("ProyectoFinalWeb").collection("Libros");
        dbo.insertOne(myobj, function(err, res) {
            if (err) throw err;
                console.log("1 document inserted");
                client.close();
            });
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
} 

async function cambiarDatosLibro(myobj) {
    var ObjectId = require("mongodb").ObjectID;
    const client = new MongoClient(uri);
    
    console.log(myobj.estado);
    try {
        await client.connect();
        
        var dbo = client.db("ProyectoFinalWeb").collection("Libros");
        let query = { $set: {titulo: myobj.titulo, autor: myobj.autor, fecha: myobj.fecha, genero: myobj.genero, estado: myobj.estado}};
        dbo.updateOne({_id: ObjectId(myobj._id)},
        query,
        { upsert: true });
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
} 

app.listen(5500);