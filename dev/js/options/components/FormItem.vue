<template>
  <tr>
    <th><label :for="itemId">{{ label }}</label></th>
    <td><slot></slot></td>
  </tr>
</template>

<script>
export default {
  props: [ 'itemId', 'label' ]
};
</script>
