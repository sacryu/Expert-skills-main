import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Target, AlertCircle, Package, Factory, Truck, DollarSign, Calendar, ChevronRight, X, FileText, User, Clock, ArrowRight } from 'lucide-react';

// 指标定义
interface Metric {
  id: string;
  name: string;
  category: 'sales' | 'production' | 'inventory' | 'logistics' | 'finance';
  target: number;
  actual: number;
  unit: string;
  deviation: number;
  deviationType: 'positive' | 'negative' | 'neutral';
  trend: number[];
}

// 历史事件
interface HistoricalEvent {
  id: string;
  metricId: string;
  title: string;
  description: string;
  impact: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  responsible: string;
  status: 'resolved' | 'pending' | 'in_progress';
  actions: string[];
}

// 产销场景指标数据
const METRICS: Metric[] = [
  {
    id: 'order_fulfillment_rate',
    name: '订单履约率',
    category: 'sales',
    target: 95,
    actual: 92.5,
    unit: '%',
    deviation: -2.5,
    deviationType: 'negative',
    trend: [94, 93.5, 94.2, 93.8, 92.5]
  },
  {
    id: 'production_oee',
    name: '生产OEE',
    category: 'production',
    target: 85,
    actual: 87.3,
    unit: '%',
    deviation: 2.3,
    deviationType: 'positive',
    trend: [84, 85.5, 86.2, 86.8, 87.3]
  },
  {
    id: 'inventory_turnover',
    name: '库存周转天数',
    category: 'inventory',
    target: 15,
    actual: 18.5,
    unit: '天',
    deviation: 3.5,
    deviationType: 'negative',
    trend: [16, 16.5, 17.2, 17.8, 18.5]
  },
  {
    id: 'delivery_on_time',
    name: '准时交付率',
    category: 'logistics',
    target: 98,
    actual: 96.2,
    unit: '%',
    deviation: -1.8,
    deviationType: 'negative',
    trend: [97.5, 97.2, 96.8, 96.5, 96.2]
  },
  {
    id: 'gross_margin',
    name: '毛利率',
    category: 'finance',
    target: 25,
    actual: 23.8,
    unit: '%',
    deviation: -1.2,
    deviationType: 'negative',
    trend: [24.5, 24.3, 24.1, 24.0, 23.8]
  },
  {
    id: 'capacity_utilization',
    name: '产能利用率',
    category: 'production',
    target: 90,
    actual: 88.5,
    unit: '%',
    deviation: -1.5,
    deviationType: 'negative',
    trend: [89, 89.2, 88.8, 88.6, 88.5]
  }
];

