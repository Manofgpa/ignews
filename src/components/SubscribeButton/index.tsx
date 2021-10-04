import styles from './styles.module.scss'
import { useSession, signIn } from 'next-auth/client'
import { api } from '../../services/api'
import { getStripe } from '../../services/stripe-js'
import { useRouter } from 'next/router'

interface SubscribeButtonProps {
  priceId: string
}

export const SubscribeButton = ({ priceId }: SubscribeButtonProps) => {
  const [session] = useSession()
  const router = useRouter()
  const handleSubscribe = async () => {
    if (!session) {
      signIn('github')
      return
    }

    if (session.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripe()

      await stripe.redirectToCheckout({
        sessionId,
      })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <button
      type='button'
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
