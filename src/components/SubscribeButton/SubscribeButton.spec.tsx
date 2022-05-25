import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/react'
import { SubscribeButton } from '.'


jest.mock('next-auth/react', () => {
  return {
    useSession: jest.fn(),
    signIn: jest.fn()
  }
})

describe('SubscribeButton component', () => {
  it('renders correctly when user is not authenticated', () => {
    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      status: 'authenticated', data: {
        user: { name: 'John Doe', email: 'john.doe@example.com' }, expires: 'fake-expires'
      }
    })
    
    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })
})