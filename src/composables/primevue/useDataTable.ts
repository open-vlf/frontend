import { ref } from 'vue'

export default () => {
  const tableData: Ref<any[]> = ref([])
  const filters = ref({})
  const dataTableRef = ref<HTMLElement | null>(null)

  function exportCSV() {
    // @ts-expect-error Need Error Masking
    dataTableRef.value.exportCSV()
  }

  return {
    tableData, filters, dataTableRef, exportCSV,
  }
}
