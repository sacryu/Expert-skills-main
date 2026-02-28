import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Trash2, Code, FileText, Settings,
  Cpu, Tag, Database, Zap, CheckCircle, AlertCircle,
  ChevronRight, ChevronDown, Box, Layers, GitBranch
} from 'lucide-react';
import { Skill, AtomicOntology, MolecularOntology, BusinessScenario } from '../types';
import {
  MOCK_SKILLS,
  getAllScenarios,
  ATOMIC_ONTOLOGY_LIBRARY,
  DYNAMIC_SCENARIOS
} from '../constants';

interface FormData {
  skill_id: string;
  name: string;
  version: string;
  description: string;
  domain: string[];
  capability_tags: string[];
  input_schema: Record<string, string>;
  output_schema: Record<string, string>;
  cost: number;
  latency: number;
  accuracy_score: number;
  dependencies: string[];
  files: {
    readme: string;
    config: string;
    script: string;
    scriptLang: 'python' | 'javascript';
  };
}

interface SchemaField {
  key: string;
  type: string;
}

const SkillRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState<FormData>({
    skill_id: '',
    name: '',
    version: '1.0.0',
    description: '',
    domain: [],
    capability_tags: [],
    input_schema: {},
    output_schema: {},
    cost: 0.5,
    latency: 100,
    accuracy_score: 0.9,
    dependencies: [],
    files: {
      readme: '',
      config: '{}',
      script: '',
      scriptLang: 'python'
    }
  });

  // 临时输入状态
  const [tagInput, setTagInput] = useState('');
  const [dependencyInput, setDependencyInput] = useState('');
  const [inputSchemaFields, setInputSchemaFields] = useState<SchemaField[]>([]);
  const [outputSchemaFields, setOutputSchemaFields] = useState<SchemaField[]>([]);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldType, setNewFieldType] = useState('string');
  const [schemaMode, setSchemaMode] = useState<'input' | 'output'>('input');

  // 获取所有场景
  const allScenarios = getAllScenarios();

  // 代码模板
  const codeTemplates = {
    python: `def handler(event):
    """
    技能主处理函数

    Args:
        event: 包含输入参数的字典

    Returns:
        处理结果字典
    """
    # 获取输入参数
    input_data = event.get('input_data', {})

    # TODO: 实现业务逻辑
    result = {
        'status': 'success',
        'data': {}
    }

    return result`,
    javascript: `/**
 * 技能主处理函数
 * @param {Object} event - 包含输入参数的对象
 * @returns {Object} 处理结果
 */
exports.handler = async (event) => {
  // 获取输入参数
  const inputData = event.input_data || {};

  // TODO: 实现业务逻辑
  const result = {
    status: 'success',
    data: {}
  };

  return result;
};`
  };

  useEffect(() => {
    // 初始化脚本模板
    if (!formData.files.script) {
      setFormData(prev => ({
        ...prev,
        files: {
          ...prev.files,
          script: codeTemplates[prev.files.scriptLang]
        }
      }));
    }
  }, []);

  const validateStep = (step: number): boolean => {
    const errs: string[] = [];

    if (step === 1) {
      if (!formData.skill_id.trim()) errs.push('技能ID不能为空');
      if (!/^[a-z0-9_]+$/.test(formData.skill_id)) errs.push('技能ID只能包含小写字母、数字和下划线');
      if (!formData.name.trim()) errs.push('技能名称不能为空');
      if (!formData.description.trim()) errs.push('技能描述不能为空');
      if (formData.domain.length === 0) errs.push('至少选择一个应用场景');
    }

    if (step === 2) {
      if (Object.keys(formData.input_schema).length === 0) errs.push('至少定义一个输入参数');
      if (Object.keys(formData.output_schema).length === 0) errs.push('至少定义一个输出参数');
    }

    if (step === 3) {
      if (!formData.files.script.trim()) errs.push('脚本代码不能为空');
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    // 检查ID是否已存在
    if (MOCK_SKILLS.some(s => s.skill_id === formData.skill_id)) {
      setErrors(['技能ID已存在，请使用其他ID']);
      return;
    }

    // 创建新技能对象
    const newSkill: Skill = {
      ...formData,
      skill_id: formData.skill_id,
      files: {
        ...formData.files,
        config: formData.files.config || '{}'
      }
    };

    // 添加到MOCK_SKILLS（实际项目中应该调用API）
    MOCK_SKILLS.push(newSkill);

    // 跳转到技能详情页
    navigate(`/skills/${newSkill.skill_id}`);
  };

  const addSchemaField = () => {
    if (!newFieldKey.trim()) return;

    if (schemaMode === 'input') {
      setFormData(prev => ({
        ...prev,
        input_schema: { ...prev.input_schema, [newFieldKey]: newFieldType }
      }));
      setInputSchemaFields(prev => [...prev, { key: newFieldKey, type: newFieldType }]);
    } else {
      setFormData(prev => ({
        ...prev,
        output_schema: { ...prev.output_schema, [newFieldKey]: newFieldType }
      }));
      setOutputSchemaFields(prev => [...prev, { key: newFieldKey, type: newFieldType }]);
    }

    setNewFieldKey('');
  };

  const removeSchemaField = (key: string, mode: 'input' | 'output') => {
    if (mode === 'input') {
      const newSchema = { ...formData.input_schema };
      delete newSchema[key];
      setFormData(prev => ({ ...prev, input_schema: newSchema }));
      setInputSchemaFields(prev => prev.filter(f => f.key !== key));
    } else {
      const newSchema = { ...formData.output_schema };
      delete newSchema[key];
      setFormData(prev => ({ ...prev, output_schema: newSchema }));
      setOutputSchemaFields(prev => prev.filter(f => f.key !== key));
    }
  };

  const toggleDomain = (scenarioId: string) => {
    setFormData(prev => ({
      ...prev,
      domain: prev.domain.includes(scenarioId)
        ? prev.domain.filter(id => id !== scenarioId)
        : [...prev.domain, scenarioId]
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.capability_tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        capability_tags: [...prev.capability_tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      capability_tags: prev.capability_tags.filter(t => t !== tag)
    }));
  };

  const addDependency = () => {
    if (dependencyInput.trim() && !formData.dependencies.includes(dependencyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        dependencies: [...prev.dependencies, dependencyInput.trim()]
      }));
      setDependencyInput('');
    }
  };

  const removeDependency = (dep: string) => {
    setFormData(prev => ({
      ...prev,
      dependencies: prev.dependencies.filter(d => d !== dep)
    }));
  };

  // 渲染场景树结构
  const renderScenarioTree = () => {
    return (
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {allScenarios.map(scenario => {
          const isSelected = formData.domain.includes(scenario.id);
          const isDynamic = DYNAMIC_SCENARIOS.some(s => s.id === scenario.id);

          return (
            <div
              key={scenario.id}
              onClick={() => toggleDomain(scenario.id)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-indigo-50 border border-indigo-200'
                  : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
              }`}>
                {isSelected && <CheckCircle size={14} className="text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-slate-700">{scenario.name}</span>
                  {isDynamic && (
                    <span className="ml-2 px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded">
                      自定义
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{scenario.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 步骤标题
  const stepTitles = [
    { title: '基本信息', icon: FileText },
    { title: '接口定义', icon: Database },
    { title: '代码实现', icon: Code },
    { title: '性能配置', icon: Settings }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/skills')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">注册新技能</h2>
            <p className="text-slate-500 text-sm">创建并注册一个新的AI技能到技能中心</p>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center space-x-2">
          {stepTitles.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = currentStep === idx + 1;
            const isCompleted = currentStep > idx + 1;

            return (
              <React.Fragment key={idx}>
                <div className={`flex items-center px-3 py-2 rounded-lg ${
                  isActive ? 'bg-indigo-600 text-white' :
                  isCompleted ? 'bg-green-100 text-green-700' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  <StepIcon size={16} className="mr-2" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {idx < stepTitles.length - 1 && (
                  <ChevronRight size={16} className="text-slate-300" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-600 mb-2">
            <AlertCircle size={18} className="mr-2" />
            <span className="font-medium">请修正以下错误：</span>
          </div>
          <ul className="list-disc list-inside text-sm text-red-600 ml-2">
            {errors.map((err, idx) => <li key={idx}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* Form Content */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="h-full p-6 overflow-y-auto">
          {/* Step 1: 基本信息 */}
          {currentStep === 1 && (
            <div className="max-w-3xl space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    技能ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.skill_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, skill_id: e.target.value }))}
                    placeholder="例如：coating_thickness_control"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">只能使用小写字母、数字和下划线</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    版本号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="例如：1.0.0"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  技能名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="例如：涂布厚度智能控制"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  技能描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="详细描述该技能的功能、适用场景和业务价值..."
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  应用场景 <span className="text-red-500">*</span>
                </label>
                <div className="border border-slate-300 rounded-lg p-4 bg-slate-50">
                  {formData.domain.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.domain.map(domainId => {
                        const scenario = allScenarios.find(s => s.id === domainId);
                        return scenario ? (
                          <span
                            key={domainId}
                            className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                          >
                            {scenario.name}
                            <button
                              onClick={() => toggleDomain(domainId)}
                              className="ml-2 text-indigo-500 hover:text-indigo-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 mb-3">请选择该技能适用的业务场景</p>
                  )}
                  <button
                    onClick={() => setShowScenarioSelector(!showScenarioSelector)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {showScenarioSelector ? '收起场景列表' : '+ 选择场景'}
                  </button>

                  {showScenarioSelector && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      {renderScenarioTree()}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  能力标签
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.capability_tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="输入标签按回车添加"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 接口定义 */}
          {currentStep === 2 && (
            <div className="max-w-4xl space-y-6">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setSchemaMode('input')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    schemaMode === 'input'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  输入参数
                </button>
                <button
                  onClick={() => setSchemaMode('output')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    schemaMode === 'output'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  输出参数
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    {schemaMode === 'input' ? '输入参数定义' : '输出参数定义'}
                  </h3>

                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newFieldKey}
                        onChange={(e) => setNewFieldKey(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSchemaField()}
                        placeholder="参数名称"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="string">字符串</option>
                        <option value="number">数值</option>
                        <option value="boolean">布尔值</option>
                        <option value="array">数组</option>
                        <option value="object">对象</option>
                      </select>
                      <button
                        onClick={addSchemaField}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(schemaMode === 'input' ? inputSchemaFields : outputSchemaFields).map((field, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center">
                            <Database size={14} className="text-slate-400 mr-2" />
                            <span className="font-medium text-slate-700">{field.key}</span>
                            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                              {field.type}
                            </span>
                          </div>
                          <button
                            onClick={() => removeSchemaField(field.key, schemaMode)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {(schemaMode === 'input' ? inputSchemaFields : outputSchemaFields).length === 0 && (
                        <p className="text-center text-slate-400 py-4">暂无参数定义</p>
                      )}
                    </div>
                  </div>

                  {/* 原子业务语义推荐 */}
                  <div className="border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                      <Box size={16} className="mr-2 text-indigo-600" />
                      可关联的原子业务语义
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {ATOMIC_ONTOLOGY_LIBRARY.slice(0, 10).map(atom => (
                        <div
                          key={atom.id}
                          className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                          onClick={() => {
                            setNewFieldKey(atom.name);
                            setNewFieldType(atom.dataType);
                          }}
                        >
                          <div>
                            <span className="text-sm font-medium text-slate-700">{atom.name}</span>
                            <span className="text-xs text-slate-400 ml-2">{atom.unit}</span>
                          </div>
                          <Plus size={14} className="text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-slate-800 mb-4">接口预览</h3>
                  <div className="bg-slate-900 rounded-lg p-4 text-sm font-mono text-green-400 overflow-x-auto">
                    <pre>{`{
  "skill_id": "${formData.skill_id}",
  "name": "${formData.name}",
  "input_schema": ${JSON.stringify(formData.input_schema, null, 2)},
  "output_schema": ${JSON.stringify(formData.output_schema, null, 2)}
}`}</pre>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">提示</h4>
                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                      <li>参数名称应简洁明了，使用英文命名</li>
                      <li>建议使用原子业务语义作为参数定义基础</li>
                      <li>复杂数据结构使用 object 或 array 类型</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 代码实现 */}
          {currentStep === 3 && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={formData.files.scriptLang}
                    onChange={(e) => {
                      const lang = e.target.value as 'python' | 'javascript';
                      setFormData(prev => ({
                        ...prev,
                        files: {
                          ...prev.files,
                          scriptLang: lang,
                          script: codeTemplates[lang]
                        }
                      }));
                    }}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                  </select>

                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Code size={16} />
                    <span>主处理函数代码</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500">配置文件 (JSON):</span>
                  <input
                    type="text"
                    value={formData.files.config}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      files: { ...prev.files, config: e.target.value }
                    }))}
                    placeholder='{"key": "value"}'
                    className="px-3 py-1 border border-slate-300 rounded text-sm w-64"
                  />
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">脚本代码</label>
                  <textarea
                    value={formData.files.script}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      files: { ...prev.files, script: e.target.value }
                    }))}
                    className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm bg-slate-900 text-green-400 resize-none focus:ring-2 focus:ring-indigo-500"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">README 文档</label>
                  <textarea
                    value={formData.files.readme}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      files: { ...prev.files, readme: e.target.value }
                    }))}
                    placeholder="# 技能说明文档\n\n## 功能描述\n\n## 输入参数\n\n## 输出参数\n\n## 使用示例"
                    className="flex-1 w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-indigo-500"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: 性能配置 */}
          {currentStep === 4 && (
            <div className="max-w-3xl space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    <Zap size={16} className="inline mr-1" />
                    平均延迟 (ms)
                  </label>
                  <input
                    type="number"
                    value={formData.latency}
                    onChange={(e) => setFormData(prev => ({ ...prev, latency: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-2xl font-bold text-center"
                  />
                  <input
                    type="range"
                    min="10"
                    max="5000"
                    value={formData.latency}
                    onChange={(e) => setFormData(prev => ({ ...prev, latency: parseInt(e.target.value) }))}
                    className="w-full mt-4"
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    <Database size={16} className="inline mr-1" />
                    准确率 (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round(formData.accuracy_score * 100)}
                    onChange={(e) => setFormData(prev => ({ ...prev, accuracy_score: parseInt(e.target.value) / 100 }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-2xl font-bold text-center"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(formData.accuracy_score * 100)}
                    onChange={(e) => setFormData(prev => ({ ...prev, accuracy_score: parseInt(e.target.value) / 100 }))}
                    className="w-full mt-4"
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    <Cpu size={16} className="inline mr-1" />
                    成本系数 (0-1)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-2xl font-bold text-center"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.cost}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) }))}
                    className="w-full mt-4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  依赖技能
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.dependencies.map((dep, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded"
                    >
                      <GitBranch size={12} className="mr-1" />
                      {dep}
                      <button
                        onClick={() => removeDependency(dep)}
                        className="ml-1 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <select
                    value={dependencyInput}
                    onChange={(e) => setDependencyInput(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">选择依赖技能</option>
                    {MOCK_SKILLS.map(skill => (
                      <option key={skill.skill_id} value={skill.skill_id}>
                        {skill.name} ({skill.skill_id})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addDependency}
                    disabled={!dependencyInput}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* 预览 */}
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-medium text-slate-800 mb-4">技能信息预览</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">技能ID:</span>
                    <span className="ml-2 font-mono text-slate-700">{formData.skill_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">名称:</span>
                    <span className="ml-2 text-slate-700">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">版本:</span>
                    <span className="ml-2 text-slate-700">{formData.version}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">语言:</span>
                    <span className="ml-2 text-slate-700">{formData.files.scriptLang}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500">场景:</span>
                    <span className="ml-2 text-slate-700">
                      {formData.domain.map(id => allScenarios.find(s => s.id === id)?.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate('/skills')}
          className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
        >
          取消
        </button>

        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
            >
              上一步
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              下一步
              <ChevronRight size={18} className="ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Save size={18} className="mr-2" />
              提交注册
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillRegistration;
