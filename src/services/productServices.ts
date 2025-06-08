import { productModel } from "../models/productModel";

export const getAllProduct = async () => {
  return await productModel.find();
};

export const seedInitialProduts = async () => {
  try {
    const products = [
      {
        title: "Dell Laptop",
        image:
          "https://i5.walmartimages.com/asr/3a0b16b3-88f9-4797-a546-8a7a5f3d15cc.9cd02e837eeb8ced4ef44bdac35a84e9.jpeg",
        price: 15000,
        stoke: 8,
      },
      {
        title: "Hp Laptop",
        image:
          "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_SX679_.jpg",
        price: 2000,
        stoke: 10,
      },
      {
        title: "Asus Laptop",
        image:
          "https://m.media-amazon.com/images/I/51VXgmHMm+L._AC_SY300_SX300_.jpg",
        price: 10000,
        stoke: 20,
      },
    ];

    const exsitingProduct = await getAllProduct();

    if (exsitingProduct.length === 0) {
      await productModel.insertMany(products);
    }
  } catch (err) {
    console.log("cannot error database", err);
  }
};
