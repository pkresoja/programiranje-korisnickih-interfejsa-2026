import Swal from "sweetalert2"
import type { OrderModel } from "./models/order.model"

export function formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function getPriceForOrder(order: OrderModel) {
    return order.pricePerTicket * order.ticketCount * (order.isReturnTicket ? 1.8 : 1)
}

const bootstrapClasses = {
    popup: 'card',
    cancelButton: 'btn btn-danger',
    denyButton: 'btn btn-secondary',
    confirmButton: 'btn btn-primary'
}

export function showLoading() {
    Swal.fire({
        title: 'Loading data',
        text: 'Please wait while we fetch the latest data!',
        customClass: bootstrapClasses,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading()
        }
    })
}

export function showConfirm(message: string, callback: Function) {
    Swal.fire({
        title: message,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Yes, confirm!',
        cancelButtonText: 'No, cancel!',
        icon: 'question',
        customClass: bootstrapClasses
    }).then(result => {
        if (result.isConfirmed) {
            callback()
        }
    })

}

export function showSuccess() {
    Swal.fire({
        icon: 'success',
        confirmButtonText: 'OK',
        title: 'Completed',
        customClass: bootstrapClasses
    })
}

export function showError(message: string) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        customClass: bootstrapClasses
    })
}