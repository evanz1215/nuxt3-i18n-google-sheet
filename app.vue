<template>
  <div>

    <select v-model="locale">
      <option value="zh-TW">zh-TW</option>
      <option value="en-US">en-US</option>
      <option value="ja-JP">ja-JP</option>
    </select>
    {{ $t('submit') }}
    <!-- <NuxtWelcome /> -->
  </div>
</template>

<script setup>
const { locale, setLocaleCookie } = useI18n()

watch(locale, (val) => {
  setLocaleCookie(val);
})


</script>

<style></style>
