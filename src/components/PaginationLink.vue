<script setup>
const props = defineProps(['pageObj', 'updatePage'])
</script>
<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item">
                <a :class="pageObj.currentPage === 0 ? 'text-secondary' : ''"
                    @click="pageObj.currentPage > 0 ? updatePage(pageObj.currentPage - 1) : ''" class="page-link" href="#"
                    aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li @click="updatePage(page - 1)" v-for="page in pageObj.totalPage" class="page-item"><a class="page-link"
                    href="#">{{ page }}</a></li>
            <li class="page-item">
                <a class="page-link" href="#" aria-label="Next"
                    :class="(pageObj.currentPage < pageObj.totalPage - 1) ? '' : 'text-secondary'"
                    @click="pageObj.currentPage < pageObj.totalPage - 1 ? updatePage(pageObj.currentPage + 1) : ''">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
</template>