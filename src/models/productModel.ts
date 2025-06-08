import mongoose, {Document} from "mongoose";

export interface IProduct extends Document {
    title: string,
    image: string,
    price: number,
    stoke: number
}

const productSchema = new mongoose.Schema<IProduct>({
    title: {type: String , required: true},
    image: {type: String , required: true},
    price: {type: Number , required: true},
    stoke: {type: Number , required: true , default: 0}
})


export const productModel = mongoose.model("product" , productSchema)