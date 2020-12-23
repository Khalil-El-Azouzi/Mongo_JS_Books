"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = __importDefault(require("../model/book.model"));
const app = express_1.default();
const uri = "mongodb://localhost:27017/Library";
mongoose_1.default.connect(uri, (err) => {
    if (err)
        console.log(err);
    else
        console.log("MongoDB Successfully connected ");
});
app.get('/', (req, resp) => {
    resp.send("Hello Express !");
});
app.get('/books', (req, resp) => {
    book_model_1.default.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.listen(8085, () => {
    console.log("server started ....");
});
