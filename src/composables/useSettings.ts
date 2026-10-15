import { ref, watch } from 'vue'
import { readStorage, writeStorage } from '@/utils/storage'

const ADVANCED_KEY = 'icon-editor:advanced'

const advanced = ref(readStorage(ADVANCED_KEY) === '1')
watch(advanced, (on) => writeStorage(ADVANCED_KEY, on ? '1' : '0'))

export function useSettings() {
  return { advanced }
}
