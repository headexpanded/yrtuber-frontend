<template>
  <q-icon class="cursor-pointer" :name="modelValue ? 'visibility' : 'visibility_off'" @click="toggle" />
</template>
<script setup lang="ts">
/* ============ PROPS ============ */

/* ============ EMITS ============ */

const emit = defineEmits<{
  updateModelValue: [value: boolean];
}>();

/* ========= LOCAL SCOPE ========= */

const modelValue = defineModel<boolean>({
  type: Boolean,
  required: true,
});

/* ============= REFS ============ */

/* ============ HOOKS ============ */

/* =========== METHODS =========== */

const toggle = () => {
  modelValue.value = !modelValue.value;
  emit('updateModelValue', modelValue.value);
};


</script>

<style scoped lang="scss">

</style>
