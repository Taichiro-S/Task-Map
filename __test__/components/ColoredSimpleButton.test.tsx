import { render, fireEvent, screen } from '@testing-library/react'
import { ColoredSimpleButton } from 'components/ColoredSimpleButton'
import userEvent from '@testing-library/user-event'
describe('<ColoredSimpleButton />', () => {
  it('renders correctly with initial OFF state and provided color', () => {
    render(<ColoredSimpleButton color="red" />)

    const buttonElement = screen.getByRole('button')

    // Test if button is rendered with initial OFF state
    expect(buttonElement.textContent).toBe('OFF')

    // Test if button is rendered with provided color
    expect(buttonElement.style.backgroundColor).toBe('red')
  })

  it('changes state to ON when clicked', async () => {
    render(<ColoredSimpleButton color="red" />)
    const user = userEvent.setup()

    const buttonElement = screen.getByRole('button')

    // Simulate button click
    await user.click(buttonElement)

    // Test if state is changed to ON
    expect(buttonElement.textContent).toBe('ON')
  })
})
