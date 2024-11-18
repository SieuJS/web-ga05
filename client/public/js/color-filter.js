const colorFilter = document.querySelector('.color-filter');

const fetchColor = async () => {
    try {
        const response = await fetch('/api/v1/colour/list?limit=5');
        if (!response.ok) {
            throw new Error('Failed to fetch colors');
        }

        const colors = (await response.json()).data;
        return colors;
    }
    catch(error) {
        console.error('Error loading colors:', error);
    }
};

const addColorFilter = (color) => {
    const colorFilter = document.querySelector('.color-filter');
    const colorElement = document.createElement('div');
    colorElement.className = 'color-filter__color';
    colorElement.style.backgroundColor = color;
    colorElement.addEventListener('click', () => {
        toggleQuery(`colour=${color}`);
    });
    colorFilter.appendChild(colorElement);
};