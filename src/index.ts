import express, {Request, Response} from 'express'
import mongoose from 'mongoose'
import Book from "./book.model";
import bodyParser from 'body-parser'
import cors from 'cors'
import {parse} from "querystring";
/*Instancing Express*/
const app = express();
/*Middleware bodyParser pour parser le corps des requêtes HTTP qui arrivent en JSON  */
app.use(bodyParser.json())
/*Middleware CORS pour donner la permission d'échange des requêtes HTTP entre differente domaines. Access-Control-Allow-Origin   */
app.use(cors());

/* Creation de la connexion avec la base de donnée on n'a pas besoin de créer la BD dans Mongo  */
const uri = "mongodb://localhost:27017/Library";
mongoose.connect(uri,(err)=>{
    if (err) console.log(err);
    else console.log("MongoDB Successfully connected ")
})

/* Requête http GET http://localhost:8085/ */
app.get('/',(req:Request,resp:Response)=>{
    resp.send("<h2>Hello Express !</h2>");
});
/* Requête http GET http://localhost:8085/books  */
app.get('/books',(req:Request,resp:Response)=>{
    Book.find((err, books) =>{
       if (err) resp.status(500).send(err);
       else resp.send(books);
    });
});

/* Requête avec pagination HTTP GET http://localhost:8085/pbooks?page=1&size=5 */
app.get('/pbooks',(req:Request,resp:Response)=>{
    let p:number = parseInt(req.query.page || 1);
    let size:number = parseInt(req.query.size || 5);
    Book.paginate({},{page: p, limit: size }, (err,result) =>{
        if (err) resp.status(500).send(err);
        else resp.send(result);
    });
});

/* Requête avec pagination HTTP GET http://localhost:8085/books-search?keyword=&page=1&size=5 */
app.get('/books-search',(req:Request,resp:Response)=>{
    let p:number = parseInt(req.query.page || 1);
    let size:number = parseInt(req.query.size || 5);
    let keyword:string = req.query.keyword || "";
    Book.paginate({title : {$regex: ".*(?i)"+keyword+".*"}},{page: p, limit: size }, (err,result) =>{
        if (err) resp.status(500).send(err);
        else resp.send(result);
    });
});

/* Requête http GET http://localhost:8085/books/id */
app.get('/books/:id',(req:Request,resp:Response)=>{
    Book.findById(req.params.id,(err, book) =>{
        if (err) resp.status(500).send(err);
        else resp.send(book);
    });
});

/* Requête http POST http://localhost:8085/books  */
app.post('/books',(req:Request,resp:Response)=>{
    let book = new Book((req.body));
    book.save(err => {
        if (err) resp.status(500).send(err);
        else resp.send(book);
    });
});

/* Requête http PUT http://localhost:8085/books/id  */
app.put('/books/:id',(req:Request,resp:Response)=>{
    Book.findByIdAndUpdate(req.params.id,req.body,(err,book)  => {
        if (err) resp.status(500).send(err);
        else resp.send("Successfully Updated book");
    });
});

/* Requête http DELETE http://localhost:8085/books/id  */
app.delete('/books/:id',(req:Request,resp:Response)=>{
    //Book.deleteOne({_id:req.params.id}, err =>
    Book.findByIdAndDelete(req.params.id,err  => {
        if (err) resp.status(500).send(err);
        else resp.send("Successfully Deleted book");
    });
});

app.listen(8085, ()=>{
    console.log("server started ....");
});