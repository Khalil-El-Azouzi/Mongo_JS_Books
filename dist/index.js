"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("./book.model"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
/*Instancing Express*/
const app = express_1.default();
/*Middleware bodyParser pour parser le corps des requêtes HTTP qui arrivent en JSON  */
app.use(body_parser_1.default.json());
/*Middleware CORS pour donner la permission d'échange des requêtes HTTP entre differente domaines. Access-Control-Allow-Origin   */
app.use(cors_1.default());
/* Creation de la connexion avec la base de donnée on n'a pas besoin de créer la BD dans Mongo  */
const uri = "mongodb://localhost:27017/Library";
mongoose_1.default.connect(uri, (err) => {
    if (err)
        console.log(err);
    else
        console.log("MongoDB Successfully connected ");
});
/* Requête http GET http://localhost:8085/ */
app.get('/', (req, resp) => {
    resp.send("<h2>Hello Express !</h2>");
});
/* Requête http GET http://localhost:8085/books  */
app.get('/books', (req, resp) => {
    book_model_1.default.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
/* Requête avec pagination HTTP GET http://localhost:8085/pbooks?page=1&size=5 */
app.get('/pbooks', (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let size = parseInt(req.query.size || 5);
    book_model_1.default.paginate({}, { page: p, limit: size }, (err, result) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
/* Requête avec pagination HTTP GET http://localhost:8085/books-search?keyword=&page=1&size=5 */
app.get('/books-search', (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let size = parseInt(req.query.size || 5);
    let keyword = req.query.keyword || "";
    book_model_1.default.paginate({ title: { $regex: ".*(?i)" + keyword + ".*" } }, { page: p, limit: size }, (err, result) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
/* Requête http GET http://localhost:8085/books/id */
app.get('/books/:id', (req, resp) => {
    book_model_1.default.findById(req.params.id, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
/* Requête http POST http://localhost:8085/books  */
app.post('/books', (req, resp) => {
    let book = new book_model_1.default((req.body));
    book.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
/* Requête http PUT http://localhost:8085/books/id  */
app.put('/books/:id', (req, resp) => {
    book_model_1.default.findByIdAndUpdate(req.params.id, req.body, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Successfully Updated book");
    });
});
/* Requête http DELETE http://localhost:8085/books/id  */
app.delete('/books/:id', (req, resp) => {
    //Book.deleteOne({_id:req.params.id}, err =>
    book_model_1.default.findByIdAndDelete(req.params.id, err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("Successfully Deleted book");
    });
});
app.listen(8085, () => {
    console.log("server started ....");
});
