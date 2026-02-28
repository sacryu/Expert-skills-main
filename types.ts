// Domain Entities

// ==================== 业务语义创建系统 ====================

/**
 * 业务语义节点类型
 */
export type BusinessSemanticNodeType = 'dataEntity' | 'behavior' | 'businessRule' | 'businessProcess';

/**
 * 业务语义节点
 */
export interface BusinessSemanticNode {
  id: string;
  name: string;
  description: string;
  type: BusinessSemanticNodeType;
  scenarioId: string;
  // 节点特定属性
  attributes?: Record<string, any>;
  // 节点关联
  connections: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 业务语义场景
 */
export interface BusinessSemanticScenario {
  id: string;
  name: string;
  description: string;
  industry: string;
  // 场景包含的节点
  nodes: BusinessSemanticNode[];
  // 场景状态
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * 数据实体
 */
export interface DataEntity extends BusinessSemanticNode {
  type: 'dataEntity';
  fields: DataField[];
  source?: string;
  updateFrequency?: string;
}

/**
 * 数据字段
 */
export interface DataField {
  name: string;
  dataType: string;
  required: boolean;
  description?: string;
}

/**
 * 行为操作
 */
export interface BehaviorAction extends BusinessSemanticNode {
  type: 'behavior';
  operationType: 'create' | 'read' | 'update' | 'delete' | 'execute';
  inputParams: DataField[];
  outputParams: DataField[];
}

/**
 * 业务规则
 */
export interface BusinessRule extends BusinessSemanticNode {
  type: 'businessRule';
  ruleType: 'validation' | 'constraint' | 'calculation' | 'decision';
  condition: string;
  action: string;
  priority: number;
}

/**
 * 业务流程
 */
export interface BusinessProcess extends BusinessSemanticNode {
  type: 'businessProcess';
  steps: ProcessStep[];
  trigger?: string;
  result?: string;
}

/**
 * 流程步骤
 */
export interface ProcessStep {
  id: string;
  name: string;
  description?: string;
  order: number;
  responsibleRole?: string;
  nodeId?: string;
}

// ==================== 原子化业务语义系统 ====================

/**
 * 原子业务语义 - 不可再分的业务因子
 * 作为企业的统一语义标准
 */
export interface AtomicOntology {
  id: string;
  name: string;
  description: string;
  category: AtomicCategory;
  dataType: AtomicDataType;
  unit?: string;
  constraints?: AtomicConstraint;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type AtomicCategory =
  // 通用分类
  | 'physical'      // 物理量：温度、压力、振动等
  | 'chemical'      // 化学量：纯度、PH值、成分等
  | 'temporal'      // 时间量：周期、频率、持续时间等
  | 'financial'     // 财务量：成本、价格、利润率等
  | 'logistical'    // 物流量：库存、周转率、配送时间等
  | 'quality'       // 质量量：合格率、缺陷率、精度等
  | 'operational'   // 运营量：产能、OEE、利用率等
  // 锂电制造专用分类
  | 'electrical'    // 电性能：电压、电流、电阻、容量等
  | 'material'      // 材料特性：粒径、比表面积、振实密度等
  | 'process'       // 工艺参数：涂布速度、辊压压力等
  | 'environmental' // 环境参数：露点温度、洁净度等
  | 'safety'        // 安全参数：温升、气体浓度等
  | 'equipment'     // 设备参数：主轴转速、张力等
  | 'product';      // 产品规格：尺寸、重量、能量密度等

export type AtomicDataType = 'number' | 'string' | 'boolean' | 'array' | 'object' | 'datetime';

export interface AtomicConstraint {
  min?: number;
  max?: number;
  enum?: string[];
  pattern?: string;
  required?: boolean;
}

/**
 * 分子业务语义 - 由原子业务语义组合而成的业务实体
 * L2: 子系统 (Subsystem)
 * L3: 工艺过程 (Process)
 * L4: 参数定义 (Parameter Definition)
 */
export interface MolecularOntology {
  id: string;
  name: string;
  description: string;
  level: 2 | 3 | 4;  // L2=子系统, L3=工艺, L4=参数
  parentId?: string; // 父节点ID
  atomRefs: AtomReference[]; // 引用的原子业务语义
  children: string[]; // 子节点ID列表
  createdAt: string;
  updatedAt: string;
}

export interface AtomReference {
  atomId: string;
  role: string;      // 原子在业务语义中的角色/用途
  required: boolean; // 是否必填
  defaultValue?: any;
  mappingRules?: MappingRule[];
}

export interface MappingRule {
  condition: string;
  action: string;
  description: string;
}

/**
 * 业务场景 - 完整的场景定义
 */
export interface BusinessScenario {
  id: string;
  name: string;
  description: string;
  industry: string;
  domain: string;
  molecularStructure: MolecularOntology[]; // L2+L3+L4结构
  status: 'draft' | 'published' | 'archived';
  version: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// ==================== 技能注册中心集成 ====================

export interface Skill {
  skill_id: string;
  name: string;
  version: string;
  domain: string[]; // Maps to Scenario IDs
  capability_tags: string[];
  input_schema: Record<string, string>;
  output_schema: Record<string, string>;
  cost: number; // 0.0 - 1.0
  latency: number; // ms
  accuracy_score: number; // 0.0 - 1.0
  dependencies: string[];
  description: string;
  files: {
    readme: string;
    config: string;
    script: string;
    scriptLang: string;
  };
  // 新增：场景绑定
  scenarioBindings?: ScenarioBinding[];
}

export interface ScenarioBinding {
  scenarioId: string;
  inputMappings: ParameterMapping[];
  outputMappings: ParameterMapping[];
}

export interface ParameterMapping {
  skillParam: string;
  scenarioParam: string; // 指向L4参数
  atomId?: string;       // 指向原子业务语义
  transform?: string;    // 可选的转换函数
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  isDynamic?: boolean; // 是否为动态创建的场景
  sourceScenarioId?: string; // 如果是从动态场景生成的
}

// 节点关联关系（上级/下级节点及其状态）
export interface RelatedNode {
  id: string;
  label: string;
  dataSubmitted: boolean; // 是否按时提交数据
  instructionCompleted: boolean; // 是否完成指令
}

export interface OntologyNode {
  id: string;
  label: string;
  type: 'concept' | 'skill';
  group?: number; // 1=Scenario, 2=Sub-system, 3=Process, 4=Parameter, 5=Skill
  data_readiness?: number; // 0-100 Data Quality/Availability Score
  // 节点详细信息
  owner?: string; // 负责人
  responsibility?: string; // 职责描述
  upstreamNodes?: RelatedNode[]; // 上一级节点（带状态）
  downstreamNodes?: RelatedNode[]; // 下一级节点（带状态）
  upstreamNodeIds?: string[]; // 上游节点ID列表（兼容旧数据）
  downstreamNodeIds?: string[]; // 下游节点ID列表（兼容旧数据）
  dataSource?: string; // 数据源：导入、CRM系统、BOM系统、MES系统等
  dataFormat?: string; // 数据格式：JSON、XML、CSV等
  updateFrequency?: string; // 更新频率要求
  pendingTasks?: PendingTask[]; // 待执行任务
}

export interface PendingTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignee?: string;
}

export interface OntologyLink {
  source: string;
  target: string;
  relation: string;
}

export interface OntologyData {
  nodes: OntologyNode[];
  links: OntologyLink[];
}

export interface ParsedTask {
  original_text: string;
  intents: string[];
  entities: string[];
  extracted_params: Record<string, any>;
}

export interface SkillScore {
  skill_id: string;
  total_score: number;
  breakdown: {
    intent_match: number;
    historical_accuracy: number;
    latency_score: number;
    cost_score: number;
  };
}

export interface RouterPlan {
  taskId: string;
  steps: {
    step_id: number;
    skill: Skill;
    score: number;
    // Detailed Execution Trace Fields
    reasoning_trace: string[];
    input_data: Record<string, any>;
    simulated_output: Record<string, any>;
  }[];
  total_confidence: number;
  estimated_latency: number;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  task_text: string;
  status: 'success' | 'failed' | 'running';
  skills_used: string[];
  duration: number;
  result_summary: string;
}

// ==================== 业务流程图谱关联性分析业务语义和技能 ====================

/**
 * 业务语义定义（用于产销场景）
 */
export interface BusinessSemanticDef {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'production' | 'inventory' | 'quality' | 'finance' | 'logistics' | 'customer' | 'planning';
  atoms: string[]; // 关联的业务释义ID
  skills: string[]; // 关联的技能ID
  processNodes: string[]; // 关联的业务流程节点ID
}

/**
 * 业务流程节点映射
 */
export interface ProcessNodeMapping {
  nodeId: string;
  nodeName: string;
  semantics: string[]; // 关联的业务语义ID
  skills: string[]; // 关联的技能ID
  atoms: string[]; // 所需业务释义
}

/**
 * 依赖关系图节点
 */
export interface DependencyNode {
  id: string;
  type: 'process' | 'semantic' | 'skill' | 'atom';
  name: string;
}

/**
 * 依赖关系图连线
 */
export interface DependencyLink {
  source: string;
  target: string;
  type: string;
}