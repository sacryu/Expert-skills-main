import React, { useState } from 'react';
import {
  Car, Truck, Battery, Factory, Package, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock, DollarSign, Users, Zap,
  Box, TruckIcon, Warehouse, Wrench, BarChart3, ArrowRight,
  ChevronDown, ChevronUp, Building2, Globe, ShieldCheck, AlertTriangle,
  Thermometer, Droplets, Scale, Gauge, Calendar, FileText,
  UserCheck, PhoneCall, Mail, MapPin, History, Activity
} from 'lucide-react';

// ==================== 数据类型定义 ====================

type ProductLine = 'passenger' | 'commercial' | 'energy';
type ViewMode = 'overview' | 'capacity' | 'inventory' | 'material' | 'supplier' | 'quality' | 'finance';

// 产能数据
interface CapacityData {
  totalLines: number;
  operatingLines: number;
  totalCapacity: number; // GWh/月
  actualOutput: number;
  utilizationRate: number;
  oee: number;
  uph: number; // 每小时产出
  planAchievement: number; // 计划达成率
  bottleneckProcess: string;
  shiftCount: number;
  staffingRate: number; // 人员配置率
  equipmentUptime: number; // 设备稼动率
  mttr: number; // 平均修复时间(小时)
  mtbf: number; // 平均故障间隔(小时)
}

// 库存数据
interface InventoryData {
  rawMaterial: {
    cathode: number; // 正极材料
    anode: number; // 负极材料
    electrolyte: number; // 电解液
    separator: number; // 隔膜
    other: number;
  };
  wip: {
    electrode: number; // 极片在制
    cell: number; // 电芯在制
    aging: number; // 静置中
  };
  finishedGoods: number;
  totalValue: number; // 万元
  turnoverDays: number;
  safetyStockDays: number;
  slowMovingInventory: number; // 呆滞库存
  obsoleteRisk: number; // 呆滞风险金额
}

// 物料数据
interface MaterialData {
  totalSKUs: number;
  criticalMaterials: number; // 关键物料数
  shortageRisk: number; // 短缺风险物料
  excessStock: number; // 超储物料
  leadTimeAvg: number; // 平均交期(天)
  leadTimeTrend: number[];
  priceTrend: {
    lithiumCarbonate: number; // 碳酸锂价格 万元/吨
    cobalt: number; // 钴价格
    nickel: number; // 镍价格
  };
  consumptionRate: number; // 物料消耗速率
  forecastAccuracy: number; // 需求预测准确率
}

// 供应商数据
interface SupplierData {
  totalSuppliers: number;
  strategicSuppliers: number; // 战略供应商
  qualifiedSuppliers: number; // 合格供应商
  performanceMetrics: {
    otd: number; // 准时交付率
    ppm: number; // 百万件不良率
    qualityScore: number; // 质量评分
    costCompetitiveness: number; // 成本竞争力
    technicalCapability: number; // 技术能力
    responseSpeed: number; // 响应速度
  };
  riskSuppliers: number; // 高风险供应商数
  singleSourceMaterials: number; // 单一来源物料数
  localizationRate: number; // 国产化率
  importDependency: number; // 进口依赖度
}

// 质量数据
interface QualityData {
  firstPassYield: number; // 一次合格率
  finalYield: number; // 最终良品率
  defectRate: number; // 不良率
  customerComplaints: number; // 客户投诉数
  returnRate: number; // 退货率
  dppm: number; // 百万件缺陷数
  majorIssues: number; // 重大质量问题数
  capaOpen: number; // 开放纠正措施数
  inspectionPending: number; // 待检批次
}

