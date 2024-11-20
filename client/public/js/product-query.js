

let processLink = new URL(window.location.href);
let productQuery = processLink.search;
export const loadProductQuery = async () => {

    try {
        const response = await fetch('/api/v1/product'+processLink.search.toLowerCase());
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = (await response.json()).data;
        return products;
    }
    catch(error) {
        console.error('Error loading products:', error);
    }

}
export const getQuery = () => {
    if(processLink.search !== "") {
        processLink.hash = "menu-content2";
    }
    productQuery = processLink.search;
    return processLink.search;

}

export const setLinkAndReload = () => {
    window.location.href = processLink.href;
}

export const changeProductQuery = (query) => {
    productQuery = query;
    return productQuery;
}

export const addSubQuery = (subquery, master) => {
    let query = processLink.search;

    query = query.replaceAll("%20", " ");
    if (query.includes(subquery)) {
        query = query.replace("&" + subquery, "");
        query = query.replace(subquery, "");
    }
    else {
        const components = query.split("&").map((component) => {
            if (component.includes(master)) {
                component += "&" + subquery;
            }
            return component;
        });
        query = components.join("&");
    }

    processLink.search = query;
    productQuery = query;
}

export const toggleQuery = (query) => {
    query = query.replaceAll(" ", "%20");
    if (productQuery.includes(query)) {
        productQuery = productQuery.replace("&" + query, "");
        productQuery = productQuery.replace(query, "");
    } else {
        productQuery += "&" + query;
    }
    processLink.search = productQuery;
    processLink.hash = "menu-content2";
}

export const addQuery = (query) => {
    productQuery += "&" + query;
    processLink.search = productQuery;

}

export const setQuery = (query) => {
    productQuery = query;
    processLink.search = productQuery;
}

export const setPrice = (min, max) => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    let find = 0
    const components = query.split("&").map((component) => {
        if (component.includes("price")) {
            component = "price=" + min + "-" + max;
            find = 1
        }
        return component;
    });
    query = components.join("&");
    if (find === 0) {
        query += "&price=" + min + "-" + max;
    }
    processLink.search = query;
    productQuery = query;
};

export const getPriceRange = () => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    if (query.includes("price")) {
        let price = query.match(/price=[^&]*/)[0].split("=")[1].split("-");
        return price;
    }
    return [0, 1350];
};


export const setSearchQuery = (search) => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    if (query.includes("search")) {
        query = query.replace(/search=[^&]*/, "search=" + search);
    } else {
        query += "&search=" + search;
    }
    processLink.search = query;
    productQuery = query;
}

export const getSearchQuery = () => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    if (query.includes("search")) {
        let search = query.match(/search=[^&]*/)[0].split("=")[1];
        return search;
    }
    return "";
}

export const setColorQuery = (color) => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    if (query.includes("color")) {
        query = query.replace(/color=[^&]*/, "color=" + color);
    } else {
        query += "&color=" + color;
    }
    processLink.search = query;
    productQuery = query;
};

export const getColorQuery = () => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    if (query.includes("color")) {
        let color = query.match(/color=[^&]*/)[0].split("=")[1];
        return color;
    }
    return "";
};

export const clearColorQuery = () => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    query = query.replace(/&color=[^&]*/, "");
    processLink.search = query;
}

export const setSeasonQuery = (season) => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    if (query.includes("season")) {
        query = query.replace(/season=[^&]*/, "season=" + season);
    } else {
        query += "&season=" + season;
    }
    processLink.search = query;
    productQuery = query;
}

export const getSeasonQuery = () => {
    let query = processLink.search; 
    query = query.replace("%20", " ");
    if(query.includes("season")){
        query = query.match(/season=[^&]*/)[0].split("=")[1];
        return query;
    }
    else {return "none"};
}

export const clearSeasonQuery = () => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    query = query.replace(/&season=[^&]*/, "");
    processLink.search = query;
}

getQuery() ;