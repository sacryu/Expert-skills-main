import React, { useState, useEffect } from 'react';
import {
  X, Plus, Save, Trash2, Layers, Atom, GitBranch, Box,
  ChevronRight, ChevronDown, Search, Tag, CheckCircle2,
  AlertCircle, Settings, ArrowRight, Database, Workflow
} from 'lucide-react';
import {
  AtomicOntology,
  MolecularOntology,
  BusinessScenario,
  AtomReference
} from '../types';
import {
  ATOMIC_ONTOLOGY_LIBRARY,
  ATOMIC_CATEGORIES,
  addDynamicScenario,
  convertMolecularToOntologyData,
  MOCK_SKILLS,
  DYNAMIC_SCENARIOS
} from '../constants';

interface ScenarioBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onScenarioCreated: (scenario: BusinessScenario) => void;
  editScenarioId?: string;
}

interface TreeNode {
  id: string;
  name: string;
  level: 2 | 3 | 4;
  children: TreeNode[];
  atomRefs: AtomReference[];
  expanded?: boolean;
}

const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({
  isOpen,
  onClose,
  onScenarioCreated,
  editScenarioId
}) => {
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDesc, setScenarioDesc] = useState('');
  const [industry, setIndustry] = useState('锂电池制造');
  const [domain, setDomain] = useState('生产制造');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [atomSearch, setAtomSearch] = useState('');
  const [showAtomLibrary, setShowAtomLibrary] = useState(false);

  const [currentStep, setCurrentStep] = useState<'basic' | 'structure' | 'atoms'>('basic');
  const [errors, setErrors] = useState<string[]>([]);

  const isEditMode = !!editScenarioId;

  useEffect(() => {
    if (isEditMode) {
      const existing = DYNAMIC_SCENARIOS.find(s => s.id === editScenarioId);
      if (existing) {
        setScenarioName(existing.name);
        setScenarioDesc(existing.description);
        setIndustry(existing.industry);
        setDomain(existing.domain);
        setTags(existing.tags);
        const tree = buildTreeFromMolecular(existing.molecularStructure);
        setTreeData(tree);
      }
    }
  }, [editScenarioId, isEditMode]);

  const buildTreeFromMolecular = (molecular: MolecularOntology[]): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    molecular.forEach(m => {
      nodeMap.set(m.id, {
        id: m.id,
        name: m.name,
        level: m.level,
        children: [],
        atomRefs: m.atomRefs,
        expanded: true
      });
    });

    molecular.forEach(m => {
      const node = nodeMap.get(m.id)!;
      if (m.parentId && nodeMap.has(m.parentId)) {
        const parent = nodeMap.get(m.parentId)!;
        parent.children.push(node);
      } else if (m.level === 2) {
        roots.push(node);
      }
    });

    return roots;
  };

  const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const validateBasicInfo = () => {
    const errs: string[] = [];
    if (!scenarioName.trim()) errs.push('请输入场景名称');
    if (!scenarioDesc.trim()) errs.push('请输入场景描述');
    if (treeData.length === 0) errs.push('请至少添加一个L2子系统');
    setErrors(errs);
    return errs.length === 0;
  };

  const addL2Node = () => {
    const newNode: TreeNode = {
      id: generateId(),
      name: `子系统${treeData.length + 1}`,
      level: 2,
      children: [],
      atomRefs: [],
      expanded: true
    };
    setTreeData([...treeData, newNode]);
  };

  const addChildNode = (parentId: string, level: 3 | 4) => {
    const newNode: TreeNode = {
      id: generateId(),
      name: level === 3 ? '新工艺过程' : '新参数',
      level,
      children: [],
      atomRefs: [],
      expanded: true
    };

    const updateTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return { ...node, children: [...node.children, newNode], expanded: true };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
  };

  const removeNode = (nodeId: string) => {
    const removeFromTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.filter(node => node.id !== nodeId).map(node => ({
        ...node,
        children: removeFromTree(node.children)
      }));
    };

    setTreeData(removeFromTree(treeData));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  const updateNodeName = (nodeId: string, newName: string) => {
    const updateTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, name: newName };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
  };

  const toggleExpanded = (nodeId: string) => {
    const updateTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
  };

  const addAtomToNode = (nodeId: string, atom: AtomicOntology) => {
    const atomRef: AtomReference = {
      atomId: atom.id,
      role: 'primary',
      required: true
    };

    const updateTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          const exists = node.atomRefs.some(ref => ref.atomId === atom.id);
          if (exists) return node;
          return { ...node, atomRefs: [...node.atomRefs, atomRef] };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
  };

  const removeAtomFromNode = (nodeId: string, atomId: string) => {
    const updateTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, atomRefs: node.atomRefs.filter(ref => ref.atomId !== atomId) };
        }
        if (node.children.length > 0) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };

    setTreeData(updateTree(treeData));
  };

  const flattenTree = (nodes: TreeNode[], parentId?: string): MolecularOntology[] => {
    const result: MolecularOntology[] = [];

    nodes.forEach(node => {
      const molecular: MolecularOntology = {
        id: node.id,
        name: node.name,
        description: '',
        level: node.level,
        parentId,
        atomRefs: node.atomRefs,
        children: node.children.map(c => c.id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      result.push(molecular);

      if (node.children.length > 0) {
        result.push(...flattenTree(node.children, node.id));
      }
    });

    return result;
  };

  const handleSave = () => {
    if (!validateBasicInfo()) return;

    const molecularStructure = flattenTree(treeData);

    const scenario: BusinessScenario = {
      id: isEditMode ? editScenarioId! : `scenario_${Date.now()}`,
      name: scenarioName,
      description: scenarioDesc,
      industry,
      domain,
      molecularStructure,
      status: 'published',
      version: '1.0.0',
      createdBy: 'current_user',
      createdAt: isEditMode
        ? DYNAMIC_SCENARIOS.find(s => s.id === editScenarioId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags
    };

    const ontologyData = convertMolecularToOntologyData(scenario, MOCK_SKILLS);
    addDynamicScenario(scenario, ontologyData);

    onScenarioCreated(scenario);
    onClose();

    setScenarioName('');
    setScenarioDesc('');
    setTreeData([]);
    setTags([]);
    setCurrentStep('basic');
  };

  const getSelectedNode = (): TreeNode | null => {
    const findNode = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === selectedNodeId) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    return findNode(treeData);
  };

  const filteredAtoms = ATOMIC_ONTOLOGY_LIBRARY.filter(atom => {
    const matchesCategory = selectedCategory === 'all' || atom.category === selectedCategory;
    const matchesSearch = atom.name.toLowerCase().includes(atomSearch.toLowerCase()) ||
                         atom.description.toLowerCase().includes(atomSearch.toLowerCase()) ||
                         atom.tags.some(t => t.toLowerCase().includes(atomSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const renderTree = (nodes: TreeNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            selectedNodeId === node.id
              ? 'bg-indigo-50 border border-indigo-200'
              : 'hover:bg-slate-50 border border-transparent'
          }`}
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
          onClick={() => setSelectedNodeId(node.id)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); toggleExpanded(node.id); }}
            className="mr-1 p-0.5 rounded hover:bg-slate-200"
          >
            {node.children.length > 0 && (
              node.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            )}
          </button>

          <div className={`w-6 h-6 rounded flex items-center justify-center mr-2 text-xs font-bold ${
            node.level === 2 ? 'bg-blue-100 text-blue-600' :
            node.level === 3 ? 'bg-sky-100 text-sky-600' :
            'bg-teal-100 text-teal-600'
          }`}>
            L{node.level}
          </div>

          <input
            type="text"
            value={node.name}
            onChange={(e) => updateNodeName(node.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700"
          />

          {node.atomRefs.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded">
              {node.atomRefs.length} 原子
            </span>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
            className="ml-2 p-1 text-slate-400 hover:text-red-500 rounded"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {node.expanded && node.children.length > 0 && (
          <div>{renderTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  const selectedNode = getSelectedNode();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Workflow className="text-indigo-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isEditMode ? '编辑场景' : '新建场景'}
              </h2>
              <p className="text-sm text-slate-500">通过原子化业务语义构建业务场景</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setCurrentStep('basic')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 'basic' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers size={16} />
            <span className="text-sm font-medium">基本信息</span>
          </button>
          <ArrowRight size={16} className="mx-3 text-slate-400" />
          <button
            onClick={() => currentStep !== 'basic' && setCurrentStep('structure')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 'structure' ? 'bg-indigo-600 text-white' :
              currentStep === 'atoms' ? 'bg-slate-200 text-slate-600' :
              'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GitBranch size={16} />
            <span className="text-sm font-medium">结构定义</span>
          </button>
          <ArrowRight size={16} className="mx-3 text-slate-400" />
          <button
            onClick={() => currentStep === 'structure' && setCurrentStep('atoms')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 'atoms' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Atom size={16} />
            <span className="text-sm font-medium">原子绑定</span>
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 p-6 overflow-y-auto">
            {currentStep === 'basic' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    场景名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    placeholder="例如：涂布工艺优化场景"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    场景描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={scenarioDesc}
                    onChange={(e) => setScenarioDesc(e.target.value)}
                    placeholder="描述该业务场景的业务目标和范围..."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">行业</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>锂电池制造</option>
                      <option>汽车制造</option>
                      <option>电子制造</option>
                      <option>化工</option>
                      <option>其他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">领域</label>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>生产制造</option>
                      <option>质量管理</option>
                      <option>设备维护</option>
                      <option>供应链</option>
                      <option>能源管理</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">标签</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded"
                      >
                        {tag}
                        <button
                          onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                          className="ml-1 text-slate-400 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && tagInput.trim()) {
                          setTags([...tags, tagInput.trim()]);
                          setTagInput('');
                        }
                      }}
                      placeholder="输入标签按回车添加"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => {
                        if (tagInput.trim()) {
                          setTags([...tags, tagInput.trim()]);
                          setTagInput('');
                        }
                      }}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentStep('structure')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  >
                    下一步
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'structure' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-700">分子结构定义</h3>
                  <button
                    onClick={addL2Node}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center text-sm"
                  >
                    <Plus size={16} className="mr-1" />
                    添加L2子系统
                  </button>
                </div>

                {treeData.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                    <div className="text-center">
                      <Box className="mx-auto text-slate-300 mb-2" size={48} />
                      <p className="text-slate-500">点击上方按钮添加第一个L2子系统</p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    {renderTree(treeData)}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep('basic')}
                    className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    上一步
                  </button>
                  <button
                    onClick={() => setCurrentStep('atoms')}
                    disabled={treeData.length === 0}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 flex items-center"
                  >
                    下一步
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'atoms' && (
              <div className="h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-700">原子业务语义绑定</h3>
                  <button
                    onClick={() => setShowAtomLibrary(!showAtomLibrary)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center text-sm"
                  >
                    <Database size={16} className="mr-1" />
                    {showAtomLibrary ? '隐藏原子库' : '打开原子库'}
                  </button>
                </div>

                <div className="flex gap-6 h-[calc(100%-80px)]">
                  <div className="flex-1">
                    {!selectedNode ? (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                        <div className="text-center">
                          <AlertCircle className="mx-auto text-slate-300 mb-2" size={48} />
                          <p className="text-slate-500">先在右侧选择一个L4参数节点</p>
                        </div>
                      </div>
                    ) : selectedNode.level !== 4 ? (
                      <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                        <div className="text-center">
                          <AlertCircle className="mx-auto text-amber-300 mb-2" size={48} />
                          <p className="text-slate-500">请选择L4层级（参数）节点进行原子绑定</p>
                          <p className="text-sm text-slate-400 mt-1">当前选择: {selectedNode.name} (L{selectedNode.level})</p>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-4">
                        <div className="mb-4">
                          <h4 className="font-medium text-slate-700">{selectedNode.name}</h4>
                          <p className="text-sm text-slate-500">已绑定原子:</p>
                        </div>
                        {selectedNode.atomRefs.length === 0 ? (
                          <p className="text-slate-400 text-sm">暂无绑定原子，请从右侧选择</p>
                        ) : (
                          <div className="space-y-2">
                            {selectedNode.atomRefs.map((ref, idx) => {
                              const atom = ATOMIC_ONTOLOGY_LIBRARY.find(a => a.id === ref.atomId);
                              if (!atom) return null;
                              return (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                  <div>
                                    <span className="font-medium text-slate-700">{atom.name}</span>
                                    <span className="text-xs text-slate-400 ml-2">{atom.unit}</span>
                                    <p className="text-xs text-slate-500">{atom.description}</p>
                                  </div>
                                  <button
                                    onClick={() => removeAtomFromNode(selectedNode.id, atom.id)}
                                    className="p-1 text-red-400 hover:text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-6">
                      <h4 className="font-medium text-slate-700 mb-2">结构预览</h4>
                      <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-48 overflow-y-auto">
                        {renderTree(treeData)}
                      </div>
                    </div>
                  </div>

                  {showAtomLibrary && (
                    <div className="w-80 border border-slate-200 rounded-lg flex flex-col bg-white">
                      <div className="p-3 border-b border-slate-200">
                        <h4 className="font-medium text-slate-700 mb-2">原子库</h4>
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={atomSearch}
                            onChange={(e) => setAtomSearch(e.target.value)}
                            placeholder="搜索原子..."
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="all">全部分类</option>
                          {ATOMIC_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2">
                        {filteredAtoms.map(atom => (
                          <button
                            key={atom.id}
                            onClick={() => selectedNode && selectedNode.level === 4 && addAtomToNode(selectedNode.id, atom)}
                            disabled={!selectedNode || selectedNode.level !== 4}
                            className="w-full text-left p-3 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed mb-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm text-slate-700">{atom.name}</span>
                              <span
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: ATOMIC_CATEGORIES.find(c => c.value === atom.category)?.color + '20',
                                  color: ATOMIC_CATEGORIES.find(c => c.value === atom.category)?.color
                                }}
                              >
                                {ATOMIC_CATEGORIES.find(c => c.value === atom.category)?.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{atom.description}</p>
                            {atom.unit && (
                              <span className="text-xs text-slate-400">单位: {atom.unit}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep('structure')}
                    className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
                  >
                    上一步
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Save size={18} className="mr-2" />
                    {isEditMode ? '保存修改' : '创建场景'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentStep === 'structure' && selectedNode && (
            <div className="w-64 border-l border-slate-200 bg-slate-50 p-4">
              <h4 className="font-medium text-slate-700 mb-4">节点操作</h4>
              <div className="space-y-2">
                <div className="text-sm text-slate-500 mb-2">
                  已选择: <span className="font-medium text-slate-700">{selectedNode.name}</span>
                </div>

                {selectedNode.level < 4 && (
                  <button
                    onClick={() => addChildNode(selectedNode.id, (selectedNode.level + 1) as 3 | 4)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center"
                  >
                    <Plus size={14} className="mr-2" />
                    添加L{selectedNode.level + 1}节点
                  </button>
                )}

                {selectedNode.atomRefs.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-medium text-slate-500 mb-2">已绑定原子</h5>
                    <div className="space-y-1">
                      {selectedNode.atomRefs.map((ref, idx) => {
                        const atom = ATOMIC_ONTOLOGY_LIBRARY.find(a => a.id === ref.atomId);
                        return atom ? (
                          <div key={idx} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded">
                            {atom.name}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {errors.length > 0 && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle size={16} className="mr-2" />
              {errors.join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioBuilder;