// 历史事件数据
const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'evt_001',
    metricId: 'order_fulfillment_rate',
    title: '宁德时代大订单交期延误',
    description: '由于化成柜设备故障，导致宁德时代500MWh订单交付延误3天',
    impact: '订单履约率下降3.2%，客户满意度降低，面临违约金风险',
    date: '2026-02-25',
    severity: 'high',
    responsible: '张生产主管',
    status: 'resolved',
    actions: ['紧急调配备用化成柜', '协调售后团队24小时抢修', '与客户协商延期交付']
  },
  {
    id: 'evt_002',
    metricId: 'order_fulfillment_rate',
    title: '正极材料供应延迟',
    description: 'LFP正极材料供应商交付延迟，影响储能产线开工',
    impact: '两条储能产线停工待料12小时，产能损失约200MWh',
    date: '2026-02-22',
    severity: 'medium',
    responsible: '李采购经理',
    status: 'resolved',
    actions: ['启用备用供应商', '调整生产计划优先保障动力订单', '增加安全库存至7天']
  },
  {
    id: 'evt_003',
    metricId: 'inventory_turnover',
    title: '动力电芯库存积压',
    description: '某型号动力电芯市场需求下滑，库存周转天数超过30天',
    impact: '库存资金占用增加1500万，仓储成本上升',
    date: '2026-02-20',
    severity: 'medium',
    responsible: '王计划员',
    status: 'in_progress',
    actions: ['启动促销清仓计划', '与海外客户协商转售', '调整下月排产计划']
  },
  {
    id: 'evt_004',
    metricId: 'production_oee',
    title: '涂布线设备升级改造',
    description: '涂布线A进行自动化升级改造，提升设备稳定性',
    impact: 'OEE从82%提升至87.3%，涂布厚度一致性显著改善',
    date: '2026-02-15',
    severity: 'low',
    responsible: '刘设备工程师',
    status: 'resolved',
    actions: ['完成PLC控制系统升级', '新增在线厚度检测', '培训操作人员']
  },
  {
    id: 'evt_005',
    metricId: 'delivery_on_time',
    title: '物流承运商延误',
    description: '春节期间物流运力紧张，第三方承运商未能按时提货',
    impact: '导致5批次货物延误交付，准时交付率下降至96.2%',
    date: '2026-02-10',
    severity: 'medium',
    responsible: '赵物流专员',
    status: 'resolved',
    actions: ['启用备用物流商', '增加自有车队运力', '提前与客户沟通调整交期']
  },
  {
    id: 'evt_006',
    metricId: 'gross_margin',
    title: '锂盐价格上涨',
    description: '碳酸锂市场价格持续上涨，原材料成本增加',
    impact: '单吨电芯成本上升8%，毛利率下降1.2个百分点',
    date: '2026-02-18',
    severity: 'high',
    responsible: '陈财务经理',
    status: 'pending',
    actions: ['启动与客户的调价谈判', '优化BOM结构降低锂耗', '增加长单锁价比例']
  },
  {
    id: 'evt_007',
    metricId: 'capacity_utilization',
    title: '动力订单需求下滑',
    description: '某动力大客户临时削减Q1订单量20%',
    impact: '产能利用率从92%下降至88.5%，闲置产能增加',
    date: '2026-02-12',
    severity: 'high',
    responsible: '孙销售总监',
    status: 'in_progress',
    actions: ['积极开拓新客户填补产能', '增加储能产线切换', '与客户协商订单延期而非取消']
  },
  {
    id: 'evt_008',
    metricId: 'order_fulfillment_rate',
    title: '质量异常批量返工',
    description: '某批次储能电芯容量测试异常，需返工处理',
    impact: '影响120MWh订单交付，履约率下降2%',
    date: '2026-02-08',
    severity: 'high',
    responsible: '周质量经理',
    status: 'resolved',
    actions: ['追溯异常根源为电解液批次问题', '更换电解液供应商', '加强来料检验']
  }
];

const categoryIcons: Record<string, React.ReactNode> = {
  sales: <TrendingUp size={20} />,
  production: <Factory size={20} />,
  inventory: <Package size={20} />,
  logistics: <Truck size={20} />,
  finance: <DollarSign size={20} />
};

const categoryColors: Record<string, string> = {
  sales: 'blue',
  production: 'cyan',
  inventory: 'amber',
  logistics: 'purple',
  finance: 'green'
};

const severityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200'
};

const statusColors = {
  resolved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700'
};

