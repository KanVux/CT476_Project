const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-errors");


    
    
    exports.create = async (req, res, next) => {
        if(!req.body?.TenSach) {
            return next(new ApiError(400,  "Name can not be empty"));   
        }
        
        try {
            const bookService = new BookService(MongoDB.client);
            const document = await bookService.create(req.body);
            return res.send(document);
        }
        catch(error){
            return next(
                new ApiError(500, "An error occurred while creating the book")
            )
        }
    };
    exports.findAll = async (req, res) => {
        let documents = [];

        try {
            const bookService = new BookService(MongoDB.client);
            const {name} = req.query;
            if (name) {
                documents = await bookService.findByName(name);
            } else {
                documents = await bookService.find({});
            }
        } catch (err) {
            return next(
                new ApiError(500, "An error occurred whle retrieving books")
            );
        }

        return res.send(documents);
    };
    exports.findOne = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "book not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Error retrieving book with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length == 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.id, req.body);

        if(!document) {
            return next(new ApiError(404, "book not found"));
        }
        return res.send({message: "book was updated successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Error updating book with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.id);

        if(!document) {
            return next(new ApiError(404, "book not found"));
        }
        return res.send({message: "book was delete successfully"});
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete book with id=${req.params.id}`)
        );
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findFavorite();
    } catch (error) {
        return next(
            new ApiError(500, `An error occurred while retrieving favorite books`)
        );
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const deletedCount = await bookService.deleteAll();
        return res.send({message: ` ${deletedCount} book was delete successfully`});
    } catch (error) {
        return next(
            new ApiError(500, `An error occurred while removing all books`)
        );
    }
};

