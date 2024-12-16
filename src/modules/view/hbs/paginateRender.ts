import { PaginationMeta } from "../../paginate";

export function paginateRender(meta: PaginationMeta) {
    const {
        lastPage,
        currentPage, 
        prev, 
        next 
    } = meta;
    let pages = [];
    let page = 1;
    let last = lastPage;
    let prevDisabled = prev ===null ? 'disabled' : '';
    let nextDisabled = next === null ? 'disabled' : '';

    if (lastPage > 1) {
        while (page <= last) {
            pages.push(page);
            page++;
        }
    }


    if (pages.length > 6) {
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(lastPage, currentPage + 2);
        pages = [];

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i.toString());
        }

        if (startPage > 1) {
            pages.unshift(1);
            if (startPage > 2) {
                pages.splice(1, 0, '...');
            }
        }

        if (endPage < lastPage) {
            pages.push(lastPage);
            if (endPage < lastPage - 1) {
                pages.splice(pages.length - 1, 0, '...');
            }
        }
    }
    

    return  `
        <nav aria-label="Page navigation">
            <ul class="pagination pagination-sm">
            <li class="page-item ${prevDisabled}">
                <a class="page-link" href="#" data-page="${prev}">Prev</a>
            </li>
            ${pages.map(page => `
                <li class="page-item ${currentPage.toString() === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${page === '...' ? '' : page}">${page}</a>
                </li>
            `).join('')}
            <li class="page-item ${nextDisabled}">
                <a class="page-link" href="#" data-page="${next}">Next</a>
            </li>
            </ul>
        </nav>`;
}
