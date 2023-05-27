import { render, fireEvent, screen } from '@testing-library/react'
import GroupNodeInput from 'components/GroupingNodeInput'
import useStore from 'stores/flowStore'
import { charLengthCalc } from 'utils/charLengthCalc'

jest.mock('store')
jest.mock('utils/charLengthCalc')

describe('GroupNodeInput', () => {
  test('renders input field correctly and calls updateNodeLabel on change', () => {
    const mockLabel = 'Node 1'
    const mockId = 'node1'
    const mockCharLengthCalc = charLengthCalc as jest.MockedFunction<typeof charLengthCalc>
    mockCharLengthCalc.mockReturnValue('50px')

    const mockUseStore = useStore as jest.MockedFunction<typeof useStore>
    const mockUpdateNodeLabel = jest.fn()
    mockUseStore.mockReturnValue({
      updateNodeLabel: mockUpdateNodeLabel,
    })

    render(<GroupNodeInput label={mockLabel} id={mockId} />)

    // Check if the input field is rendered with the correct default value
    const inputField = screen.getByDisplayValue(mockLabel)
    expect(inputField).toBeInTheDocument()
    expect(inputField).toHaveStyle({ width: '50px' })

    // Simulate user changing the input field value
    const newLabel = 'Node 2'
    fireEvent.change(inputField, { target: { value: newLabel } })

    // Check if updateNodeLabel was called correctly
    expect(mockUpdateNodeLabel).toHaveBeenCalledWith(mockId, newLabel)
  })
})
