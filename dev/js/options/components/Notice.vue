<template>
  <p :id='noticeId' class="c-txt-notice"><slot></slot></p>
</template>

<script>
export default {
  props: [ 'noticeId' ]
};
</script>
