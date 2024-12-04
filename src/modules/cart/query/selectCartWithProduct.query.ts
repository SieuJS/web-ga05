export const selectCartWithProductQuery = {
    products_in_cart : {
        select : {
            id : true,
            image : true,
            name : true,
            price : true,
        }
    }
}