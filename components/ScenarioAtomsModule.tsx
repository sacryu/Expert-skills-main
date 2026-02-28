import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Layers, Box, Settings, Database, Zap, GitBranch,
  Activity, Gauge, Clock, ShieldAlert, CheckCircle, Target,
  BarChart3, Scale, AlertTriangle, FileText, Workflow, Beaker,
  Thermometer, Droplets, Wind, Zap as ZapIcon, Package, TrendingUp
} from 'lucide-react';
import { ATOMIC_ONTOLOGY_LIBRARY } from '../constants';
import { AtomicOntology } from '../types';

// 场景原子业务语义分类
interface PrincipleCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  atomIds: string[];
}

// 定义支撑业务流程图谱场景的原子业务语义分类
const PRINCIPLE_CATEGORIES: PrincipleCategory[] = [
  {
    id: 'scenario_core',
    name: '场景核心原子业务语义',
    description: '定义业务场景的基础属性，包括场景标识、状态、版本等信息',
    icon: Layers,
    color: '#4f46e5',
    bgColor: '#e0e7ff',
    atomIds: ['scenario_status', 'scenario_version', 'data_readiness', 'industry_type', 'domain_scope']
  },
  {
    id: 'hierarchy_structure',
    name: '层级结构原子业务语义',
    description: '支撑L1-L5层级定义的核心原子业务语义，用于构建场景的分子结构',
    icon: Box,
    color: '#2563eb',
    bgColor: '#dbeafe',
    atomIds: ['subsystem_type', 'process_type', 'param_category', 'skill_capability', 'node_level']
  },
  {
    id: 'relation_logic',
    name: '关系逻辑原子业务语义',
    description: '定义节点间关系的语义，包括依赖、触发、控制等关系类型',
    icon: GitBranch,
    color: '#0284c7',
    bgColor: '#e0f2fe',
    atomIds: ['relation_type', 'dependency_strength', 'trigger_condition', 'control_authority']
  },
  {
    id: 'decision_support',
    name: '决策支撑原子业务语义',
    description: '支撑场景决策分析的原子原子业务语义，包括权重、阈值、规则等',
    icon: Target,
    color: '#0d9488',
    bgColor: '#ccfbf1',
    atomIds: ['decision_weight', 'threshold_value', 'rule_type', 'influence_factor', 'priority_level']
  },
  {
    id: 'execution_metrics',
    name: '执行度量原子业务语义',
    description: '衡量场景执行效果的核心指标，包括成本、延迟、准确率等',
    icon: BarChart3,
    color: '#16a34a',
    bgColor: '#dcfce7',
    atomIds: ['execution_cost', 'latency_ms', 'accuracy_score', 'success_rate', 'throughput']
  },
  {
    id: 'quality_governance',
    name: '质量治理原子业务语义',
    description: '保障数据质量和场景可靠性的原子原子业务语义',
    icon: ShieldAlert,
    color: '#dc2626',
    bgColor: '#fee2e2',
    atomIds: ['data_quality_score', 'reliability_index', 'confidence_level', 'validation_status', 'risk_level']
  }
];

// 锂电制造场景专用原子业务语义
const LITHIUM_SPECIFIC_PRINCIPLES: PrincipleCategory[] = [
  {
    id: 'coating_process',
    name: '涂布工艺原子业务语义',
    description: '涂布工序场景构建必需的核心参数原子业务语义',
    icon: Beaker,
    color: '#7c3aed',
    bgColor: '#ede9fe',
    atomIds: ['coating_speed', 'coating_thickness', 'slurry_viscosity', 'coating_width', 'coating_temperature']
  },
  {
    id: 'rolling_process',
    name: '辊压工艺原子业务语义',
    description: '辊压工序场景构建必需的核心参数原子业务语义',
    icon: Scale,
    color: '#c026d3',
    bgColor: '#fae8ff',
    atomIds: ['rolling_pressure', 'rolling_thickness', 'thickness_uniformity', 'surface_density', 'pole_piece_density']
  },
  {
    id: 'electrical_performance',
    name: '电性能原子业务语义',
    description: '电池电性能评估场景的核心指标原子业务语义',
    icon: ZapIcon,
    color: '#ea580c',
    bgColor: '#ffedd5',
    atomIds: ['voltage', 'current', 'resistance', 'capacity', 'energy_density', 'power_density']
  },
  {
    id: 'environment_control',
    name: '环境控制原子业务语义',
    description: '制造环境监控场景必需的环境参数原子业务语义',
    icon: Wind,
    color: '#0891b2',
    bgColor: '#cffafe',
    atomIds: ['dew_point', 'cleanliness', 'ambient_temperature', 'humidity', 'pressure']
  },
  {
    id: 'safety_monitoring',
    name: '安全监控原子业务语义',
    description: '生产安全监控场景必需的安全参数原子业务语义',
    icon: AlertTriangle,
    color: '#dc2626',
    bgColor: '#fee2e2',
    atomIds: ['temperature_rise', 'gas_concentration', 'smoke_density', 'emergency_status', 'safety_interlock']
  },
  {
    id: 'material_properties',
    name: '材料特性原子业务语义',
    description: '材料质量评估场景必需的材料参数原子业务语义',
    icon: Package,
    color: '#65a30d',
    bgColor: '#ecfccb',
    atomIds: ['particle_size', 'specific_surface_area', 'tap_density', 'moisture_content', 'purity']
  }
];

