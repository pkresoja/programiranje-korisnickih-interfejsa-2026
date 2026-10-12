<script lang="ts" setup>
import { useLogin } from '@/hooks/login.hook';
import type { OrderModel } from '@/models/order.model';
import { FlightService } from '@/services/flight.service';
import { UserService } from '@/services/user.service';
import { getPriceForOrder } from '@/utils';
import { computed, onMounted, ref } from 'vue';

const validateLogin = useLogin()
const user = UserService.getActiveUser()
const flightIds = user?.orders.map(o => o.flightId)

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
    })

const unpaidOrders = computed(()=>{
    return orders.value.filter(o => o.paidAt == null && o.deletedAt == null)
})

const paidOrders = computed(()=>{
    return orders.value.filter(o => o.paidAt != null && o.deletedAt == null)
})



const total = computed(() => {
    let sum = 0
    for (let order of orders.value) {
        sum += getPriceForOrder(order)
    }

    return sum
})

function pay() {
    if (!confirm('Are you sure you want to pay?')) {
        return
    }

    UserService.pay()
}

onMounted(() => validateLogin())
</script>

<template>
    <div class="card" v-if="user && unpaidOrders.length > 0">
        <div class="card-header fw-bold">
            Unpaid Orders
        </div>
        <div class="card-body">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Destination</th>
                        <th scope="col">Flight Number</th>
                        <th scope="col">Flight Class</th>
                        <th scope="col">Return Ticket</th>
                        <th scope="col">Ticket Count</th>
                        <th scope="col">Price</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in unpaidOrders">
                        <th scope="row">{{ order.flightId }}</th>
                        <td>{{ order.destination }}</td>
                        <td>{{ order.flightNumber }}</td>
                        <td>
                            <span v-if="order.flightClass == 'f'">
                                First Class
                            </span>
                            <span v-if="order.flightClass == 'b'">
                                Business
                            </span>
                            <span v-if="order.flightClass == 'e'">
                                Economy
                            </span>
                        </td>
                        <td>{{ order.isReturnTicket ? 'Yes' : 'No' }}</td>
                        <td>{{ order.ticketCount }} {{ order.pricePerTicket }}</td>
                        <td>{{ getPriceForOrder(order) }} EUR</td>
                        <td>
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-primary">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button type="button" class="btn btn-sm btn-danger">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p class="fw-bold h3">Total: {{ total }} EUR</p>
        </div>
        <div class="card-footer">
            <button type="button" class="btn btn-success" @click="pay()">
                <i class="fa-solid fa-credit-card"></i> Checkout
            </button>
        </div>
    </div>

    <div class="card" v-if="user && paidOrders.length > 0">
        <div class="card-header fw-bold">
            Prevous Orders
        </div>
        <div class="card-body">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Destination</th>
                        <th scope="col">Flight Number</th>
                        <th scope="col">Flight Class</th>
                        <th scope="col">Return Ticket</th>
                        <th scope="col">Ticket Count</th>
                        <th scope="col">Price</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in paidOrders">
                        <th scope="row">{{ order.flightId }}</th>
                        <td>{{ order.destination }}</td>
                        <td>{{ order.flightNumber }}</td>
                        <td>
                            <span v-if="order.flightClass == 'f'">
                                First Class
                            </span>
                            <span v-if="order.flightClass == 'b'">
                                Business
                            </span>
                            <span v-if="order.flightClass == 'e'">
                                Economy
                            </span>
                        </td>
                        <td>{{ order.isReturnTicket ? 'Yes' : 'No' }}</td>
                        <td>{{ order.ticketCount }} {{ order.pricePerTicket }}</td>
                        <td>{{ getPriceForOrder(order) }} EUR</td>
                        <td>
                            <RouterLink :to="`/details/${order.flightId}`" class="btn btn-sm btn-primary">
                                <i class="fa-solid fa-up-right-from-square"></i>
                            </RouterLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <pre>{{ UserService.getActiveUser() }}</pre>
</template>