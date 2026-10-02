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
  <div class="card mb-3">
    <div class="card-body">
      <div class="row">
        <div class="col-12 col-md-5 mb-3">
          <label for="search" class="form-label">Search:</label>
          <input type="text" class="form-control" id="search" aria-describedby="search-help"
            placeholder="ex. JU 684 or Tivat">
          <div id="search-help" class="form-text">Destination or flight number</div>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <label for="search" class="form-label">From date:</label>
          <select class="form-select">
            <option value="0">From any date</option>
          </select>
        </div>
        <div class="col-12 col-md-3 mb-3">
          <label for="search" class="form-label">To date:</label>
          <select class="form-select">
            <option value="0">To any date</option>
          </select>
        </div>
        <div class="col-12 col-md-1 mb-3 justify-content-center">
          <button type="button" class="btn btn-primary">Reset Filter</button>
        </div>
      </div>
    </div>
  </div>
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
