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
            <div class="card h-100 shadow-sm">
                <div class="card-header fw-bold d-flex align-items-center">
                    <i class="fa-solid fa-user-circle me-2 text-primary"></i>
                    Profile Details
                </div>

                <div class="card-body">
                    <!-- Profile header -->
                    <div class="d-flex align-items-center gap-3 mb-4">
                        <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=0d6efd&color=ffffff&size=128`"
                            :alt="`${user.email} avatar`" class="rounded-circle border" width="80" height="80" />

                        <div class="overflow-hidden">
                            <h5 class="fw-bold mb-1 text-break">
                                {{ user.email }}
                            </h5>
                            <span class="badge bg-primary">
                                <i class="fa-solid fa-circle-check me-1"></i>
                                Registered User
                            </span>
                        </div>
                    </div>

                    <hr class="text-secondary opacity-25">

                    <!-- Profile information -->
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item px-0 py-3 d-flex align-items-center">
                            <div class="rounded text-primary p-2 me-3">
                                <i class="fa-solid fa-envelope fa-fw"></i>
                            </div>
                            <div class="flex-grow-1 overflow-hidden">
                                <small class="text-muted d-block">Email Address</small>
                                <strong class="text-break">{{ user.email }}</strong>
                            </div>
                        </li>

                        <li class="list-group-item px-0 py-3 d-flex align-items-center">
                            <div class="rounded text-primary p-2 me-3">
                                <i class="fa-solid fa-plane-departure fa-fw"></i>
                            </div>
                            <div class="flex-grow-1 overflow-hidden">
                                <small class="text-muted d-block">
                                    Favourite Destination
                                </small>
                                <strong class="text-break">
                                    {{ user.destination || 'Not specified' }}
                                </strong>
                            </div>
                        </li>

                        <li class="list-group-item px-0 py-3 d-flex align-items-center">
                            <div class="rounded text-primary p-2 me-3">
                                <i class="fa-solid fa-ticket fa-fw"></i>
                            </div>
                            <div class="flex-grow-1">
                                <small class="text-muted d-block">Total Orders</small>
                                <strong>{{ user.orders.length }}</strong>
                            </div>
                        </li>

                        <li class="list-group-item px-0 pt-3 pb-0 d-flex align-items-center">
                            <div class="rounded text-success p-2 me-3">
                                <i class="fa-solid fa-circle-check fa-fw"></i>
                            </div>
                            <div class="flex-grow-1">
                                <small class="text-muted d-block">Paid Orders</small>
                                <strong>{{ paidOrders.length }}</strong>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6 mb-3">
            <div class="card h-100 shadow-sm">
                <div class="card-header fw-bold d-flex align-items-center">
                    <i class="fa-solid fa-lock me-2 text-primary"></i>
                    Change Password
                </div>

                <div class="card-body">
                    <div class="d-flex align-items-center mb-4">
                        <div class="rounded-circle text-primary p-3 me-3 bg-light">
                            <i class="fa-solid fa-shield-halved fa-xl"></i>
                        </div>
                        <div>
                            <h5 class="fw-bold mb-1">Update your password</h5>
                            <p class="text-muted small mb-0">
                                Keep your account secure with a strong password.
                            </p>
                        </div>
                    </div>

                    <form @submit.prevent="changePassword">
                        <div class="mb-3">
                            <label for="password1" class="form-label fw-semibold">
                                Current password
                            </label>
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-key text-muted"></i>
                                </span>
                                <input type="password" class="form-control" id="password1"
                                    placeholder="Enter current password" autocomplete="current-password"
                                    v-model="passReset.currentPass" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="password2" class="form-label fw-semibold">
                                New password
                            </label>
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-lock text-muted"></i>
                                </span>
                                <input type="password" class="form-control" id="password2"
                                    placeholder="Enter new password" autocomplete="new-password"
                                    v-model="passReset.newPass" required>
                            </div>
                            <div class="form-text">
                                Choose a password you don't use elsewhere.
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="password3" class="form-label fw-semibold">
                                Confirm new password
                            </label>
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="fa-solid fa-check-double text-muted"></i>
                                </span>
                                <input type="password" class="form-control" id="password3"
                                    placeholder="Repeat new password" autocomplete="new-password"
                                    v-model="passReset.repeatPass" required>
                            </div>

                            <small v-if="passReset.repeatPass.length > 0" :class="passReset.newPass === passReset.repeatPass
                                ? 'text-success'
                                : 'text-danger'" class="d-block mt-2">
                                <i :class="passReset.newPass === passReset.repeatPass
                                    ? 'fa-solid fa-circle-check'
                                    : 'fa-solid fa-circle-exclamation'" class="me-1"></i>
                                {{
                                    passReset.newPass === passReset.repeatPass
                                        ? 'Passwords match'
                                        : 'Passwords do not match'
                                }}
                            </small>
                        </div>

                        <div class="d-flex justify-content-end">
                            <button type="submit" class="btn btn-primary px-4">
                                <i class="fa-solid fa-shield-halved me-2"></i>
                                Update Password
                            </button>
                        </div>
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