// node settings
import { CustomNode, GroupingNode } from 'components'
import { Node, NodeOrigin, NodeTypes } from 'reactflow'
export const nodeTypes: NodeTypes = {
  custom: CustomNode,
  grouping: GroupingNode,
}
export const nodeOrigin: NodeOrigin = [0, 0]

// edge settings
import { CustomEdge } from 'components'
import { EdgeTypes, ConnectionLineType, ConnectionMode, DefaultEdgeOptions } from 'reactflow'
export const connectionLineStyle: React.CSSProperties = { stroke: '#808080', strokeWidth: 1 }
export const defaultEdgeOptions: DefaultEdgeOptions = { style: connectionLineStyle, type: 'custom' }
export const defaultConnectionLineType: ConnectionLineType = ConnectionLineType.SimpleBezier
export const defaultConnectionMode: ConnectionMode = ConnectionMode.Loose
export const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

// background settings
import { BackgroundVariant, BackgroundProps } from 'reactflow'
export const backgroundSettings: BackgroundProps = {
  variant: BackgroundVariant.Dots,
  gap: 12,
  size: 1,
}

// mini map settings
import { MiniMapProps, MiniMapNodeProps } from 'reactflow'
export const miniMapSettings: MiniMapProps = {
  nodeBorderRadius: 2,
  position: 'top-right',
  zoomable: true,
  pannable: true,
  nodeColor: (node: Node) => {
    if (node.data.color === '#ffffff') return '#d4d4d8'
    return node.data.color
  },
  inversePan: true,
}

// panel settings
import { PanelPosition } from 'reactflow'
type PanelProps = {
  position: PanelPosition
  style?: React.CSSProperties
  className?: string
}
export const panelSettings: PanelProps = {
  position: 'top-left',
}

// controls settings
import { ControlProps } from 'reactflow'
export const controlSettings: ControlProps = {
  showZoom: false,
  showInteractive: true,
  position: 'bottom-left',
}
