<script lang="ts" setup>
import type { DetailsModel } from '@/models/details.mode';
import { FlightService } from '@/services/flight.service';
import { formatDate } from '@/utils';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const details = ref<DetailsModel>()
const route = useRoute()
const id = Number(route.params.id)

const order = ref({
    flightClass: 'f',
    id: id,
    total: 1
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
                        <select class="form-select" v-model="order.id">
                            <option v-for="item in getDepartureList()" :value="item.id">{{ item.text }}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Ticket count:</label>
                        <input type="number" class="form-control" v-model="order.total">
                    </div>
                </div>
                <div class="card-footer">
                    <div class="btn btn-success">
                        <i class="fa-solid fa-cart-shopping"></i> Confirm, and add to cart
                    </div>
                </div>
            </div>
        </div>
    </div>
    <pre>{{ order }}</pre>
</template>