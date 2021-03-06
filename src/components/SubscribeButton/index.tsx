import { useSession, signIn } from 'next-auth/react'
import { api } from '../../services/api'
import Router from 'next/router'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

export function SubscribeButton() {
  const { status, data } = useSession()

  async function handleSubscribe() {
    if (status === 'unauthenticated') {
      signIn('github')
      return
    }
    

    if (data?.activeSubscription) {
      Router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')
      const { sessionId } = response.data

      const stripe = await getStripeJs()
      stripe.redirectToCheckout({ sessionId })

    } catch (err) {
      alert(err.message)
    }

  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}