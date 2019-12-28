<template>
    <div class="text--secondary caption">
        <v-progress-circular color="blue" indeterminate></v-progress-circular>
        &nbsp;&nbsp;{{ text }}...
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: 'Loading',
    },
  },
});
</script>
