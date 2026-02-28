import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SKILLS, getAllScenarios } from '../constants';
import { Skill } from '../types';
import { Search, Filter, Cpu, Code, Database, Zap, Network, Plus } from 'lucide-react';

const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  const navigate = useNavigate();

  // Find readable domain name from all scenarios (including dynamic ones)
  const allScenarios = getAllScenarios();
  const domainName = allScenarios.find(s => s.id === skill.domain[0])?.name || skill.domain[0];

  return (
    <div 
      className="bg-white rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow group flex flex-col h-full"
    >
      <div 
        onClick={() => navigate(`/skills/${skill.skill_id}`)}
        className="cursor-pointer flex-1"
      >
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Cpu size={20} />
            </div>
            <div>
                <h4 className="font-semibold text-slate-800">{skill.name}</h4>
                <div className="text-xs text-slate-400 font-mono">{skill.skill_id}</div>
            </div>
            </div>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">v{skill.version}</span>
        </div>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{skill.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                {domainName}
            </span>
            {skill.capability_tags.map(tag => (
            <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                #{tag}
            </span>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs border-t border-slate-100 pt-3 mb-3">
        <div className="flex items-center space-x-1 text-slate-500">
          <Zap size={12} />
          <span>{skill.latency}ms</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500">
          <Database size={12} />
          <span>{(skill.accuracy_score * 100).toFixed(0)}% acc</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-500">
          <Code size={12} />
          <span>Cost: {skill.cost}</span>
        </div>
      </div>

      <button 
        onClick={(e) => {
            e.stopPropagation();
            navigate(`/ontology?scenario=${skill.domain[0]}`);
        }}
        className="w-full mt-auto py-2 flex items-center justify-center text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
      >
          <Network size={14} className="mr-2" />
          查看业务图谱关联
      </button>
    </div>
  );
};

const SkillsRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredSkills = MOCK_SKILLS.filter(skill => 
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    skill.skill_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.capability_tags.some(tag => tag.includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">技能注册中心</h2>
          <p className="text-slate-500 mt-1">管理和监控已注册的锂电池制造能力。</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/skills/new')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center"
          >
            <Plus size={18} className="mr-1" />
            注册新技能
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="按名称、ID 或能力标签搜索..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
          <Filter size={18} />
          <span>筛选</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSkills.map(skill => (
          <SkillCard key={skill.skill_id} skill={skill} />
        ))}
        {filteredSkills.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400">
                未找到匹配的技能。
            </div>
        )}
      </div>
    </div>
  );
};

export default SkillsRegistry;