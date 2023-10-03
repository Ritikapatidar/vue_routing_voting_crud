import { ref } from "vue"
export default async function Pagination(arr, size) {
    const curPage = ref(0)
    const pageSize = ref()
    const totalPages = ref(0)
    const newPaginationData = ref([])
    pageSize.value = size
    totalPages.value = Math.ceil(arr.length / pageSize.value)
    const updatePage = (page) => {
        curPage.value = page
        updateData();
    }
    const updateData = () => {
        newPaginationData.value = arr.slice(curPage.value * pageSize.value, (curPage.value * pageSize.value) + pageSize.value)
    }
    updateData()
    return { curPage, totalPages, pageSize, newPaginationData, updateData, updatePage }
}