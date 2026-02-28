import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import {
  getAllScenarios,
  getScenarioOntologyData,
  deleteDynamicScenario,
  DYNAMIC_SCENARIOS,
  SCENARIOS,
  addDynamicScenario,
  updateDynamicScenario,
  PRODUCTION_SALES_PROCESS_MAP,
  PRODUCTION_SALES_SEMANTICS,
  MOCK_SKILLS,
  ATOMIC_ONTOLOGY_LIBRARY,
  getRequirementsByProcessNode,
  isSimulationNode,
  getSimulationConfig,
  SIMULATION_NODES
} from '../constants';
import { OntologyNode, OntologyLink, BusinessScenario, SimulationNodeConfig } from '../types';
import { Layers, Plus, Trash2, Edit3, Box, PenTool, X, User, FileText, Database, Clock, AlertCircle, ArrowUp, ArrowDown, CheckCircle2, Circle, Loader2, Upload, FileUp, CheckCircle, RotateCcw, ZoomIn, ZoomOut, Lightbulb, Zap, Atom, ChevronRight, MessageCircle } from 'lucide-react';
import ScenarioBuilder from './ScenarioBuilder';
import OntologyGraphEditor from './OntologyGraphEditor';
import SimulationModal from './SimulationModal';

const OntologyGraph: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  // 合并静态和动态场景
  const allScenarios = getAllScenarios();

  // Get initial scenario from URL or default to the first one
  const initialScenarioId = searchParams.get('scenario') || allScenarios[0]?.id || '';
  const [activeScenarioId, setActiveScenarioId] = useState<string>(initialScenarioId);

  // 场景构建器状态
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingScenarioId, setEditingScenarioId] = useState<string | undefined>();

  // 图谱编辑器状态
  const [showGraphEditor, setShowGraphEditor] = useState(false);
  const [editingGraphData, setEditingGraphData] = useState<{ nodes: any[], links: any[] } | null>(null);

  // 节点详情面板状态
  const [selectedNode, setSelectedNode] = useState<OntologyNode | null>(null);
  const [showNodeDetail, setShowNodeDetail] = useState(false);
  const setSelectedNodeRef = useRef(setSelectedNode);
  const setShowNodeDetailRef = useRef(setShowNodeDetail);

  // 推演分析弹窗状态
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [simulationNode, setSimulationNode] = useState<OntologyNode | null>(null);
  const [simulationConfig, setSimulationConfig] = useState<SimulationNodeConfig | null>(null);

  // 更新 ref
  useEffect(() => {
    setSelectedNodeRef.current = setSelectedNode;
    setShowNodeDetailRef.current = setShowNodeDetail;
  }, []);

  // 强制刷新状态（用于动态场景更新后重新渲染）
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync state with URL if URL changes externally or initially
  useEffect(() => {
    const scenarioParam = searchParams.get('scenario');
    if (scenarioParam && allScenarios.some(s => s.id === scenarioParam)) {
      setActiveScenarioId(scenarioParam);
    }
  }, [searchParams, refreshKey]);

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    setSearchParams({ scenario: id });
  };

  const handleScenarioCreated = (scenario: BusinessScenario) => {
    setRefreshKey(prev => prev + 1);
    setActiveScenarioId(scenario.id);
    setSearchParams({ scenario: scenario.id });
  };

  const handleDeleteScenario = (id: string) => {
    if (confirm('确定要删除这个场景吗？此操作不可恢复。')) {
      deleteDynamicScenario(id);
      setRefreshKey(prev => prev + 1);
      if (activeScenarioId === id) {
        const remaining = getAllScenarios();
        if (remaining.length > 0) {
          setActiveScenarioId(remaining[0].id);
          setSearchParams({ scenario: remaining[0].id });
        }
      }
    }
  };

  const handleEditScenario = (id: string) => {
    setEditingScenarioId(id);
    setShowBuilder(true);
  };

  // 打开图谱编辑器
  const handleOpenGraphEditor = () => {
    const data = getScenarioOntologyData(activeScenarioId);
    if (data) {
      setEditingGraphData(data);
      setShowGraphEditor(true);
    }
  };

  // 保存图谱编辑
  const handleSaveGraphEdit = (ontologyData: { nodes: any[], links: any[] }) => {
    // 更新动态场景的业务语义数据
    const scenario = DYNAMIC_SCENARIOS.find(s => s.id === activeScenarioId);
    if (scenario) {
      // 更新场景的分子结构
      const molecularStructure = ontologyData.nodes
        .filter(n => n.group >= 2 && n.group <= 4)
        .map(n => ({
          id: n.id,
          name: n.label,
          description: n.description || '',
          level: n.group as 2 | 3 | 4,
          parentId: ontologyData.links.find((l: any) => l.target === n.id)?.source,
          atomRefs: n.atomRefs || [],
          children: ontologyData.links
            .filter((l: any) => l.source === n.id)
            .map((l: any) => l.target),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

      updateDynamicScenario(activeScenarioId, {
        molecularStructure,
        updatedAt: new Date().toISOString()
      });
    }

    // 如果是静态场景，创建为动态场景副本
    const staticScenario = SCENARIOS.find(s => s.id === activeScenarioId);
    if (staticScenario && !scenario) {
      const newScenario: BusinessScenario = {
        id: `scenario_${Date.now()}`,
        name: `${staticScenario.name} (自定义)`,
        description: staticScenario.description,
        industry: '锂电池制造',
        domain: '生产制造',
        molecularStructure: ontologyData.nodes
          .filter(n => n.group >= 2 && n.group <= 4)
          .map(n => ({
            id: n.id,
            name: n.label,
            description: n.description || '',
            level: n.group as 2 | 3 | 4,
            parentId: ontologyData.links.find((l: any) => l.target === n.id)?.source,
            atomRefs: n.atomRefs || [],
            children: ontologyData.links
              .filter((l: any) => l.source === n.id)
              .map((l: any) => l.target),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })),
        status: 'published',
        version: '1.0.0',
        createdBy: 'current_user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['自定义编辑']
      };

      addDynamicScenario(newScenario, ontologyData);
      setActiveScenarioId(newScenario.id);
      setSearchParams({ scenario: newScenario.id });
    }

    setShowGraphEditor(false);
    setRefreshKey(prev => prev + 1);
  };

  // D3 SVG refs
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // 获取当前场景的图谱数据
  const graphData = getScenarioOntologyData(activeScenarioId) || { nodes: [], links: [] };

  // 节点点击处理
  const handleNodeClick = (node: OntologyNode) => {
    // 检查是否为推演分析节点
    const simConfig = getSimulationConfig(node.id);
    if (simConfig) {
      setSimulationNode(node);
      setSimulationConfig(simConfig);
      setShowSimulationModal(true);
    } else {
      setSelectedNode(node);
      setShowNodeDetail(true);
    }
  };

  // 处理缩放
  const handleZoom = (scaleFactor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, scaleFactor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(500).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  // 军队/科研严谨风格配色
  const levelColors: Record<number, { fill: string; stroke: string; border: string }> = {
    1: { fill: '#1e3a5f', stroke: '#2c5282', border: '#4a6fa5' }, // L1 场景 - 藏青
    2: { fill: '#22543d', stroke: '#276749', border: '#38a169' }, // L2 系统 - 军绿
    3: { fill: '#744210', stroke: '#975a16', border: '#d69e2e' }, // L3 工艺 - 土黄
    4: { fill: '#742a2a', stroke: '#9b2c2c', border: '#e53e3e' }, // L4 参数 - 深红
    5: { fill: '#2d3748', stroke: '#4a5568', border: '#718096' }, // L5 技能 - 深灰
  };

  // D3 严谨军事风格渲染
  useEffect(() => {
    if (!svgRef.current || !gRef.current || graphData.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const container = containerRef.current;
    const width = container?.clientWidth || 800;
    const height = container?.clientHeight || 600;

    // 清空画布
    g.selectAll('*').remove();

    // 定义标记
    const defs = g.append('defs');

    // 箭头标记 - 统一使用深灰色
    defs.append('marker')
      .attr('id', 'arrow-mil')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 32)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L10,0L0,4')
      .attr('fill', '#4a5568');

    // 网格图案
    const gridPattern = defs.append('pattern')
      .attr('id', 'grid-mil')
      .attr('width', 40)
      .attr('height', 40)
      .attr('patternUnits', 'userSpaceOnUse');
    gridPattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1);

    // 绘制网格背景
    g.append('rect')
      .attr('width', width * 3)
      .attr('height', height * 3)
      .attr('x', -width)
      .attr('y', -height)
      .attr('fill', 'url(#grid-mil)');

    // 节点大小配置 - 更加规范
    const nodeRadius = (group: number) => {
      switch (group) {
        case 1: return 32; // L1 场景
        case 2: return 26; // L2 系统
        case 3: return 22; // L3 工艺
        case 4: return 18; // L4 参数
        case 5: return 16; // L5 技能
        default: return 20;
      }
    };

    // 准备数据
    const nodes = graphData.nodes.map(n => ({ ...n }));
    const links = graphData.links.map(l => ({ ...l }));

    // 力导向模拟 - 更加稳定的布局
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance((d: any) => {
        const sourceLevel = d.source.group || 3;
        const targetLevel = d.target.group || 3;
        return 100 + Math.abs(sourceLevel - targetLevel) * 50;
      }))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => nodeRadius(d.group) + 15));

    // 绘制连线 - 直线，军事风格
    const linkSelection = g.selectAll('line.link')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', '#4a5568')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow-mil)');

    // 绘制节点组
    const nodeGroups = g.selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .style('cursor', 'pointer');

    // 节点外边框
    nodeGroups.append('circle')
      .attr('class', 'node-border')
      .attr('r', (d: any) => nodeRadius(d.group) + 3)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => levelColors[d.group]?.border || '#4a5568')
      .attr('stroke-width', 2);

    // 节点主体 - 实心填充
    nodeGroups.append('circle')
      .attr('class', 'node-circle')
      .attr('r', (d: any) => nodeRadius(d.group))
      .attr('fill', (d: any) => levelColors[d.group]?.fill || '#2d3748')
      .attr('stroke', (d: any) => levelColors[d.group]?.stroke || '#4a5568')
      .attr('stroke-width', 1);

    // 数据就绪度指示 - 内部小圆点
    nodeGroups.append('circle')
      .attr('class', 'readiness-dot')
      .attr('cx', (d: any) => nodeRadius(d.group) * 0.6)
      .attr('cy', (d: any) => -nodeRadius(d.group) * 0.6)
      .attr('r', 4)
      .attr('fill', (d: any) => {
        const readiness = d.data_readiness || 0;
        if (readiness >= 85) return '#48bb78';
        if (readiness >= 60) return '#ed8936';
        return '#f56565';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // 推演节点标记 - 外圈紫色光环效果
    nodeGroups.each(function(d: any) {
      if (isSimulationNode(d.id)) {
        const g = d3.select(this);
        const radius = nodeRadius(d.group);

        // 外发光效果 - 使用渐变填充
        g.append('circle')
          .attr('class', 'simulation-glow')
          .attr('r', radius + 12)
          .attr('fill', 'rgba(99, 102, 241, 0.15)')
          .attr('stroke', '#6366f1')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '5,3');

        // 中环装饰
        g.append('circle')
          .attr('class', 'simulation-ring-middle')
          .attr('r', radius + 6)
          .attr('fill', 'none')
          .attr('stroke', '#818cf8')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8);

        // 推演标签 - 在节点上方显示"推演"标识
        g.append('rect')
          .attr('class', 'simulation-badge-bg')
          .attr('x', -18)
          .attr('y', -radius - 28)
          .attr('width', 36)
          .attr('height', 14)
          .attr('rx', 7)
          .attr('fill', '#6366f1')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);

        g.append('text')
          .attr('class', 'simulation-badge-text')
          .attr('text-anchor', 'middle')
          .attr('y', -radius - 18)
          .attr('font-size', '8px')
          .attr('font-weight', 'bold')
          .attr('fill', '#fff')
          .text('推演');
      }
    });

    // 节点标签 - 下方，等宽字体风格
    nodeGroups.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => nodeRadius(d.group) + 18)
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '600')
      .attr('fill', '#1a202c')
      .attr('letter-spacing', '0.5px')
      .text((d: any) => d.label?.length > 10 ? d.label.substring(0, 9) + '..' : d.label);

    // 节点层级标签 - 右上角
    nodeGroups.append('text')
      .attr('class', 'node-level')
      .attr('text-anchor', 'middle')
      .attr('x', (d: any) => nodeRadius(d.group) * 0.7)
      .attr('y', (d: any) => -nodeRadius(d.group) * 0.7)
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('fill', '#fff')
      .text((d: any) => `L${d.group}`);

    // 交互事件 - 简洁的hover效果
    nodeGroups
      .on('click', (_event: any, d: any) => {
        handleNodeClick(d);
      })
      .on('mouseover', function(event: any, d: any) {
        d3.select(this).select('.node-border')
          .transition().duration(150)
          .attr('stroke', '#1a202c')
          .attr('stroke-width', 3);
        d3.select(this).select('.node-circle')
          .transition().duration(150)
          .attr('r', nodeRadius(d.group) + 2);
      })
      .on('mouseout', function(event: any, d: any) {
        d3.select(this).select('.node-border')
          .transition().duration(150)
          .attr('stroke', levelColors[d.group]?.border || '#4a5568')
          .attr('stroke-width', 2);
        d3.select(this).select('.node-circle')
          .transition().duration(150)
          .attr('r', nodeRadius(d.group));
      });

    // 力导向更新 - 直线连接
    simulation.on('tick', () => {
      linkSelection
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeGroups.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // 缩放行为
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoomBehavior;
    svg.call(zoomBehavior as any);

    return () => {
      simulation.stop();
    };
  }, [graphData, activeScenarioId]);

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">业务流程图谱 (5级下钻)</h2>
            <p className="text-slate-500 text-sm">全景展示制造场景、子系统、工艺、参数及技能的量化关联。</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenGraphEditor}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center text-sm font-medium transition-colors"
          >
            <PenTool size={16} className="mr-2" />
            编辑图谱
          </button>
          <div className="flex gap-4 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm items-center">
            <span className="flex items-center text-xs text-slate-600 mr-2 border-r border-slate-200 pr-4">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span>L1 场景
                <span className="w-2 h-2 rounded-full bg-blue-500 mx-1 ml-2"></span>L2 系统
                <span className="w-2 h-2 rounded-full bg-sky-500 mx-1 ml-2"></span>L3 工艺
                <span className="w-2 h-2 rounded-full bg-teal-500 mx-1 ml-2"></span>L4 参数
                <span className="w-2 h-2 rounded-full bg-green-500 mx-1 ml-2"></span>L5 技能
            </span>
            
            <div className="flex items-center text-xs font-medium space-x-3">
                <span className="text-slate-400">数据完备度:</span>
                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>&lt;60% (差)</span>
                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>60-85% (良)</span>
                <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>&gt;85% (优)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Scenarios Sidebar */}
        <div className="w-72 flex-shrink-0 bg-white rounded-lg border border-slate-200 overflow-y-auto custom-scrollbar flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-700 flex items-center">
                        <Layers size={16} className="mr-2" />
                        制造场景 ({allScenarios.length})
                    </h3>
                    <button
                        onClick={() => {
                            setEditingScenarioId(undefined);
                            setShowBuilder(true);
                        }}
                        className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        title="新建场景"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>
            <div className="p-2 space-y-1 flex-1">
                {allScenarios.map(scene => {
                    const isDynamic = DYNAMIC_SCENARIOS.some(s => s.id === scene.id);
                    return (
                        <div
                            key={scene.id}
                            className={`group relative w-full text-left px-3 py-3 rounded-lg text-sm transition-colors flex flex-col ${
                                activeScenarioId === scene.id
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                            }`}
                        >
                            <button
                                onClick={() => handleScenarioChange(scene.id)}
                                className="text-left w-full"
                            >
                                <div className="flex items-center">
                                    <span className="font-medium flex-1">{scene.name}</span>
                                    {isDynamic && (
                                        <span title="动态场景">
                                            <Box size={12} className="text-indigo-400 ml-1" />
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400 mt-1 line-clamp-1">{scene.description}</span>
                            </button>

                            {isDynamic && (
                                <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditScenario(scene.id);
                                        }}
                                        className="p-1 bg-white rounded shadow-sm text-slate-400 hover:text-indigo-600"
                                        title="编辑"
                                    >
                                        <Edit3 size={12} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteScenario(scene.id);
                                        }}
                                        className="p-1 bg-white rounded shadow-sm text-slate-400 hover:text-red-600"
                                        title="删除"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Graph Container */}
        <div 
            ref={containerRef} 
            className="flex-1 bg-white rounded-lg border border-slate-200 shadow-inner overflow-hidden relative"
        >
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-mono text-slate-600 pointer-events-none border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-400 uppercase">Current View</div>
                <div className="font-bold text-indigo-600">{allScenarios.find(s => s.id === activeScenarioId)?.name}</div>
            </div>

            {/* 2D Military Style Graph */}
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={() => handleZoom(1.2)}
                    className="p-2 bg-white rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                    title="放大"
                >
                    <ZoomIn size={18} />
                </button>
                <button
                    onClick={() => handleZoom(0.8)}
                    className="p-2 bg-white rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                    title="缩小"
                >
                    <ZoomOut size={18} />
                </button>
                <button
                    onClick={handleResetZoom}
                    className="p-2 bg-white rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
                    title="重置视图"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            <svg
                ref={svgRef}
                className="w-full h-full cursor-grab active:cursor-grabbing bg-slate-50"
            >
                <g ref={gRef}></g>
            </svg>
        </div>
      </div>

      {/* 场景构建器弹窗 */}
      {showBuilder && (
        <ScenarioBuilder
          isOpen={showBuilder}
          onClose={() => {
            setShowBuilder(false);
            setEditingScenarioId(undefined);
          }}
          onScenarioCreated={handleScenarioCreated}
          editScenarioId={editingScenarioId}
        />
      )}

      {/* 图谱编辑器弹窗 */}
      {showGraphEditor && editingGraphData && (
        <OntologyGraphEditor
          scenarioId={activeScenarioId}
          initialData={editingGraphData}
          onSave={handleSaveGraphEdit}
          onClose={() => setShowGraphEditor(false)}
        />
      )}

      {/* 节点详情侧边面板 */}
      {showNodeDetail && selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          allNodes={getScenarioOntologyData(activeScenarioId)?.nodes || []}
          onClose={() => {
            setShowNodeDetail(false);
            setSelectedNode(null);
          }}
        />
      )}

      {/* 推演分析弹窗 */}
      {showSimulationModal && simulationNode && simulationConfig && (
        <SimulationModal
          isOpen={showSimulationModal}
          node={simulationNode}
          config={simulationConfig}
          allNodes={getScenarioOntologyData(activeScenarioId)?.nodes || []}
          allLinks={getScenarioOntologyData(activeScenarioId)?.links || []}
          onClose={() => {
            setShowSimulationModal(false);
            setSimulationNode(null);
            setSimulationConfig(null);
          }}
        />
      )}
    </div>
  );
};

