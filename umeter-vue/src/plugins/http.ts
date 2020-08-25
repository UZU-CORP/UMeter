import { Http } from '@/http/Http.ts'
import Cookies from '@/cookies/Cookies.ts'

const cookies = new Cookies()

export default new Http(
  {
    headers: {
      'X-CSRFToken': () => cookies.get('csrftoken')
    }
  }
)
