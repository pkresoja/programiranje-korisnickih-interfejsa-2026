<script lang="ts" setup>
import { UserService } from '@/services/user.service';


</script>

<template>
    <pre>{{ UserService.getActiveUser() }}</pre>
</template>