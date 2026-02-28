import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Box, Zap, CircleDot, Settings, Cloud, ShieldAlert, Wrench, Activity, Gauge, Beaker, Clock, DollarSign, Package, CheckCircle, Layers, ArrowRight } from 'lucide-react';
import { ATOMIC_ONTOLOGY_LIBRARY, ATOMIC_CATEGORIES } from '../constants';
import { AtomicOntology } from '../types';

// 图标映射
const iconMap: Record<string, React.ElementType> = {
  Gauge, Beaker, Clock, DollarSign, Package, CheckCircle, Activity,
  Zap, CircleDot, Settings, Cloud, ShieldAlert, Wrench, Box
};

const AtomicOntologyModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAtom, setSelectedAtom] = useState<AtomicOntology | null>(null);

  // 接收来自关联性分析的跳转
  useEffect(() => {
    if (location.state?.selectedAtom) {
      const atom = ATOMIC_ONTOLOGY_LIBRARY.find(a => a.id === location.state.selectedAtom);
      if (atom) {
        setSelectedAtom(atom);
        setSelectedCategory(atom.category);
      }
    }
  }, [location.state]);

  // 过滤原子业务语义
  const filteredAtoms = ATOMIC_ONTOLOGY_LIBRARY.filter(atom => {
    const matchesCategory = selectedCategory === 'all' || atom.category === selectedCategory;
    const matchesSearch =
      atom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atom.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atom.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 统计各分类数量
  const categoryStats = ATOMIC_CATEGORIES.map(cat => ({
    ...cat,
    count: ATOMIC_ONTOLOGY_LIBRARY.filter(atom => atom.category === cat.value).length
  }));

  const getCategoryLabel = (categoryValue: string) => {
    return ATOMIC_CATEGORIES.find(c => c.value === categoryValue)?.label || categoryValue;
  };

  const getCategoryColor = (categoryValue: string) => {
    return ATOMIC_CATEGORIES.find(c => c.value === categoryValue)?.color || '#64748b';
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">原子业务语义库</h2>
          <p className="text-slate-500 text-sm mt-1">
            大型锂电制造行业统一语义标准，共 {ATOMIC_ONTOLOGY_LIBRARY.length} 个原子业务语义
          </p>
        </div>

        {/* 场景原子业务语义入口 */}
        <button
          onClick={() => navigate('/atoms/scenario')}
          className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <Layers size={20} />
          <div className="text-left">
            <div className="font-semibold text-sm">场景原子业务语义</div>
            <div className="text-xs text-indigo-100">查看图谱场景构建所需核心原子业务语义</div>
          </div>
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>

      {/* 分类统计卡片 */}
      <div className="grid grid-cols-7 gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`p-3 rounded-lg border transition-all text-left ${
            selectedCategory === 'all'
              ? 'bg-indigo-50 border-indigo-300 shadow-sm'
              : 'bg-white border-slate-200 hover:border-indigo-300'
          }`}
        >
          <div className="text-xs text-slate-500 mb-1">全部</div>
          <div className="text-xl font-bold text-slate-800">{ATOMIC_ONTOLOGY_LIBRARY.length}</div>
          <div className="text-xs text-slate-400">个业务语义</div>
        </button>
        {categoryStats.map(cat => {
          const Icon = iconMap[cat.icon] || Box;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`p-3 rounded-lg border transition-all text-left ${
                selectedCategory === cat.value
                  ? 'ring-2 ring-offset-1'
                  : 'hover:border-slate-300'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.value ? cat.color + '15' : 'white',
                borderColor: selectedCategory === cat.value ? cat.color : '#e2e8f0'
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon size={16} style={{ color: cat.color }} />
                <span className="text-xs text-slate-400">{cat.count}</span>
              </div>
              <div className="text-xs font-medium text-slate-700 truncate">{cat.label}</div>
            </button>
          );
        })}
      </div>

      {/* 搜索栏 */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="搜索原子业务语义名称、描述或标签..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
          <Filter size={20} />
          <span>筛选</span>
        </button>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* 左侧列表 */}
        <div className="w-2/3 bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <span className="font-medium text-slate-700">
              {selectedCategory === 'all' ? '全部原子业务语义' : getCategoryLabel(selectedCategory)}
            </span>
            <span className="text-sm text-slate-500">共 {filteredAtoms.length} 个</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-2 gap-2">
              {filteredAtoms.map(atom => {
                const catColor = getCategoryColor(atom.category);
                return (
                  <button
                    key={atom.id}
                    onClick={() => setSelectedAtom(atom)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedAtom?.id === atom.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: catColor }}
                        />
                        <span className="font-medium text-slate-800">{atom.name}</span>
                      </div>
                      {atom.unit && (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {atom.unit}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{atom.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {atom.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            {filteredAtoms.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <Box size={48} className="mx-auto mb-3 opacity-30" />
                <p>未找到匹配的原子业务语义</p>
              </div>
            )}
          </div>
        </div>

        {/* 右侧详情 */}
        <div className="w-1/3 bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
          {selectedAtom ? (
            <>
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(selectedAtom.category) }}
                  />
                  <h3 className="font-semibold text-slate-800">{selectedAtom.name}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">ID: {selectedAtom.id}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500">分类</label>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: getCategoryColor(selectedAtom.category) + '20',
                        color: getCategoryColor(selectedAtom.category)
                      }}
                    >
                      {getCategoryLabel(selectedAtom.category)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500">描述</label>
                  <p className="mt-1 text-sm text-slate-700">{selectedAtom.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500">数据类型</label>
                    <p className="mt-1 text-sm text-slate-700">{selectedAtom.dataType}</p>
                  </div>
                  {selectedAtom.unit && (
                    <div>
                      <label className="text-xs font-medium text-slate-500">单位</label>
                      <p className="mt-1 text-sm text-slate-700">{selectedAtom.unit}</p>
                    </div>
                  )}
                </div>

                {selectedAtom.constraints && (
                  <div>
                    <label className="text-xs font-medium text-slate-500">约束条件</label>
                    <div className="mt-1 text-sm text-slate-700 space-y-1">
                      {selectedAtom.constraints.min !== undefined && (
                        <p>最小值: {selectedAtom.constraints.min}</p>
                      )}
                      {selectedAtom.constraints.max !== undefined && (
                        <p>最大值: {selectedAtom.constraints.max}</p>
                      )}
                      {selectedAtom.constraints.enum && (
                        <p>枚举值: {selectedAtom.constraints.enum.join(', ')}</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-500">标签</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedAtom.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <label className="text-xs font-medium text-slate-500">应用场景</label>
                  <p className="mt-1 text-sm text-slate-600">
                    该原子业务语义可在技能注册中心和业务流程图谱编辑器中被引用，
                    用于定义技能输入输出参数和业务场景中的关键指标。
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <Box size={48} className="mx-auto mb-3 opacity-30" />
                <p>点击左侧原子业务语义查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AtomicOntologyModule;
