export default function useData() {
    const setLocalStorageData = (data) => {
        localStorage.setItem('userData', JSON.stringify(data))
    }
    return {setLocalStorageData}
}