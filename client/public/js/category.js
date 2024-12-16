import { clearPageQuery, setLinkAndReload} from "./product-query.js";
import { getQuery } from "./product-query.js";
import { setQuery, addSubQuery } from "./product-query.js";

const loadCategory = async () => {
    try {
        const response = await fetch("/api/v1/category/master");
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        let masterCategories = [];
        masterCategories = await response.json();
        const categoryContainer = document.getElementById("menu-content2");
        categoryContainer.innerHTML = "";
        
        masterCategories.forEach(async (master) => {
            const query = getQuery().replaceAll("%20"," ") || " ";
            const showMaster = query.includes(
                master.masterCategory
            );
            const subCategories = await fetchSubCategory(master.masterCategory);
            const categoryHTML = `
                <li data-toggle="collapse" 
                    data-target="#${master.masterCategory.replaceAll(" ","-")}" 
                    class="${showMaster ? "" : " collapsed "} cate-master">
                    <a class="cate-trigger ${showMaster ? " active" : ""}">
                    ${master.masterCategory}
                    </a>
                    <ul class="sub-menu ${showMaster ? "show" : "collapse"}"
                        id="${master.masterCategory.replaceAll(" ","-")}">
                        ${subCategories.map((subCategory) => {
                                const isActive = query.includes(
                                    `sub=${subCategory.subCategory}`
                                );
                                return `
                            <li class="cate-query ${isActive ? " active" : ""}">
                                <a>${subCategory.subCategory}</a>
                                <input type="hidden" class = "sub-value" value="sub=${subCategory.subCategory}">
                                <input type="hidden" class = "master-value" value="master=${master.masterCategory}">
                            </li>`;
                            }).join(" ")
                        }
                    </ul>
                </li>`;

            categoryContainer.innerHTML += categoryHTML;
            const cateMaster = document.querySelectorAll(".cate-master");

            const cateQuery = document.querySelectorAll(".cate-query");
            cateQuery.forEach((cate) => {
                cate.addEventListener("click", function () {
                    const query = cate.querySelector(".sub-value").value;
                    const master = cate.querySelector(".master-value").value;
                    addSubQuery(query, master);
                    clearPageQuery();
                    setLinkAndReload();
                });
            });

            cateMaster.forEach((cate) => {
                let trigger = cate.querySelector(".cate-trigger");
                trigger.addEventListener("click", function () {
                    let allQueries = getQuery().replaceAll("%20"," ");
                    const query = "master=" + trigger.textContent.trim();
                    if (allQueries.includes(query)) {
                        allQueries = allQueries.replaceAll("&" + query, "");
                        const cateSub = cate.querySelectorAll(".cate-query.active");
                        cateSub.forEach((sub) => {
                            allQueries = allQueries.replace(
                                "&" + sub.querySelector("input").value,
                                ""
                            );
                            sub.classList.remove("active");
                        });
                    } else {
                        allQueries += "&" + query;


                    }
                    setQuery(allQueries);
                });
            });
        });
    } catch (error) {
        console.error("Error loading categories:", error);
    }
};

const fetchSubCategory = async (master) => {
    const data = await fetch(`/api/v1/category/sub?master=${master}`);
    return await data.json();
};

window.addEventListener("load", loadCategory);