// 财务数据
interface FinancialData {
  revenue: number; // 营收(万元)
  grossProfit: number; // 毛利
  grossMargin: number; // 毛利率
  unitCost: number; // 单位成本(元/Wh)
  costBreakdown: {
    material: number; // 材料成本占比
    labor: number; // 人工成本占比
    overhead: number; // 制造费用占比
  };
  wipValue: number; // 在制品价值
  inventoryCost: number; // 库存资金占用
  accountsReceivable: number; // 应收账款
  accountsPayable: number; // 应付账款
  cashConversion: number; // 现金周转天数
}

// 市场数据
interface MarketData {
  orderBacklog: number; // 在手订单(GWh)
  newOrders: number; // 本月新签订单
  orderFulfillment: number; // 订单交付率
  customerCount: number; // 活跃客户数
  topCustomers: string[]; // 主要客户
  marketShare: number; // 市场份额
  competitorPrice: number; // 竞争对手价格
}

// 产品线完整数据
interface ProductLineData {
  name: string;
  icon: React.ReactNode;
  color: string;
  capacity: CapacityData;
  inventory: InventoryData;
  material: MaterialData;
  supplier: SupplierData;
  quality: QualityData;
  finance: FinancialData;
  market: MarketData;
  alerts: AlertItem[];
}

interface AlertItem {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
}

// ==================== 示例数据 ====================

