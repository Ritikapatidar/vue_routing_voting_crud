export default function useData() {
    const setLocalStorageData = (data) => {
        localStorage.setItem('userData', JSON.stringify(data))
    }
    const sortData = (arr) => {
        arr?.sort((a, b) => {
            return a.FirstName.toUpperCase() === b.FirstName.toUpperCase() ? 0 : a.FirstName.toUpperCase() > b.FirstName.toUpperCase() ? 1 : -1
        })
        return arr
    }
    return { setLocalStorageData, sortData }
}