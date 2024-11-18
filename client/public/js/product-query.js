

let processLink = new URL(window.location.href);
let productQuery = processLink.search;
export const loadProductQuery = async () => {
    try {
        const response = await fetch('/api/v1/product'+productQuery.toLowerCase());
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
    console.log("process add", processLink.search);
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
    console.log("process toggle" ,processLink.search);
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
    console.log("Current set", processLink.search);
}

export const setPrice = (min, max) => {
    let query = processLink.search;
    query = query.replaceAll("%20", " ");
    const components = query.split("&").map((component) => {
        if (component.includes("price")) {
            component = "price=" + min + "-" + max;
        }
        return component;
    });
    query = components.join("&");
    processLink.search = query;
    productQuery = query;
    console.log("set price", processLink.search);
};

getQuery() ;