// 添加 CSS 动画
const slideInAnimation = `
@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes simulationPulse {
  0%, 100% {
    stroke-opacity: 0.6;
    stroke-width: 2;
  }
  50% {
    stroke-opacity: 1;
    stroke-width: 3;
  }
}

.simulation-glow {
  animation: simulationPulse 2s ease-in-out infinite;
}
`;

// 关联性分析面板组件
interface BackwardAnalysisPanelProps {
  nodeId: string;
  nodeLabel: string;
}

const BackwardAnalysisPanel: React.FC<BackwardAnalysisPanelProps> = ({ nodeId, nodeLabel }) => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'semantics' | 'skills' | 'atoms'>('semantics');
  const navigate = useNavigate();

  // 获取倒推结果
  const requirements = getRequirementsByProcessNode(nodeId);

  // 跳转到业务语义页面
  const handleSemanticClick = (semanticId: string) => {
    navigate('/business-semantic', { state: { selectedSemantic: semanticId } });
  };

  // 跳转到技能详情页面
  const handleSkillClick = (skillId: string) => {
    navigate(`/skills/${skillId}`);
  };

  // 跳转到业务释义库页面
  const handleAtomClick = (atomId: string) => {
    navigate('/atoms', { state: { selectedAtom: atomId } });
  };

  // 如果没有映射数据，不显示
  if (!requirements || (requirements.semantics.length === 0 && requirements.skills.length === 0)) {
    return null;
  }

  // 获取技能详情
  const getSkillDetails = (skillId: string) => {
    return MOCK_SKILLS.find(s => s.skill_id === skillId);
  };

  // 获取业务释义详情
  const getAtomDetails = (atomId: string) => {
    return ATOMIC_ONTOLOGY_LIBRARY.find(a => a.id === atomId);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between bg-indigo-100/50 hover:bg-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-900">关联性</span>
          <span className="text-xs text-indigo-600 bg-indigo-200/50 px-2 py-0.5 rounded-full">
            {requirements.semantics.length} 语义 · {requirements.skills.length} 技能
          </span>
        </div>
        <ChevronRight
          size={16}
          className={`text-indigo-600 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      {expanded && (
        <div className="p-3">
          {/* Tabs */}
          <div className="flex gap-1 mb-3 bg-white rounded-lg p-1 border border-indigo-100">
            <button
              onClick={() => setActiveTab('semantics')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors ${
                activeTab === 'semantics'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-indigo-50'
              }`}
            >
              业务语义
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors ${
                activeTab === 'skills'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-indigo-50'
              }`}
            >
              所需技能
            </button>
            <button
              onClick={() => setActiveTab('atoms')}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-colors ${
                activeTab === 'atoms'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-indigo-50'
              }`}
            >
              业务释义
            </button>
          </div>

          {/* Content */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {activeTab === 'semantics' && (
              <>
                {requirements.semantics.map((semantic) => (
                  <div
                    key={semantic.id}
                    onClick={() => handleSemanticClick(semantic.id)}
                    className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Zap size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900">{semantic.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{semantic.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            semantic.category === 'sales' ? 'bg-blue-100 text-blue-700' :
                            semantic.category === 'production' ? 'bg-green-100 text-green-700' :
                            semantic.category === 'inventory' ? 'bg-amber-100 text-amber-700' :
                            semantic.category === 'quality' ? 'bg-red-100 text-red-700' :
                            semantic.category === 'planning' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {semantic.category === 'sales' ? '销售' :
                             semantic.category === 'production' ? '生产' :
                             semantic.category === 'inventory' ? '库存' :
                             semantic.category === 'quality' ? '质量' :
                             semantic.category === 'finance' ? '财务' :
                             semantic.category === 'logistics' ? '物流' :
                             semantic.category === 'customer' ? '客户' :
                             semantic.category === 'planning' ? '计划' : '其他'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {semantic.atoms.length} 释义 · {semantic.skills.length} 技能
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'skills' && (
              <>
                {requirements.skills.map((skillId) => {
                  const skill = getSkillDetails(skillId);
                  if (!skill) return null;
                  return (
                    <div
                      key={skillId}
                      onClick={() => handleSkillClick(skillId)}
                      className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm cursor-pointer hover:shadow-md hover:border-amber-300 transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                          <Box size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900">{skill.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{skill.description}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              v{skill.version}
                            </span>
                            <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
                              准确率 {(skill.accuracy_score * 100).toFixed(0)}%
                            </span>
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                              {(skill.latency / 1000).toFixed(1)}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {activeTab === 'atoms' && (
              <>
                {requirements.atoms.map((atomId) => {
                  const atom = getAtomDetails(atomId);
                  if (!atom) return null;
                  return (
                    <div
                      key={atomId}
                      onClick={() => handleAtomClick(atomId)}
                      className="bg-white rounded-lg p-3 border border-indigo-100 shadow-sm cursor-pointer hover:shadow-md hover:border-cyan-300 transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0">
                          <Atom size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900">{atom.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{atom.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded font-mono">
                              {atom.id}
                            </span>
                            {atom.unit && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                单位: {atom.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// 节点详情面板组件
interface NodeDetailPanelProps {
  node: OntologyNode;
  allNodes: OntologyNode[];
  onClose: () => void;
}

const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, allNodes, onClose }) => {
  const getLevelName = (group?: number) => {
    switch (group) {
      case 1: return 'L1 场景';
      case 2: return 'L2 子系统';
      case 3: return 'L3 工艺过程';
      case 4: return 'L4 参数';
      case 5: return 'L5 技能';
      default: return '未知层级';
    }
  };

  const getLevelColor = (group?: number) => {
    switch (group) {
      case 1: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 2: return 'bg-blue-100 text-blue-700 border-blue-200';
      case 3: return 'bg-sky-100 text-sky-700 border-sky-200';
      case 4: return 'bg-teal-100 text-teal-700 border-teal-200';
      case 5: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={14} className="text-green-600" />;
      case 'in_progress': return <Loader2 size={14} className="text-blue-600 animate-spin" />;
      default: return <Circle size={14} className="text-slate-400" />;
    }
  };

  // 默认数据（如果节点没有这些字段）
  const owner = node.owner || '待指定';
  const responsibility = node.responsibility || '暂无职责描述';
  const upstreamNodes = node.upstreamNodes || [];
  const downstreamNodes = node.downstreamNodes || [];
  const dataSource = node.dataSource || '待定义';
  const dataFormat = node.dataFormat || '待定义';
  const updateFrequency = node.updateFrequency || '待定义';
  const pendingTasks = node.pendingTasks || [];

  // 文件导入状态
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isImportMode = dataSource === '导入';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setUploadStatus('uploading');
    // 模拟上传过程
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(() => {
        setSelectedFile(null);
        setUploadStatus('idle');
      }, 2000);
    }, 1500);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // 状态指示器组件
  const StatusIndicator = ({ completed, label }: { completed: boolean; label: string }) => (
    <div className="flex items-center gap-1" title={label}>
      <span className={`w-2 h-2 rounded-full ${completed ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );

  // 关联节点项组件
  const RelatedNodeItem = ({ node: relatedNode }: { node: any }) => (
    <div className="bg-white px-2 py-2 rounded border border-slate-200">
      <div className="text-xs font-medium text-slate-700 truncate mb-1.5">{relatedNode.label}</div>
      <div className="flex items-center gap-3">
        <StatusIndicator completed={relatedNode.dataSubmitted} label="数据提交" />
        <StatusIndicator completed={relatedNode.instructionCompleted} label="指令完成" />
      </div>
    </div>
  );

  return (
    <>
      <style>{slideInAnimation}</style>
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col"
           style={{ animation: 'slideInFromRight 0.3s ease-out' }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getLevelColor(node.group)}`}>
            {getLevelName(node.group)}
          </span>
          <span className="text-xs text-slate-500">数据完备度: {node.data_readiness || 0}%</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Node Title */}
        <div>
          <h2 className="text-lg font-bold text-slate-900">{node.label}</h2>
          <p className="text-sm text-slate-500 mt-1">ID: {node.id}</p>
        </div>

        {/* 负责人 */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <User size={16} className="text-indigo-500" />
            <span>负责人</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
              {owner.charAt(0)}
            </div>
            <span className="text-slate-900 font-medium">{owner}</span>
          </div>
        </div>

        {/* 职责描述 */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
            <FileText size={16} className="text-blue-500" />
            <span>职责描述</span>
          </div>
          <p className="text-sm text-slate-600 bg-blue-50 rounded-lg p-3 border border-blue-100 leading-relaxed">
            {responsibility}
          </p>
        </div>

        {/* 数据上下游 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 上一级节点 */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <ArrowUp size={14} className="text-blue-500" />
              <span>上一级节点</span>
            </div>
            {upstreamNodes.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {upstreamNodes.map((relatedNode: any, idx: number) => (
                  <RelatedNodeItem key={idx} node={relatedNode} />
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">无上一级节点</span>
            )}
          </div>

          {/* 下一级节点 */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <ArrowDown size={14} className="text-orange-500" />
              <span>下一级节点</span>
            </div>
            {downstreamNodes.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {downstreamNodes.map((relatedNode: any, idx: number) => (
                  <RelatedNodeItem key={idx} node={relatedNode} />
                ))}
              </div>
            ) : (
              <span className="text-xs text-slate-400 italic">无下一级节点</span>
            )}
          </div>
        </div>

        {/* 数据源、格式与更新频率 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <Database size={14} className="text-purple-500" />
              <span>数据源</span>
            </div>
            <span className="text-sm text-slate-900 font-medium">{dataSource}</span>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <FileText size={14} className="text-orange-500" />
              <span>格式</span>
            </div>
            <span className="text-sm text-slate-900 font-medium">{dataFormat}</span>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
              <Clock size={14} className="text-cyan-500" />
              <span>更新频率</span>
            </div>
            <span className="text-sm text-slate-900 font-medium">{updateFrequency}</span>
          </div>
        </div>

        {/* 文件导入功能 - 仅在导入模式下显示 */}
        {isImportMode && (
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 mb-3">
              <Upload size={16} />
              <span>文件导入</span>
            </div>

            {/* 文件拖放区域 */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-indigo-300 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-100/50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".csv,.json,.xml,.xlsx,.xls"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2">
                  <FileUp size={20} className="text-indigo-500" />
                  <span className="text-sm text-indigo-600 font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-slate-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <div className="text-center">
                  <Upload size={24} className="text-indigo-400 mx-auto mb-2" />
                  <p className="text-sm text-indigo-600">点击或拖拽文件到此处上传</p>
                  <p className="text-xs text-indigo-400 mt-1">支持格式: CSV, JSON, XML, Excel</p>
                </div>
              )}
            </div>

            {/* 上传按钮和状态 */}
            {selectedFile && uploadStatus !== 'success' && (
              <button
                onClick={handleUpload}
                disabled={uploadStatus === 'uploading'}
                className="w-full mt-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>上传中...</span>
                  </>
                ) : (
                  <>
                    <FileUp size={16} />
                    <span>开始导入</span>
                  </>
                )}
              </button>
            )}

            {/* 上传成功提示 */}
            {uploadStatus === 'success' && (
              <div className="mt-3 p-2 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-sm text-green-700">文件导入成功!</span>
              </div>
            )}

            {/* 数据格式提示 */}
            <div className="mt-3 text-xs text-slate-500 bg-white/50 p-2 rounded">
              <p className="font-medium text-slate-600 mb-1">预期数据格式: {dataFormat}</p>
              <p>请确保上传文件中包含节点「{node.label}」的完整数据</p>
            </div>
          </div>
        )}

        {/* 需提交的任务 */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
            <AlertCircle size={16} className="text-red-500" />
            <span>需提交的任务</span>
            <span className="ml-auto text-xs text-slate-400">({pendingTasks.length})</span>
          </div>
          {pendingTasks.length > 0 ? (
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <div key={task.id} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="text-sm font-medium text-slate-900">{task.title}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 text-xs rounded border ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 ml-5">{task.description}</p>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 mt-2 ml-5">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-600">截止: {task.dueDate}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
              <CheckCircle2 size={24} className="text-green-500 mx-auto mb-2" />
              <p className="text-sm text-slate-500">暂无需提交的任务</p>
            </div>
          )}
        </div>

        {/* 关联性分析 - 业务语义与技能 */}
        <BackwardAnalysisPanel nodeId={node.id} nodeLabel={node.label} />
      </div>
    </div>
    </>
  );
};


export default OntologyGraph;
