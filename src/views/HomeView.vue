<script setup lang="ts">
import type { FlightModel } from '@/models/flight.model';
import { FlightService } from '@/services/flight.service';
import { formatDate } from '@/utils';
import { ref } from 'vue';

const flights = ref<FlightModel[]>()

FlightService.getDepatures()
  .then(data => flights.value = data)
</script>

<template>
  <div class="row">
    <div class="col-12 col-md-3 mb-3" v-for="f in flights">
      <div class="card text-center">
        <img :src="f.imageUrl" class="card-img-top" :alt="f.destination">
        <div class="card-body">
          <h5 class="card-title">
            {{ f.destination }}
          </h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">
            {{ formatDate(f.scheduledAt) }}
          </h6>
          <RouterLink :to="`/details/${f.id}`" class="btn btn-primary">
            Details
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
  <pre>{{ flights }}</pre>
</template>