const PRODUCT_DATA: Record<ProductLine, ProductLineData> = {
  passenger: {
    name: '乘用车',
    icon: <Car size={24} />,
    color: 'blue',
    capacity: {
      totalLines: 8,
      operatingLines: 7,
      totalCapacity: 12.5,
      actualOutput: 10.8,
      utilizationRate: 86.4,
      oee: 84.2,
      uph: 450,
      planAchievement: 92.5,
      bottleneckProcess: '化成分容',
      shiftCount: 3,
      staffingRate: 94.5,
      equipmentUptime: 96.8,
      mttr: 2.5,
      mtbf: 168
    },
    inventory: {
      rawMaterial: { cathode: 850, anode: 620, electrolyte: 180, separator: 420, other: 150 },
      wip: { electrode: 320, cell: 580, aging: 890 },
      finishedGoods: 1250,
      totalValue: 48500,
      turnoverDays: 18.5,
      safetyStockDays: 7,
      slowMovingInventory: 2300,
      obsoleteRisk: 850
    },
    material: {
      totalSKUs: 156,
      criticalMaterials: 28,
      shortageRisk: 5,
      excessStock: 12,
      leadTimeAvg: 14,
      leadTimeTrend: [15, 14, 16, 14, 13],
      priceTrend: { lithiumCarbonate: 8.5, cobalt: 22.3, nickel: 12.8 },
      consumptionRate: 85.6,
      forecastAccuracy: 88.2
    },
    supplier: {
      totalSuppliers: 45,
      strategicSuppliers: 8,
      qualifiedSuppliers: 38,
      performanceMetrics: {
        otd: 94.5,
        ppm: 45,
        qualityScore: 92.5,
        costCompetitiveness: 88.0,
        technicalCapability: 90.5,
        responseSpeed: 87.0
      },
      riskSuppliers: 3,
      singleSourceMaterials: 6,
      localizationRate: 78.5,
      importDependency: 21.5
    },
    quality: {
      firstPassYield: 96.8,
      finalYield: 98.9,
      defectRate: 1.1,
      customerComplaints: 3,
      returnRate: 0.08,
      dppm: 850,
      majorIssues: 0,
      capaOpen: 5,
      inspectionPending: 12
    },
    finance: {
      revenue: 125800,
      grossProfit: 28900,
      grossMargin: 23.0,
      unitCost: 0.42,
      costBreakdown: { material: 72.5, labor: 8.5, overhead: 19.0 },
      wipValue: 28600,
      inventoryCost: 48500,
      accountsReceivable: 45600,
      accountsPayable: 32400,
      cashConversion: 45
    },
    market: {
      orderBacklog: 18.5,
      newOrders: 3.2,
      orderFulfillment: 92.5,
      customerCount: 28,
      topCustomers: ['比亚迪', '特斯拉', '蔚来', '小鹏', '理想'],
      marketShare: 28.5,
      competitorPrice: 0.48
    },
    alerts: [
      { id: 'a1', level: 'critical', title: 'NCM811供应紧张', description: '宁德时代需求激增，正极材料供应可能不足', timestamp: '2026-02-28 10:30' },
      { id: 'a2', level: 'warning', title: '化成柜利用率过高', description: '当前利用率98%，存在产能瓶颈风险', timestamp: '2026-02-28 09:15' },
      { id: 'a3', level: 'info', title: '新客户订单增长', description: '本月新增3家造车新势力客户', timestamp: '2026-02-27 16:00' }
    ]
  },
  commercial: {
    name: '商用车',
    icon: <Truck size={24} />,
    color: 'amber',
    capacity: {
      totalLines: 4,
      operatingLines: 3,
      totalCapacity: 4.8,
      actualOutput: 3.6,
      utilizationRate: 75.0,
      oee: 78.5,
      uph: 280,
      planAchievement: 88.0,
      bottleneckProcess: '模组组装',
      shiftCount: 2,
      staffingRate: 89.0,
      equipmentUptime: 94.5,
      mttr: 3.2,
      mtbf: 142
    },
    inventory: {
      rawMaterial: { cathode: 380, anode: 290, electrolyte: 85, separator: 195, other: 65 },
      wip: { electrode: 145, cell: 260, aging: 380 },
      finishedGoods: 520,
      totalValue: 22500,
      turnoverDays: 24.0,
      safetyStockDays: 10,
      slowMovingInventory: 1850,
      obsoleteRisk: 620
    },
    material: {
      totalSKUs: 98,
      criticalMaterials: 18,
      shortageRisk: 3,
      excessStock: 8,
      leadTimeAvg: 21,
      leadTimeTrend: [22, 23, 21, 20, 19],
      priceTrend: { lithiumCarbonate: 8.5, cobalt: 22.3, nickel: 12.8 },
      consumptionRate: 72.5,
      forecastAccuracy: 82.0
    },
    supplier: {
      totalSuppliers: 32,
      strategicSuppliers: 6,
      qualifiedSuppliers: 28,
      performanceMetrics: {
        otd: 91.0,
        ppm: 65,
        qualityScore: 89.0,
        costCompetitiveness: 85.5,
        technicalCapability: 87.0,
        responseSpeed: 84.0
      },
      riskSuppliers: 5,
      singleSourceMaterials: 4,
      localizationRate: 85.0,
      importDependency: 15.0
    },
    quality: {
      firstPassYield: 94.5,
      finalYield: 97.8,
      defectRate: 2.2,
      customerComplaints: 5,
      returnRate: 0.15,
      dppm: 1200,
      majorIssues: 1,
      capaOpen: 8,
      inspectionPending: 18
    },
    finance: {
      revenue: 48600,
      grossProfit: 8750,
      grossMargin: 18.0,
      unitCost: 0.58,
      costBreakdown: { material: 75.0, labor: 9.5, overhead: 15.5 },
      wipValue: 12800,
      inventoryCost: 22500,
      accountsReceivable: 28500,
      accountsPayable: 19600,
      cashConversion: 52
    },
    market: {
      orderBacklog: 6.8,
      newOrders: 1.1,
      orderFulfillment: 88.0,
      customerCount: 15,
      topCustomers: ['宇通客车', '比亚迪商用车', '金龙客车', '中通客车'],
      marketShare: 18.2,
      competitorPrice: 0.62
    },
    alerts: [
      { id: 'b1', level: 'warning', title: 'LFP需求量下滑', description: '商用车市场需求放缓，建议调整排产计划', timestamp: '2026-02-28 11:00' },
      { id: 'b2', level: 'warning', title: '模组产线设备老化', description: '建议进行预防性维护，避免非计划停机', timestamp: '2026-02-27 14:30' }
    ]
  },
  energy: {
    name: '储能',
    icon: <Battery size={24} />,
    color: 'green',
    capacity: {
      totalLines: 6,
      operatingLines: 6,
      totalCapacity: 18.0,
      actualOutput: 16.2,
      utilizationRate: 90.0,
      oee: 88.5,
      uph: 380,
      planAchievement: 105.0,
      bottleneckProcess: '静置检测',
      shiftCount: 3,
      staffingRate: 96.8,
      equipmentUptime: 97.5,
      mttr: 2.0,
      mtbf: 192
    },
    inventory: {
      rawMaterial: { cathode: 1200, anode: 920, electrolyte: 280, separator: 650, other: 220 },
      wip: { electrode: 480, cell: 890, aging: 1450 },
      finishedGoods: 2100,
      totalValue: 68500,
      turnoverDays: 22.5,
      safetyStockDays: 14,
      slowMovingInventory: 3200,
      obsoleteRisk: 1250
    },
    material: {
      totalSKUs: 124,
      criticalMaterials: 22,
      shortageRisk: 2,
      excessStock: 18,
      leadTimeAvg: 28,
      leadTimeTrend: [30, 29, 28, 27, 26],
      priceTrend: { lithiumCarbonate: 8.5, cobalt: 22.3, nickel: 12.8 },
      consumptionRate: 92.0,
      forecastAccuracy: 85.5
    },
    supplier: {
      totalSuppliers: 38,
      strategicSuppliers: 7,
      qualifiedSuppliers: 34,
      performanceMetrics: {
        otd: 96.5,
        ppm: 35,
        qualityScore: 94.0,
        costCompetitiveness: 90.0,
        technicalCapability: 92.0,
        responseSpeed: 91.5
      },
      riskSuppliers: 2,
      singleSourceMaterials: 8,
      localizationRate: 82.0,
      importDependency: 18.0
    },
    quality: {
      firstPassYield: 97.5,
      finalYield: 99.2,
      defectRate: 0.8,
      customerComplaints: 2,
      returnRate: 0.05,
      dppm: 650,
      majorIssues: 0,
      capaOpen: 3,
      inspectionPending: 8
    },
    finance: {
      revenue: 168000,
      grossProfit: 40320,
      grossMargin: 24.0,
      unitCost: 0.38,
      costBreakdown: { material: 70.0, labor: 7.5, overhead: 22.5 },
      wipValue: 42500,
      inventoryCost: 68500,
      accountsReceivable: 52800,
      accountsPayable: 41200,
      cashConversion: 48
    },
    market: {
      orderBacklog: 25.8,
      newOrders: 5.6,
      orderFulfillment: 105.0,
      customerCount: 22,
      topCustomers: ['宁德时代储能', '阳光电源', '比亚迪储能', '科华数据', '南都电源'],
      marketShare: 35.8,
      competitorPrice: 0.42
    },
    alerts: [
      { id: 'c1', level: 'info', title: '储能订单超额完成', description: '本月产能利用率105%，建议考虑扩产', timestamp: '2026-02-28 08:00' },
      { id: 'c2', level: 'warning', title: 'LFP材料价格波动', description: '磷酸铁锂价格近两周上涨5%，需关注成本', timestamp: '2026-02-27 10:00' }
    ]
  }
};

