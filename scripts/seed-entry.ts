import { seed } from '../src/seed/index'

seed()
  .then(() => {
    console.log('✅ Seed complete')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
