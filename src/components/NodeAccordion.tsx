import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function NodeAccordion() {
  return (
    <div className="nodrag">
      <Accordion className="">
        <AccordionSummary
          //   className="absolute top-0 right-0"
          expandIcon={
            <ExpandMoreIcon fontSize="small" className="h-2 w-2 relative -top-3.5 right-2" />
          }
          aria-controls="panel-content"
          id="panel-header"
          onClick={(e) => e.stopPropagation()}
        ></AccordionSummary>
        <AccordionDetails>
          <div className="w-full bg-white z-10">
            <p>aaaaa</p>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
