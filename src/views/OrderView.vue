<script lang="ts" setup>
import { useLogin } from '@/hooks/login.hook';
import type { DetailsModel } from '@/models/details.mode';
import type { OrderModel } from '@/models/order.model';
import { FlightService } from '@/services/flight.service';
import { UserService } from '@/services/user.service';
import { formatDate } from '@/utils';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const details = ref<DetailsModel>()
const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)
const validateLogin = useLogin()

const order = reactive<Partial<OrderModel>>({
    flightClass: 'f',
    flightId: id,
    isReturnTicket: false,
    ticketCount: 1
})

FlightService.getDepartureDetails(id)
    .then(data => details.value = data)

function getDepartureList() {
    let departures = [
        {
            id: details.value!.id,
            text: `${formatDate(details.value!.scheduledAt)} [FN: ${details.value!.flightNumber}]`
        }
    ]

    for (let flight of details.value!.other) {
        departures.push({
            id: flight.id,
            text: `${formatDate(flight.scheduledAt)} [FN: ${flight.flightNumber}]`
        })
    }

    return departures
}

const pricePerTicket = computed(() => {
    if (order.flightClass == 'f')
        return 300

    if (order.flightClass == 'b')
        return 200

    return 80
})

const price = computed(() => {
    const anyways = pricePerTicket.value * (order.ticketCount ?? 0)
    return order.isReturnTicket ? anyways * 1.8 : anyways
})

function createOrder() {
    if (!confirm('Are you sure you want to place an order?'))
        return

    UserService.addOrder({
        flightId: order.flightId ?? id,
        createdAt: new Date().toISOString(),
        paidAt: null,
        deletedAt: null,
        isReturnTicket: order.isReturnTicket ?? false,
        flightClass: order.flightClass ?? 'f',
        pricePerTicket: pricePerTicket.value,
        ticketCount: order.ticketCount ?? 1
    })
    router.push('/user')
}

onMounted(() => validateLogin())
</script>

<template>
    <div class="row" v-if="details">
        <div class="col-12 col-md-6 mb-3">
            <img class="img-fluid" :src="details.imageUrl" />
        </div>
        <div class="col-12 col-md-6 mb-3">
            <div class="card">
                <div class="card-header">
                    <strong>{{ details.destination }}</strong>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="form-label">Choose flight class:</label>
                        <select class="form-select" v-model="order.flightClass">
                            <option value="f">First Class</option>
                            <option value="b">Buissines Class</option>
                            <option value="e">Economy</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Choose departure time:</label>
                        <select class="form-select" v-model="order.flightId">
                            <option v-for="item in getDepartureList()" :value="item.id">{{ item.text }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Ticket count:</label>
                        <input type="number" class="form-control" v-model="order.ticketCount">
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="flexCheckChecked" v-model="order.isReturnTicket">
                        <label class="form-check-label" for="flexCheckChecked">
                            I want a return ticket
                        </label>
                    </div>
                    <p>Total: {{ price }}</p>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-success" @click="createOrder">
                        <i class="fa-solid fa-cart-shopping"></i> Confirm, and add to cart
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>