// ==================== 子组件 ====================

// 产品选择标签
const ProductTab: React.FC<{
  product: ProductLine;
  data: ProductLineData;
  isActive: boolean;
  onClick: () => void;
}> = ({ product, data, isActive, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    green: 'bg-green-50 text-green-600 border-green-200'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all ${
        isActive
          ? colorClasses[data.color as keyof typeof colorClasses]
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
      }`}
    >
      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/50' : 'bg-slate-100'}`}>
        {data.icon}
      </div>
      <div className="text-left">
        <div className="font-semibold">{data.name}</div>
        <div className="text-xs opacity-75">{data.market.orderBacklog}GWh 在手订单</div>
      </div>
    </button>
  );
};

// 指标卡片
const MetricCard: React.FC<{
  title: string;
  value: string;
  unit?: string;
  trend?: number;
  icon: React.ReactNode;
  color?: string;
  subValue?: string;
}> = ({ title, value, unit, trend, icon, color = 'blue', subValue }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <span className="text-sm text-slate-500">{title}</span>
      <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
        {icon}
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      {unit && <span className="text-sm text-slate-500">{unit}</span>}
    </div>
    {trend !== undefined && (
      <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{trend > 0 ? '+' : ''}{trend}%</span>
      </div>
    )}
    {subValue && <div className="text-xs text-slate-400 mt-2">{subValue}</div>}
  </div>
);

