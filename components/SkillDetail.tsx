import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SKILLS, SCENARIOS } from '../constants';
import { ArrowLeft, FileText, Settings, Code, Copy, Check, Network } from 'lucide-react';

const SkillDetail: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const skill = MOCK_SKILLS.find(s => s.skill_id === skillId);
  const [activeTab, setActiveTab] = useState<'readme' | 'config' | 'script'>('readme');
  const [copied, setCopied] = useState(false);

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <h2 className="text-xl font-bold mb-2">未找到技能</h2>
        <button onClick={() => navigate('/skills')} className="text-indigo-600 hover:underline">
          返回注册中心
        </button>
      </div>
    );
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case 'readme': return skill.files.readme;
      case 'config': return skill.files.config;
      case 'script': return skill.files.script;
      default: return '';
    }
  };
  
  const domainName = SCENARIOS.find(s => s.id === skill.domain[0])?.name || skill.domain[0];

  return (
    <div className="flex flex-col h-full space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-4">
            <button 
            onClick={() => navigate('/skills')}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
            >
            <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
            <h1 className="text-2xl font-bold text-slate-800">{skill.name}</h1>
            <div className="flex items-center text-sm text-slate-500 space-x-3">
                <span className="font-mono bg-slate-100 px-1.5 rounded">{skill.skill_id}</span>
                <span>v{skill.version}</span>
                <span className="bg-indigo-50 text-indigo-700 px-2 rounded-full text-xs font-medium border border-indigo-100">{domainName}</span>
            </div>
            </div>
        </div>
        <button 
            onClick={() => navigate(`/ontology?scenario=${skill.domain[0]}`)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium shadow-sm"
        >
            <Network size={16} />
            <span>查看语义图谱</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {/* File Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('readme')}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-r border-slate-200 ${
              activeTab === 'readme' ? 'bg-white text-indigo-600 border-t-2 border-t-indigo-600' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <FileText size={16} />
            <span>SKILL.md</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-r border-slate-200 ${
              activeTab === 'config' ? 'bg-white text-indigo-600 border-t-2 border-t-indigo-600' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Settings size={16} />
            <span>config.json</span>
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-r border-slate-200 ${
              activeTab === 'script' ? 'bg-white text-indigo-600 border-t-2 border-t-indigo-600' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Code size={16} />
            <span>Script ({skill.files.scriptLang})</span>
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 relative bg-slate-900 overflow-auto">
          <button
            onClick={() => handleCopy(getActiveContent())}
            className="absolute top-4 right-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 p-2 rounded transition-colors z-10"
            title="Copy content"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          <pre className="p-6 text-sm font-mono text-slate-300 leading-relaxed min-h-full">
            <code>{getActiveContent()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;