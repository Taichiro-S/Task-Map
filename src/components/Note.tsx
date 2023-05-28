// import React from 'react'
// import useStore from 'stores/flowStore'
// import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline'

// const Note = () => {
//   const { editedNoteId, nodes, notes } = useStore()
//   const node = nodes.find((node) => node.id === editedNoteId)
//   const note = notes.find((note) => note.node_nanoid === editedNoteId)
//   const resetEditedNoteId = useStore((state) => state.resetEditedNoteId)
//   const updateNoteContent = useStore((state) => state.updateNoteContent)
//   const updateNodeLabel = useStore((state) => state.updateNodeLabel)
//   if (!node || !note) return null
//   return (
//     <div className="w-1/4 h-5/6 bg-white absolute bottom-10 right-4 z-50 rounded-2xl drop-shadow-md">
//       <ChevronDoubleRightIcon
//         className="h-6 w-6 text-gray-500 cursor-pointer"
//         onClick={(e) => {
//           e.stopPropagation()
//           resetEditedNoteId()
//         }}
//       />
//       <input
//         type="text"
//         className="w-full h-10 bg-gray-100 rounded-md"
//         value={node.data.label}
//         onChange={(e) => {
//           updateNodeLabel(note.node_nanoid, e.target.value)
//         }}
//       />
//       <textarea
//         className="w-full h-5/6 bg-gray-100 rounded-md"
//         value={note.content}
//         onChange={(e) => {
//           updateNoteContent(note.node_nanoid, e.target.value)
//         }}
//       />
//     </div>
//   )
// }

// export default Note
