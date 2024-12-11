
export const searchProductQuery = (option: any) : any => ({
    where :{    
    AND: [
            {
                name: {
                    contains: option.search || "",
                    mode: "insensitive",
                },
            },
            {
                description: {
                    contains: option.search || "",
                    mode: "insensitive",
                },
            },
            {
                season: {
                    contains: option.season || "",
                    mode: "insensitive",
                },
            },
            {
                baseColour: {
                    contains: option.baseColor || "",
                    mode: "insensitive",
                },
            },
            {
                price: {
                    gte: parseInt(option.minPrice) || 0,
                    lte: parseInt(option.maxPrice) || 10000000,
                },
            },
            {
                categoryId: option.categoryId || null,
            },
        ]
    }
});
