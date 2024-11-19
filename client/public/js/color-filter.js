import { setColorQuery, loadProductQuery, setLinkAndReload, getColorQuery } from "./product-query.js";
const addColorFilter = (colors) => {
    const colorFilter = document.querySelector('.color-filter');
    colorFilter.innerHTML = '';
    colors.forEach((colorText) => {
        let [color, number] = colorText.split(": ");
        color = color.toLowerCase();
        let colorActive = getColorQuery() === color ? 'active' : '';
        const colorHTML = `
            <li class="${color} color-selector " > 
                <a href = "#" class = "${colorActive}"> 
                    <span>${number}</span>
                    <input type="hidden" class ="color-value" value="${color}">
                </a>
            </li>
        `;
        colorFilter.innerHTML += colorHTML;
        
        let colorSelector = colorFilter.querySelectorAll('.color-selector');
        colorSelector.forEach((color) => {
            color.addEventListener('click', function() {
                const query = color.querySelector('.color-value').value;
                setColorQuery(query);
                setLinkAndReload();
            });
        });

    });};


const fetchColor = async () => {
    try {
        const response = await fetch('/api/v1/colour/list?limit=5');
        if (!response.ok) {
            throw new Error('Failed to fetch colors');
        }

        const colors = (await response.json());
        addColorFilter(colors)
        return colors;
    }
    catch(error) {
        console.error('Error loading colors:', error);
    }
};


fetchColor();