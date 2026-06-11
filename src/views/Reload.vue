<script setup>
import {onBeforeMount} from 'vue'
import {useAccessControl} from '@/composables/accessControl'

const accessControl = useAccessControl()

onBeforeMount(() => {
  accessControl()
})
</script>