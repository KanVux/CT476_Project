const { ObjectId } = require("mongodb");

class BookService {
    constructor(client){
        this.Book = client.db().collection("SACH");
    }
    exstractBookData(payload){
        const book = {
            MaSach: payload.MaSach,
            TenSach: payload.TenSach,
            DonGia: payload.DonGia,
            SoQuyen: payload.SoQuyen,
            NamXuatBan: payload.NamXuatBan,
            MaNXB: payload.MaNXB,
            NguonGoc: payload.NguonGoc,
            YeuThich: payload.YeuThich,
        };

        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );
        return book;
    }

    async create(payload) {
        const book = this.exstractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            book,
            { $set: {YeuThich: book.YeuThich === true}},
            {returnDocument: "after", upsert: true}
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Book.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            TenSach: { $regex: new RegExp(new RegExp(name)), $option: "i" }
        });
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.exstractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    async delete(id){
        const result = await this.Book.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async findFavorite(){
        return await this.find({ favorite: true });
    }
    
    async deleteAll(){
        const result = await this.Book.deleteMany({});
        return result.deletedCount;   
    }
    
}

module.exports = BookService;