// 产能视图
const CapacityView: React.FC<{ data: CapacityData }> = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="产线运行" value={`${data.operatingLines}/${data.totalLines}`} icon={<Factory size={18} />} color="cyan" />
      <MetricCard title="产能利用率" value={data.utilizationRate.toString()} unit="%" icon={<Gauge size={18} />} color="blue" trend={2.5} />
      <MetricCard title="OEE" value={data.oee.toString()} unit="%" icon={<Activity size={18} />} color="green" />
      <MetricCard title="计划达成" value={data.planAchievement.toString()} unit="%" icon={<TargetIcon size={18} />} color="amber" trend={-1.2} />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="实际产出" value={data.actualOutput.toString()} unit="GWh" icon={<Zap size={18} />} color="purple" />
      <MetricCard title="UPH" value={data.uph.toString()} unit="件" icon={<Clock size={18} />} color="indigo" />
      <MetricCard title="人员配置率" value={data.staffingRate.toString()} unit="%" icon={<Users size={18} />} color="pink" />
      <MetricCard title="设备稼动率" value={data.equipmentUptime.toString()} unit="%" icon={<Wrench size={18} />} color="teal" />
    </div>
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
        <AlertTriangle size={18} />
        瓶颈工序: {data.bottleneckProcess}
      </div>
      <div className="text-sm text-amber-700">
        当前该工序负荷率 98%，建议优化排产或考虑扩产
      </div>
    </div>
  </div>
);

