<template>
  <main>
    <router-view v-slot="{ Component }">
      <keep-alive :include="['shipAddress']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
</template>
