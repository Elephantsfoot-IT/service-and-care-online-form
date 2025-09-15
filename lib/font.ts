// app/fonts.ts
import { Roboto} from 'next/font/google'

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'], // Include all needed weights
  variable: '--font-roboto',
  display: 'swap',
})
