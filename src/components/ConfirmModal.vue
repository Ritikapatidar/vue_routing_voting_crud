<script setup>
const props = defineProps(['closeDeleteModal', 'deleteIndex', 'handleDelete'])
const handleDel = () => {
    props.handleDelete(props.deleteIndex);
    props.closeDeleteModal()
}
</script>
<template>
    <div class="modalWrapper w-100 h-100 left-0 top-0 position-fixed d-flex align-items-center" @click="closeDeleteModal">
        <div class="container">
            <div class="row">
                <div class="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4 m-auto" @click.stop="">
                    <div class="card p-2 shadow-lg">
                        <div class="card-body p-4">
                            <i class="bi bi-exclamation-circle-fill fs-1 text-warning d-block text-center mb-2"></i>
                            <h4 class="text-center">Are you sure, you want to delete this record!</h4>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <button class="btn btn-primary me-2" @click="handleDel">
                                OK
                            </button>
                            <button class="btn btn-secondary" @click="closeDeleteModal">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.modalWrapper {
    background: rgba(0, 0, 0, 0.4);
}
</style>