// 库存视图
const InventoryView: React.FC<{ data: InventoryData }> = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="原材料" value={Object.values(data.rawMaterial).reduce((a, b) => a + b, 0).toString()} unit="吨" icon={<Box size={18} />} color="blue" />
      <MetricCard title="在制品" value={Object.values(data.wip).reduce((a, b) => a + b, 0).toString()} unit="万支" icon={<Factory size={18} />} color="amber" />
      <MetricCard title="成品库存" value={data.finishedGoods.toString()} unit="万支" icon={<Package size={18} />} color="green" />
      <MetricCard title="库存周转" value={data.turnoverDays.toString()} unit="天" icon={<TrendingUp size={18} />} color="purple" trend={-1.5} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-800 mb-3">原材料明细</h4>
        <div className="space-y-2">
          {Object.entries(data.rawMaterial).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                {key === 'cathode' ? '正极材料' : key === 'anode' ? '负极材料' : key === 'electrolyte' ? '电解液' : key === 'separator' ? '隔膜' : '其他'}
              </span>
              <span className="font-medium">{value} 吨</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-800 mb-3">在制品明细</h4>
        <div className="space-y-2">
          {Object.entries(data.wip).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-slate-600">
                {key === 'electrode' ? '极片在制' : key === 'cell' ? '电芯在制' : '静置中'}
              </span>
              <span className="font-medium">{value} 万支</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-medium">呆滞库存: {data.slowMovingInventory} 万元</div>
        <div className="text-sm text-red-600 mt-1">呆滞风险: {data.obsoleteRisk} 万元</div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-blue-800 font-medium">库存资金占用</div>
        <div className="text-2xl font-bold text-blue-900 mt-1">{data.totalValue.toLocaleString()} 万元</div>
      </div>
    </div>
  </div>
);

// 物料视图
const MaterialView: React.FC<{ data: MaterialData }> = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="物料SKU" value={data.totalSKUs.toString()} icon={<Box size={18} />} color="blue" />
      <MetricCard title="关键物料" value={data.criticalMaterials.toString()} icon={<ShieldCheck size={18} />} color="amber" />
      <MetricCard title="短缺风险" value={data.shortageRisk.toString()} unit="项" icon={<AlertCircle size={18} />} color="red" />
      <MetricCard title="预测准确率" value={data.forecastAccuracy.toString()} unit="%" icon={<BarChart3 size={18} />} color="green" />
    </div>
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-semibold text-slate-800 mb-4">原材料价格走势 (万元/吨)</h4>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-sm text-slate-500">碳酸锂</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{data.priceTrend.lithiumCarbonate}</div>
          <div className="text-xs text-red-600 mt-1">↑ 5.2%</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-sm text-slate-500">钴</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{data.priceTrend.cobalt}</div>
          <div className="text-xs text-green-600 mt-1">↓ 2.1%</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-lg">
          <div className="text-sm text-slate-500">镍</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{data.priceTrend.nickel}</div>
          <div className="text-xs text-slate-500 mt-1">- 0.0%</div>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-semibold text-slate-800 mb-3">采购交期趋势 (天)</h4>
      <div className="flex items-end gap-1 h-20">
        {data.leadTimeTrend.map((val, idx) => (
          <div key={idx} className="flex-1 bg-indigo-100 rounded-t" style={{ height: `${(val / 35) * 100}%` }}>
            <div className="text-center text-xs text-slate-600 mt-1">{val}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 供应商视图
const SupplierView: React.FC<{ data: SupplierData }> = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="供应商总数" value={data.totalSuppliers.toString()} icon={<Building2 size={18} />} color="blue" />
      <MetricCard title="战略供应商" value={data.strategicSuppliers.toString()} icon={<Globe size={18} />} color="purple" />
      <MetricCard title="高风险供应" value={data.riskSuppliers.toString()} unit="家" icon={<AlertTriangle size={18} />} color="red" />
      <MetricCard title="国产化率" value={data.localizationRate.toString()} unit="%" icon={<ShieldCheck size={18} />} color="green" />
    </div>
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-semibold text-slate-800 mb-4">供应商绩效指标</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(data.performanceMetrics).map(([key, value]) => (
          <div key={key} className="p-3 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-500">
              {key === 'otd' ? '准时交付率' : key === 'ppm' ? 'PPM不良率' : key === 'qualityScore' ? '质量评分' :
               key === 'costCompetitiveness' ? '成本竞争力' : key === 'technicalCapability' ? '技术能力' : '响应速度'}
            </div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {value}{key === 'otd' || key === 'qualityScore' || key === 'costCompetitiveness' || key === 'technicalCapability' || key === 'responseSpeed' ? '%' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="text-amber-800 font-medium">单一来源物料: {data.singleSourceMaterials} 项</div>
        <div className="text-sm text-amber-600 mt-1">建议开发第二供应商降低风险</div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-blue-800 font-medium">进口依赖度: {data.importDependency}%</div>
        <div className="text-sm text-blue-600 mt-1">持续推进国产化替代</div>
      </div>
    </div>
  </div>
);

// 质量视图
const QualityView: React.FC<{ data: QualityData }> = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="一次合格率" value={data.firstPassYield.toString()} unit="%" icon={<CheckCircle size={18} />} color="green" />
      <MetricCard title="最终良品率" value={data.finalYield.toString()} unit="%" icon={<ShieldCheck size={18} />} color="blue" />
      <MetricCard title="客户投诉" value={data.customerComplaints.toString()} unit="起" icon={<AlertCircle size={18} />} color="red" trend={-25} />
      <MetricCard title="DPPM" value={data.dppm.toString()} icon={<BarChart3 size={18} />} color="amber" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-800 mb-3">质量指标明细</h4>
        <div className="space-y-2">
          <div className="flex justify-between"><span className="text-slate-600">不良率</span><span className="font-medium">{data.defectRate}%</span></div>
          <div className="flex justify-between"><span className="text-slate-600">退货率</span><span className="font-medium">{data.returnRate}%</span></div>
          <div className="flex justify-between"><span className="text-slate-600">重大质量问题</span><span className={`font-medium ${data.majorIssues > 0 ? 'text-red-600' : ''}`}>{data.majorIssues} 起</span></div>
          <div className="flex justify-between"><span className="text-slate-600">开放CAPA</span><span className="font-medium">{data.capaOpen} 项</span></div>
          <div className="flex justify-between"><span className="text-slate-600">待检批次</span><span className="font-medium">{data.inspectionPending} 批</span></div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
          <CheckCircle size={18} />
          质量状态良好
        </div>
        <div className="text-sm text-green-700">
          本月无重大质量事故，客户满意度 96.5%，继续保持质量管控力度
        </div>
      </div>
    </div>
  </div>
);

// 财务视图
const FinanceView: React.FC<{ data: FinancialData }> = ({ data }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="营业收入" value={(data.revenue / 10000).toFixed(1)} unit="亿" icon={<DollarSign size={18} />} color="green" trend={12.5} />
      <MetricCard title="毛利率" value={data.grossMargin.toString()} unit="%" icon={<TrendingUp size={18} />} color="blue" trend={-0.5} />
      <MetricCard title="单位成本" value={data.unitCost.toString()} unit="元/Wh" icon={<Scale size={18} />} color="amber" />
      <MetricCard title="现金周转" value={data.cashConversion.toString()} unit="天" icon={<Clock size={18} />} color="purple" trend={-3} />
    </div>
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-semibold text-slate-800 mb-3">成本结构</h4>
      <div className="flex h-8 rounded-lg overflow-hidden">
        <div className="bg-blue-500" style={{ width: `${data.costBreakdown.material}%` }} />
        <div className="bg-green-500" style={{ width: `${data.costBreakdown.labor}%` }} />
        <div className="bg-amber-500" style={{ width: `${data.costBreakdown.overhead}%` }} />
      </div>
      <div className="flex gap-4 mt-2 text-sm">
        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded" />材料 {data.costBreakdown.material}%</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded" />人工 {data.costBreakdown.labor}%</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded" />制造费用 {data.costBreakdown.overhead}%</span>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-600">应收账款</div>
        <div className="text-xl font-bold text-blue-900">{(data.accountsReceivable / 10000).toFixed(1)} 亿</div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-sm text-green-600">应付账款</div>
        <div className="text-xl font-bold text-green-900">{(data.accountsPayable / 10000).toFixed(1)} 亿</div>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="text-sm text-purple-600">库存资金</div>
        <div className="text-xl font-bold text-purple-900">{(data.inventoryCost / 10000).toFixed(1)} 亿</div>
      </div>
    </div>
  </div>
);

// 告警卡片
const AlertCard: React.FC<{ alert: AlertItem }> = ({ alert }) => {
  const colors = {
    critical: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  return (
    <div className={`p-3 rounded-lg border ${colors[alert.level]}`}>
      <div className="flex items-start gap-2">
        {alert.level === 'critical' ? <AlertCircle size={16} className="mt-0.5" /> :
         alert.level === 'warning' ? <AlertTriangle size={16} className="mt-0.5" /> :
         <CheckCircle size={16} className="mt-0.5" />}
        <div>
          <div className="font-medium text-sm">{alert.title}</div>
          <div className="text-xs opacity-75 mt-0.5">{alert.description}</div>
          <div className="text-xs opacity-50 mt-1">{alert.timestamp}</div>
        </div>
      </div>
    </div>
  );
};

// 导航标签
const ViewTab: React.FC<{
  view: ViewMode;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    {icon}
    {label}
  </button>
);

// 主组件
const ProductOperationsBoard: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<ProductLine>('passenger');
  const [activeView, setActiveView] = useState<ViewMode>('overview');

  const data = PRODUCT_DATA[activeProduct];

  const renderView = () => {
    switch (activeView) {
      case 'capacity': return <CapacityView data={data.capacity} />;
      case 'inventory': return <InventoryView data={data.inventory} />;
      case 'material': return <MaterialView data={data.material} />;
      case 'supplier': return <SupplierView data={data.supplier} />;
      case 'quality': return <QualityView data={data.quality} />;
      case 'finance': return <FinanceView data={data.finance} />;
      default: return (
        <div className="space-y-4">
          <CapacityView data={data.capacity} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InventoryView data={data.inventory} />
            <FinanceView data={data.finance} />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">产品经营看板</h2>
          <p className="text-sm text-slate-500 mt-1">乘用车 / 商用车 / 储能 三大产品线经营数据</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar size={16} />
          <span>数据更新: 2026-02-28 14:30</span>
        </div>
      </div>

      {/* 产品线选择 */}
      <div className="grid grid-cols-3 gap-4">
        {(Object.keys(PRODUCT_DATA) as ProductLine[]).map(product => (
          <ProductTab
            key={product}
            product={product}
            data={PRODUCT_DATA[product]}
            isActive={activeProduct === product}
            onClick={() => setActiveProduct(product)}
          />
        ))}
      </div>

      {/* 告警信息 */}
      {data.alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.alerts.map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* 视图导航 */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg border border-slate-200">
        <ViewTab view="overview" label="总览" icon={<BarChart3 size={16} />} isActive={activeView === 'overview'} onClick={() => setActiveView('overview')} />
        <ViewTab view="capacity" label="产能" icon={<Factory size={16} />} isActive={activeView === 'capacity'} onClick={() => setActiveView('capacity')} />
        <ViewTab view="inventory" label="库存" icon={<Package size={16} />} isActive={activeView === 'inventory'} onClick={() => setActiveView('inventory')} />
        <ViewTab view="material" label="物料" icon={<Box size={16} />} isActive={activeView === 'material'} onClick={() => setActiveView('material')} />
        <ViewTab view="supplier" label="供应商" icon={<Building2 size={16} />} isActive={activeView === 'supplier'} onClick={() => setActiveView('supplier')} />
        <ViewTab view="quality" label="质量" icon={<ShieldCheck size={16} />} isActive={activeView === 'quality'} onClick={() => setActiveView('quality')} />
        <ViewTab view="finance" label="财务" icon={<DollarSign size={16} />} isActive={activeView === 'finance'} onClick={() => setActiveView('finance')} />
      </div>

      {/* 内容区域 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {renderView()}
      </div>

      {/* 市场数据概览 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold mb-4">市场概况 - {data.name}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-indigo-100 text-sm">在手订单</div>
            <div className="text-2xl font-bold">{data.market.orderBacklog} GWh</div>
          </div>
          <div>
            <div className="text-indigo-100 text-sm">本月新签</div>
            <div className="text-2xl font-bold">{data.market.newOrders} GWh</div>
          </div>
          <div>
            <div className="text-indigo-100 text-sm">市场份额</div>
            <div className="text-2xl font-bold">{data.market.marketShare}%</div>
          </div>
          <div>
            <div className="text-indigo-100 text-sm">主要客户</div>
            <div className="text-sm mt-1">{data.market.topCustomers.slice(0, 3).join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 辅助图标组件
const TargetIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export default ProductOperationsBoard;
