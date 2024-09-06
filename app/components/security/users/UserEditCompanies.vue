<template>
  <div>
    <p
      v-for="n in 100"
      :key="n">
      this is companies {{ n }}
    </p>
  </div>
</template>
