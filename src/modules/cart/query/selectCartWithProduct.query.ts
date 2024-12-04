export const selectCartWithProductQuery = {
    quantity : true ,
    products_in_cart : {
        select : {
            id : true,
            image : true,
            name : true,
            price : true,
            quantity : true
        }
    }
}