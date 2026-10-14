<template>
  <div v-if="message" class="toast-banner">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String
})
</script>

<style scoped>
.toast-banner {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #242220;
  color: #ffffff;
  padding: 14px 24px;
  border-radius: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 3000;
  font-size: 0.9rem;
  border-left: 4px solid var(--clr-accent-gold);
}
</style>