// 指标卡片组件
const MetricCard: React.FC<{
  metric: Metric;
  isSelected: boolean;
  onClick: () => void;
  eventCount: number;
}> = ({ metric, isSelected, onClick, eventCount }) => {
  const color = categoryColors[metric.category];
  const isPositiveDeviation = metric.deviationType === 'positive' && metric.deviation > 0;
  const isNegative = metric.deviation < 0;

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? `border-${color}-500 bg-${color}-50`
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
          {categoryIcons[metric.category]}
        </div>
        {eventCount > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <AlertCircle size={12} />
            {eventCount} 个事件
          </span>
        )}
      </div>

      <h4 className="text-sm font-medium text-slate-600 mb-1">{metric.name}</h4>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-slate-900">
          {metric.actual}{metric.unit}
        </span>
        <span className="text-xs text-slate-400">目标: {metric.target}{metric.unit}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className={`flex items-center text-xs font-medium ${
          isNegative ? 'text-red-600' : 'text-green-600'
        }`}>
          {isNegative ? <TrendingDown size={14} className="mr-0.5" /> : <TrendingUp size={14} className="mr-0.5" />}
          {metric.deviation > 0 ? '+' : ''}{metric.deviation}{metric.unit}
        </span>
        <span className="text-xs text-slate-400">
          ({((metric.actual / metric.target - 1) * 100).toFixed(1)}%)
        </span>
      </div>

      {/* 迷你趋势图 */}
      <div className="mt-3 flex items-end gap-0.5 h-8">
        {metric.trend.map((value, idx) => {
          const height = (value / Math.max(...metric.trend)) * 100;
          return (
            <div
              key={idx}
              className={`flex-1 rounded-t ${isNegative ? 'bg-red-200' : 'bg-green-200'}`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

// 事件详情弹窗
const EventDetailModal: React.FC<{
  event: HistoricalEvent;
  onClose: () => void;
}> = ({ event, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColors[event.severity]}`}>
                {event.severity === 'high' ? '高' : event.severity === 'medium' ? '中' : '低'}优先级
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                {event.status === 'resolved' ? '已解决' : event.status === 'pending' ? '待处理' : '进行中'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{event.title}</h2>
            <p className="text-sm text-slate-500 mt-1">{event.date}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 事件描述 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FileText size={16} />
              事件描述
            </h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{event.description}</p>
          </div>

          {/* 影响分析 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <AlertCircle size={16} />
              影响分析
            </h3>
            <p className="text-sm text-slate-600 bg-red-50 p-3 rounded-lg border border-red-100">{event.impact}</p>
          </div>

          {/* 责任人 */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <User size={16} />
                责任人
              </h3>
              <p className="text-sm text-slate-600">{event.responsible}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Clock size={16} />
                发生时间
              </h3>
              <p className="text-sm text-slate-600">{event.date}</p>
            </div>
          </div>

          {/* 处理措施 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Target size={16} />
              处理措施
            </h3>
            <ul className="space-y-2">
              {event.actions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-medium">
                    {idx + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// 主组件
const ProductionSalesMetricsBoard: React.FC = () => {
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);

  const selectedMetric = METRICS.find(m => m.id === selectedMetricId);
  const filteredEvents = selectedMetricId
    ? HISTORICAL_EVENTS.filter(e => e.metricId === selectedMetricId)
    : HISTORICAL_EVENTS;

  // 按指标分组统计事件
  const getEventCountByMetric = (metricId: string) => {
    return HISTORICAL_EVENTS.filter(e => e.metricId === metricId).length;
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">产销协同指标看板</h2>
          <p className="text-sm text-slate-500 mt-1">实时监控关键指标达成情况，追踪历史事件影响</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={16} />
          <span>数据更新: 2026-02-28 14:30</span>
        </div>
      </div>

      {/* 指标卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {METRICS.map(metric => (
          <MetricCard
            key={metric.id}
            metric={metric}
            isSelected={selectedMetricId === metric.id}
            onClick={() => setSelectedMetricId(selectedMetricId === metric.id ? null : metric.id)}
            eventCount={getEventCountByMetric(metric.id)}
          />
        ))}
      </div>

      {/* 历史事件列表 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-indigo-600" />
            <h3 className="font-semibold text-slate-900">
              历史事件列表
              {selectedMetric && <span className="text-slate-500 font-normal"> - {selectedMetric.name}</span>}
            </h3>
          </div>
          {selectedMetricId && (
            <button
              onClick={() => setSelectedMetricId(null)}
              className="text-xs text-slate-500 hover:text-indigo-600 transition-colors"
            >
              查看全部
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              暂无相关历史事件
            </div>
          ) : (
            filteredEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColors[event.severity]}`}>
                        {event.severity === 'high' ? '高' : event.severity === 'medium' ? '中' : '低'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[event.status]}`}>
                        {event.status === 'resolved' ? '已解决' : event.status === 'pending' ? '待处理' : '进行中'}
                      </span>
                      <span className="text-xs text-slate-400">{event.date}</span>
                    </div>
                    <h4 className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                    <p className="text-sm text-red-600 mt-2">
                      <span className="font-medium">影响:</span> {event.impact}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 mt-1" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 事件详情弹窗 */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default ProductionSalesMetricsBoard;
