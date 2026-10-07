<script setup lang="ts">
import InfoCard from '@/components/InfoCard.vue';
import type { FlightModel } from '@/models/flight.model';
import { FlightService } from '@/services/flight.service';
import { formatDate } from '@/utils';
import { ref, watch } from 'vue';

const flights = ref<FlightModel[]>([])
const flitered = ref<FlightModel[]>([])
const search = ref({
  text: '',
  from: 'any',
  to: 'any'
})

FlightService.getDepatures()
  .then(data => {
    flights.value = data
    flitered.value = data
  })

// Funkcija pretrage
watch(search, () => {
  flitered.value = flights.value
    .filter(f => {
      const d = f.destination.toLowerCase()
      const n = f.flightNumber.toLowerCase()
      const s = search.value.text.toLowerCase()
      return d.includes(s) || n.includes(s)
    })
    .filter(f => {
      if (search.value.from == 'any' && search.value.to == 'any')
        return true

      const scheduled = new Date(f.scheduledAt).getTime()
      const from = new Date(search.value.from).getTime()
      const to = new Date(`${search.value.to}T23:59:59`).getTime()

      if (search.value.to == 'any')
        return scheduled >= from

      if (search.value.from == 'any')
        return scheduled <= to

      return scheduled >= from && scheduled <= to
    })
}, { deep: true })

function resetFilters() {
  search.value = {
    text: '',
    from: 'any',
    to: 'any'
  }
}

function getAvailableDates() {
  const dates = new Set<string>()
  flights.value?.forEach(f => {
    dates.add(f.scheduledAt.split('T')[0]!)
  })

  return Array.from(dates)
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <div class="row">
        <div class="col-12 col-md-5 mb-3">
          <label for="search" class="form-label">Search:</label>
          <input type="text" class="form-control" id="search" placeholder="ex. JU 684 or Tivat" v-model="search.text">
        </div>
        <div class="col-12 col-md-3 mb-3">
          <label for="search" class="form-label">From date:</label>
          <select class="form-select" v-model="search.from">
            <option value="any">From any date</option>
            <option v-for="date in getAvailableDates()" :value="date">{{ date }}</option>
          </select>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <label for="search" class="form-label">To date:</label>
          <select class="form-select" v-model="search.to">
            <option value="any">To any date</option>
            <option v-for="date in getAvailableDates()" :value="date">{{ date }}</option>
          </select>
        </div>
        <div class="col-12 col-md-1 mb-3 d-flex align-items-end justify-content-center">
          <button type="button" class="btn btn-primary" @click="resetFilters()">
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-md-3 mb-3" v-for="f in flitered">
      <div class="card text-center">
        <img :src="f.imageUrl" class="card-img-top" :alt="f.destination">
        <div class="card-body">
          <h5 class="card-title">
            {{ f.destination }}
          </h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">
            {{ formatDate(f.scheduledAt) }}
          </h6>
          <RouterLink :to="`/details/${f.id}`" class="btn btn-primary btn-sm m-1">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Details
          </RouterLink>
          <RouterLink :to="`/order/${f.id}`" class="btn btn-success btn-sm m-1">
            <i class="fa-solid fa-cart-shopping"></i> Order Now
          </RouterLink>
        </div>
      </div>
    </div>
  </div>

  <InfoCard title="Not Found" v-if="flitered.length == 0 && flitered.length < flights.length">
    <p>Couldn't find any departures for that criteria!</p>
    <button type="button" class="btn btn-primary" @click="resetFilters()">
      Reset Filters
    </button>
  </InfoCard>

  <InfoCard title="Loading" v-if="flights.length == 0">
    ✈️ Loading data.... please wait
  </InfoCard>
</template>