const ScenarioAtomsModule: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'lithium'>('general');

  const currentCategories = activeTab === 'general' ? PRINCIPLE_CATEGORIES : LITHIUM_SPECIFIC_PRINCIPLES;

  // 获取原子详情
  const getAtomDetails = (atomId: string): AtomicOntology | undefined => {
    return ATOMIC_ONTOLOGY_LIBRARY.find(atom => atom.id === atomId);
  };

  const selectedCategoryData = currentCategories.find(c => c.id === selectedCategory);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/atoms')}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">场景原子业务语义</h2>
            <p className="text-slate-500 text-sm mt-1">
              支撑业务流程图谱场景构建的核心原子业务语义集合
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => { setActiveTab('general'); setSelectedCategory(null); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'general'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            通用语义
          </button>
          <button
            onClick={() => { setActiveTab('lithium'); setSelectedCategory(null); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'lithium'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            锂电制造专用
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left Panel - Category Cards */}
        <div className="w-1/2 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            {currentCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: category.bgColor }}
                    >
                      <Icon size={24} style={{ color: category.color }} />
                    </div>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: category.bgColor, color: category.color }}
                    >
                      {category.atomIds.length} 个语义
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-800 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{category.description}</p>

                  {/* Preview Atoms */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {category.atomIds.slice(0, 3).map(atomId => {
                      const atom = getAtomDetails(atomId);
                      return atom ? (
                        <span
                          key={atomId}
                          className="text-xs px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600"
                        >
                          {atom.name}
                        </span>
                      ) : null;
                    })}
                    {category.atomIds.length > 3 && (
                      <span className="text-xs px-2 py-0.5 text-slate-400">
                        +{category.atomIds.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <Workflow className="text-indigo-600" size={24} />
              <h3 className="font-semibold text-slate-800">场景构建指南</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-700">L1 场景层：</span>
                使用场景核心原子业务语义定义场景的基本属性和元数据
              </p>
              <p>
                <span className="font-medium text-slate-700">L2-L4 结构层：</span>
                通过层级结构原子业务语义构建子系统、工艺过程和参数的层次关系
              </p>
              <p>
                <span className="font-medium text-slate-700">L5 技能层：</span>
                绑定执行度量原子业务语义和决策支撑原子业务语义，实现场景的智能化执行
              </p>
              <p>
                <span className="font-medium text-slate-700">关系连接：</span>
                使用关系逻辑原子业务语义定义节点间的语义关联，形成完整的知识图谱
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Atom Details */}
        <div className="w-1/2 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
          {selectedCategoryData ? (
            <>
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: selectedCategoryData.bgColor }}
                  >
                    <selectedCategoryData.icon size={20} style={{ color: selectedCategoryData.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{selectedCategoryData.name}</h3>
                    <p className="text-sm text-slate-500">{selectedCategoryData.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {selectedCategoryData.atomIds.map(atomId => {
                    const atom = getAtomDetails(atomId);
                    if (!atom) return null;

                    return (
                      <div
                        key={atomId}
                        className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: selectedCategoryData.color }}
                            />
                            <span className="font-medium text-slate-800">{atom.name}</span>
                            {atom.unit && (
                              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {atom.unit}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{atom.dataType}</span>
                        </div>

                        <p className="text-sm text-slate-600 mt-2 ml-4">{atom.description}</p>

                        {atom.constraints && (
                          <div className="mt-2 ml-4 flex flex-wrap gap-2">
                            {atom.constraints.min !== undefined && (
                              <span className="text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded">
                                最小: {atom.constraints.min}
                              </span>
                            )}
                            {atom.constraints.max !== undefined && (
                              <span className="text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded">
                                最大: {atom.constraints.max}
                              </span>
                            )}
                            {atom.constraints.enum && (
                              <span className="text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded">
                                枚举: {atom.constraints.enum.join(', ')}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="mt-2 ml-4 flex flex-wrap gap-1">
                          {atom.tags.map((tag, idx) => (
                            <span key={idx} className="text-xs text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Usage Context */}
                        <div className="mt-3 ml-4 p-2 bg-slate-50 rounded text-xs text-slate-500">
                          <span className="font-medium">应用场景: </span>
                          {activeTab === 'general'
                            ? `适用于${selectedCategoryData.name}的业务流程图谱构建`
                            : `适用于锂电制造${selectedCategoryData.name.split('原子业务语义')[0]}场景`
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-3 opacity-30" />
                <p>选择左侧分类查看原子业务语义详情</p>
                <p className="text-sm mt-1">这些原子业务语义是构建业务流程图谱场景的基础</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioAtomsModule;
