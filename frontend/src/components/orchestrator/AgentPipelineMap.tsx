"use client"

import React, { useEffect, memo } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { ShieldCheck, CheckCircle2, ShieldAlert, Cpu, Database, FileText } from "lucide-react"

/* Custom Node Component supporting Theme Specifications (Dark & Light) */
const PipelineNode = memo(({ data }: any) => {
  const { label, subtext, status, cost, icon: Icon } = data

  const isNegotiating = status === "Negotiating" || status === "402 Challenge Received"
  const isSettled = status === "Settled" || status === "Complete"
  const isBlocked = status === "Blocked"

  return (
    <div
      className={`
        relative px-5 py-4 rounded-2xl min-w-[240px] transition-all duration-300 shadow-md
        dark:bg-[#1A1A1A] bg-white
        ${
          isNegotiating
            ? "dark:border-2 dark:border-yellow-400 border-l-8 border-l-yellow-500 shadow-yellow-500/10"
            : isSettled
            ? "dark:border-2 dark:border-emerald-400 border-l-8 border-l-emerald-500 shadow-emerald-500/10"
            : isBlocked
            ? "dark:border-2 dark:border-red-500 border-l-8 border-l-red-500 shadow-red-500/10"
            : "dark:border dark:border-zinc-700 border-l-8 border-l-gray-300"
        }
      `}
    >
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-blue-500 !border-none" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isSettled
                ? "bg-emerald-500/15 text-emerald-500"
                : isNegotiating
                ? "bg-yellow-500/15 text-yellow-500 animate-pulse"
                : isBlocked
                ? "bg-red-500/15 text-red-500"
                : "bg-slate-500/15 text-slate-400"
            }`}
          >
            {Icon ? <Icon className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-zinc-100">{label}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{subtext}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-border/20 flex items-center justify-between text-[11px] font-mono">
        <span
          className={`font-semibold flex items-center gap-1 ${
            isSettled
              ? "text-emerald-600 dark:text-emerald-400"
              : isNegotiating
              ? "text-yellow-600 dark:text-yellow-400"
              : isBlocked
              ? "text-red-500"
              : "text-muted-foreground"
          }`}
        >
          {isSettled ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : isBlocked ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : isNegotiating ? (
            <ShieldCheck className="w-3.5 h-3.5 animate-spin" />
          ) : null}
          {status}
        </span>
        <span className="text-muted-foreground">{cost}</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-500 !border-none" />
    </div>
  )
})

const nodeTypes = { pipelineNode: PipelineNode }

const initialNodesList: Node[] = [
  {
    id: "node-1",
    type: "pipelineNode",
    position: { x: 200, y: 30 },
    data: {
      label: "Node 1: Legal Sandbox API",
      subtext: "DPDP Act Rubrics Lookup",
      status: "402 Challenge Received",
      cost: "$0.02 USDC",
      icon: Database,
    },
  },
  {
    id: "node-2",
    type: "pipelineNode",
    position: { x: 200, y: 190 },
    data: {
      label: "Node 2: Deceptive Pattern DB",
      subtext: "Taxonomy Classification",
      status: "Pending",
      cost: "$0.04 USDC",
      icon: Cpu,
    },
  },
  {
    id: "node-3",
    type: "pipelineNode",
    position: { x: 200, y: 350 },
    data: {
      label: "Node 3: LLM Synthesizer",
      subtext: "Compliance Synthesis & Report",
      status: "Pending",
      cost: "$0.00 (Local)",
      icon: FileText,
    },
  },
]

const initialEdgesList: Edge[] = [
  {
    id: "e1-2",
    source: "node-1",
    target: "node-2",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#94a3b8", strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "node-2",
    target: "node-3",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { stroke: "#94a3b8", strokeWidth: 2 },
  },
]

export function AgentPipelineMap({ activeExecution = false }: { activeExecution?: boolean }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodesList)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesList)

  useEffect(() => {
    if (activeExecution) {
      // Step 1: Node 1 402 Negotiation -> Settled
      setNodes((prev) =>
        prev.map((n) => (n.id === "node-1" ? { ...n, data: { ...n.data, status: "Negotiating" } } : n))
      )

      const timer1 = setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) => (n.id === "node-1" ? { ...n, data: { ...n.data, status: "Settled" } } : n))
        )
        setEdges((eds) =>
          eds.map((e) => (e.id === "e1-2" ? { ...e, style: { ...e.style, stroke: "#10b981", strokeWidth: 2.5 } } : e))
        )

        // Step 2: Node 2 Negotiating
        setNodes((prev) =>
          prev.map((n) => (n.id === "node-2" ? { ...n, data: { ...n.data, status: "Negotiating" } } : n))
        )
      }, 2000)

      const timer2 = setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) => (n.id === "node-2" ? { ...n, data: { ...n.data, status: "Settled" } } : n))
        )
        setEdges((eds) =>
          eds.map((e) => (e.id === "e2-3" ? { ...e, style: { ...e.style, stroke: "#10b981", strokeWidth: 2.5 } } : e))
        )

        // Step 3: Node 3 Synthesizing
        setNodes((prev) =>
          prev.map((n) => (n.id === "node-3" ? { ...n, data: { ...n.data, status: "Processing" } } : n))
        )
      }, 4500)

      const timer3 = setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) => (n.id === "node-3" ? { ...n, data: { ...n.data, status: "Complete" } } : n))
        )
      }, 6500)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    } else {
      setNodes(initialNodesList)
      setEdges(initialEdgesList)
    }
  }, [activeExecution, setNodes, setEdges])

  return (
    <div className="w-full h-full min-h-[460px] rounded-2xl glass-card-static overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} color="rgba(148, 163, 184, 0.25)" />
        <Controls className="!bg-white dark:!bg-[#1A1A1A] !border-border !rounded-xl" />
        <MiniMap
          zoomable
          pannable
          className="!bg-white dark:!bg-[#1A1A1A] !border-border"
          nodeColor={(n) => {
            if (n.data?.status === "Settled" || n.data?.status === "Complete") return "#10b981"
            if (n.data?.status === "Negotiating") return "#eab308"
            if (n.data?.status === "Blocked") return "#ef4444"
            return "#94a3b8"
          }}
        />
      </ReactFlow>
    </div>
  )
}
