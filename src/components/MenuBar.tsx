import useStore, { RFState } from '@/store'

const MenuBar = () => {
  const addNewNode = useStore((state) => state.addNewNode)
  return (
    <div className="w-1/2 h-1/10 bg-white absolute bottom-20 right-20 z-50 rounded-2xl drop-shadow-md">
      <span>MenuBar</span>
      <button
        className="w-10 h-10 bg-blue-500 rounded-full text-white"
        onClick={() => addNewNode()}
      >
        +
      </button>
      <button
        className="w-10 h-10 bg-blue-500  text-white"
        // onClick={() => }
      >
        Save
      </button>
    </div>
  )
}
export default MenuBar
