<script lang="ts" setup>
import OrderCard from '@/components/OrderCard.vue';
import { useLogin } from '@/hooks/login.hook';
import type { OrderModel } from '@/models/order.model';
import { FlightService } from '@/services/flight.service';
import { UserService } from '@/services/user.service';
import { formatDate, getPriceForOrder, showConfirm, showError, showLoading } from '@/utils';
import Swal from 'sweetalert2';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const validateLogin = useLogin()
const user = UserService.getActiveUser()
const flightIds = user?.orders.map(o => o.flightId)
const router = useRouter()
const passReset = ref({
    currentPass: '',
    newPass: '',
    repeatPass: ''
})

const orders = ref<OrderModel[]>([])
FlightService.getDeparturesByIds(flightIds ?? [])
    .then(data => {
        const unpaid = user!.orders
        for (let order of unpaid) {
            for (let flight of data) {
                if (order.flightId === flight.id) {
                    order.destination = flight.destination
                    order.flightNumber = flight.flightNumber
                    order.scheduledAt = flight.scheduledAt
                    order.estimatedAt = flight.estimatedAt
                }
            }
        }

        orders.value = unpaid
        Swal.close()
    })

const unpaidOrders = computed(() => {
    return orders.value.filter(o => o.paidAt == null && o.deletedAt == null)
})

const paidOrders = computed(() => {
    return orders.value.filter(o => o.paidAt != null && o.deletedAt == null)
})

function removeOrder(order: OrderModel) {
    showConfirm(`Delete order created at ${formatDate(order.createdAt)} to ${order.destination}?`, () => {
        UserService.removeOrder(order)
        window.location.reload()
    })
}

const total = computed(() => {
    let sum = 0
    for (let order of orders.value) {
        sum += getPriceForOrder(order)
    }

    return sum
})

function pay() {
    showConfirm('Are you sure you want to pay?', () => {
        UserService.pay()
        window.location.reload()
    })
}

function changePassword() {
    showConfirm('Are you sure you want to change the password?', () => {
        if (passReset.value.newPass == '') {
            showError(`New password can't be empty!`)
            return
        }

        if (passReset.value.newPass == user?.password) {
            showError(`You can't use the same password!`)
            return
        }

        if (passReset.value.currentPass != user?.password) {
            showError('Invalid password!')
            return
        }

        if (passReset.value.newPass != passReset.value.repeatPass) {
            showError(`New passwords don't match!`)
            return
        }

        UserService.changePassword(passReset.value.newPass)
        UserService.logout()
        router.push('/login')
    })
}

onMounted(() => {
    validateLogin()
    showLoading()
})
</script>

<template>
    <div class="row" v-if="user">
        <div class="col-12 col-md-6 mb-3">
            <div class="card h-100">
                <div class="card-header fw-bold">
                    Profile Details
                </div>
                <div class="card-body">
                    <img :src="`https://ui-avatars.com/api/?name=${user.email}`" />
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            Email: <strong>{{ user.email }}</strong>
                        </li>
                        <li class="list-group-item">
                            Favourite destination: <strong>{{ user.destination }}</strong>
                        </li>
                        <li class="list-group-item">
                            Total orders: <strong>{{ user.orders.length }}</strong>
                        </li>
                        <li class="list-group-item">
                            Paid orders: <strong>{{ paidOrders.length }}</strong>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6 mb-3">
            <div class="card h-100">
                <div class="card-header fw-bold">
                    Change Password
                </div>
                <div class="card-body">
                    <form @submit.prevent="changePassword">
                        <div class="mb-3">
                            <label for="password1" class="form-label">Current password</label>
                            <input type="password" class="form-control" id="password1" v-model="passReset.currentPass">
                        </div>
                        <div class="mb-3">
                            <label for="password2" class="form-label">New Password</label>
                            <input type="password" class="form-control" id="password2" v-model="passReset.newPass">
                        </div>
                        <div class="mb-3">
                            <label for="password3" class="form-label">Repeat New Password</label>
                            <input type="password" class="form-control" id="password3" v-model="passReset.repeatPass">
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <OrderCard v-if="user && unpaidOrders.length > 0" :orders="unpaidOrders" title="Unpaid Orders">
        <template #options="{ order }">
            <div class="btn-group">
                <RouterLink :to="`/details/${order.flightId}`" class="btn btn-sm btn-primary">
                    <i class="fa-solid fa-up-right-from-square"></i>
                </RouterLink>
                <button type="button" class="btn btn-sm btn-danger" @click="removeOrder(order)">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </template>
        <template #footer>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <p class="fw-bold h5">Total: {{ total }} EUR</p>
                <button type="button" class="btn btn-success" @click="pay()">
                    <i class="fa-solid fa-credit-card"></i> Checkout
                </button>
            </div>
        </template>
    </OrderCard>

    <OrderCard v-if="user && paidOrders.length > 0" :orders="paidOrders" title="Prevous Orders">
        <template #options="{ order }">
            <RouterLink :to="`/details/${order.flightId}`" class="btn btn-sm btn-primary">
                <i class="fa-solid fa-up-right-from-square"></i>
            </RouterLink>
        </template>
    </OrderCard>
</template>