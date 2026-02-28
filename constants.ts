import { Skill, OntologyData, ExecutionLog, Scenario, OntologyNode, OntologyLink, AtomicOntology, BusinessScenario, MolecularOntology, SimulationNodeConfig } from './types';

export const SCENARIOS: Scenario[] = [
  { id: 'raw_material', name: '1. 原材料管理', description: '正负极材料、隔膜、电解液的入库质检与追溯' },
  { id: 'mixing', name: '2. 搅拌/制浆', description: '匀浆工艺参数控制、粘度预测与浆料输送' },
  { id: 'coating', name: '3. 涂布工艺', description: '极片涂布厚度闭环控制、面密度检测' },
  { id: 'calendaring', name: '4. 辊压工艺', description: '极片压实密度控制、延展率监测' },
  { id: 'slitting', name: '5. 分切工艺', description: '极片分切宽度精度、毛刺检测' },
  { id: 'winding', name: '6. 卷绕/叠片', description: '极片对齐度、张力控制与Overhang检测' },
  { id: 'assembly', name: '7. 组装焊接', description: '超声波/激光焊接质量监测、Hi-Pot测试' },
  { id: 'baking_injection', name: '8. 烘烤与注液', description: '水分含量预测、注液量精度控制' },
  { id: 'formation', name: '9. 化成分容', description: 'SEI膜形成监测、容量预测与电芯分级' },
  { id: 'pack', name: '10. 模组/Pack', description: 'BMS测试、热管理分析与Busbar焊接检测' },
  { id: 'production_planning', name: '11. 产销生产计划', description: 'S&OP协同、产能平衡与主生产计划制定' },
  { id: 'predictive_maintenance', name: '12. 设备预测性维护', description: '设备健康度监测、RUL预测与异常预警' },
  { id: 'breakdown_maintenance', name: '13. 设备故障维修', description: '维修工时预测、备件物流与专家调度' },
  { id: 'cost_management', name: '14. 经营成本管理', description: '单吨成本分析、能耗审计与库存周转优化' },
  { id: 'production_sales_match', name: '15. 产销匹配协同', description: '需求预测、产能平衡、库存优化与订单履约协同' },
  { id: 'new_project_planning', name: '16. 新项目落地推演分析', description: '新产线投资决策分析、选址评估、财务测算与风险推演' },
  { id: 'capacity_assessment_prediction', name: '17. 产能评估推演预测分析', description: '现有产能评估、需求预测、产能缺口分析、投资决策推演与风险模拟' },
];

export const MOCK_SKILLS: Skill[] = [
  {
    skill_id: "material_purity_check_v2",
    name: "原料纯度AI检测",
    version: "2.1.0",
    domain: ["raw_material"],
    capability_tags: ["quality", "material", "spectroscopy"],
    input_schema: { batch_id: "string", spectrum_data: "array" },
    output_schema: { purity_score: "number", impurities: "array" },
    cost: 0.3,
    latency: 120,
    accuracy_score: 0.98,
    dependencies: [],
    description: "基于光谱数据的原材料杂质含量快速分析。",
    files: {
      readme: "# Material Purity AI Check\n\n分析拉曼光谱数据以检测正极材料中的磁性异物。",
      config: "{\"model\": \"purity_net_v2\", \"threshold\": 0.99}",
      script: "def handler(event):\n    return {\"purity_score\": 0.999, \"impurities\": []}",
      scriptLang: "python"
    }
  },
  {
    skill_id: "viscosity_prediction_v3",
    name: "浆料粘度预测",
    version: "3.0.1",
    domain: ["mixing"],
    capability_tags: ["viscosity", "mixing", "process_control"],
    input_schema: { solid_content: "number", temperature: "number", mixing_speed: "number" },
    output_schema: { predicted_viscosity: "number" },
    cost: 0.5,
    latency: 50,
    accuracy_score: 0.94,
    dependencies: [],
    description: "根据搅拌工艺参数实时预测浆料粘度趋势。",
    files: {
      readme: "# Viscosity Prediction\n\n基于搅拌转速、温度和固含量预测浆料粘度，减少停机取样次数。",
      config: "{\"model\": \"visc_lstm_v3\"}",
      script: "def predict_viscosity(params):\n    # Mock logic\n    return params['solid_content'] * 50 + params['temperature'] * -2",
      scriptLang: "python"
    }
  },
  {
    skill_id: "coating_thickness_loop_v1",
    name: "涂布厚度闭环控制",
    version: "1.5.0",
    domain: ["coating"],
    capability_tags: ["coating", "loop_control", "thickness"],
    input_schema: { beta_ray_reading: "array", current_gap: "number" },
    output_schema: { adjustment_microns: "number" },
    cost: 0.8,
    latency: 30,
    accuracy_score: 0.99,
    dependencies: [],
    description: "基于β射线测厚仪数据的模头间隙自动调节算法。",
    files: {
      readme: "# Coating Thickness Loop\n\n实时读取β射线扫描数据，计算横向厚度偏差，输出模头螺栓调整量。",
      config: "{\"target_thickness\": 150, \"control_period\": \"100ms\"}",
      script: "exports.control = (data) => {\n  const error = 150 - data.beta_ray_reading[0];\n  return { adjustment_microns: error * 0.8 };\n}",
      scriptLang: "javascript"
    }
  },
  {
    skill_id: "roller_pressure_opt_v2",
    name: "辊压压力自适应优化",
    version: "2.0.0",
    domain: ["calendaring"],
    capability_tags: ["calendaring", "pressure", "density"],
    input_schema: { target_density: "number", incoming_thickness: "number" },
    output_schema: { hydraulic_pressure: "number" },
    cost: 0.4,
    latency: 200,
    accuracy_score: 0.92,
    dependencies: [],
    description: "根据来料厚度波动调整辊压压力以保证压实密度一致性。",
    files: {
      readme: "# Roller Pressure Optimization\n\n维持极片压实密度恒定。",
      config: "{\"target_density\": 1.5}",
      script: "def optimize(target, current):\n    return target * 2000 # bar",
      scriptLang: "python"
    }
  },
  {
    skill_id: "tension_control_algo_v1",
    name: "卷绕张力波动抑制",
    version: "1.1.0",
    domain: ["winding"],
    capability_tags: ["winding", "motion_control"],
    input_schema: { real_time_tension: "array", speed: "number" },
    output_schema: { torque_compensation: "number" },
    cost: 0.2,
    latency: 10,
    accuracy_score: 0.95,
    dependencies: [],
    description: "高速卷绕过程中的动态张力补偿算法。",
    files: {
      readme: "# Tension Control\n\nPID + 前馈控制算法，用于消除卷针非圆效应引起的张力波动。",
      config: "{\"kp\": 0.5, \"ki\": 0.1}",
      script: "const pid = new PID(0.5, 0.1, 0);\nreturn pid.update(target - current);",
      scriptLang: "javascript"
    }
  },
  {
    skill_id: "electrolyte_soaking_pred_v1",
    name: "注液浸润效果预测",
    version: "1.0.0",
    domain: ["baking_injection"],
    capability_tags: ["injection", "process_prediction"],
    input_schema: { injection_amount: "number", vacuum_time: "number", cell_weight: "number" },
    output_schema: { soaking_score: "number" },
    cost: 0.4,
    latency: 600,
    accuracy_score: 0.89,
    dependencies: [],
    description: "预测电解液在电芯内部的浸润程度。",
    files: {
      readme: "# Soaking Prediction\n\n基于注液量和真空静置时间，预测电解液浸润质量。",
      config: "{}",
      script: "return injection_amount / cell_weight * 0.8",
      scriptLang: "javascript"
    }
  },
  {
    skill_id: "capacity_prediction_v5",
    name: "化成容量预测模型",
    version: "5.0.0",
    domain: ["formation"],
    capability_tags: ["formation", "grading", "prediction"],
    input_schema: { formation_curve: "array", ocv_drop: "number" },
    output_schema: { predicted_capacity: "number", grade: "string" },
    cost: 0.9,
    latency: 1000,
    accuracy_score: 0.96,
    dependencies: [],
    description: "基于化成阶段的电压电流曲线预测最终分容容量，缩短分容时间。",
    files: {
      readme: "# Capacity Prediction v5\n\n利用充电曲线特征（dV/dQ）预测电池容量。",
      config: "{\"feature_extraction\": \"standard\"}",
      script: "model.predict(curve_features)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "thermal_runaway_warning_v2",
    name: "Pack热失控预警",
    version: "2.1.0",
    domain: ["pack"],
    capability_tags: ["safety", "pack", "bms"],
    input_schema: { cell_temperatures: "array", cell_voltages: "array" },
    output_schema: { risk_level: "number", warning_msg: "string" },
    cost: 0.1,
    latency: 50,
    accuracy_score: 0.99,
    dependencies: [],
    description: "Pack下线测试中的热失控风险实时评估。",
    files: {
      readme: "# Thermal Runaway Warning\n\n监测电芯温升速率 (dT/dt) 和电压压差。",
      config: "{\"max_temp_diff\": 5.0}",
      script: "if max(temps) > 45: return {'risk': 'high'}",
      scriptLang: "python"
    }
  },
  {
    skill_id: "sop_balancer_v1",
    name: "产销平衡优化器 (S&OP)",
    version: "1.2.0",
    domain: ["production_planning"],
    capability_tags: ["planning", "optimization", "supply_chain"],
    input_schema: { sales_forecast: "array", capacity_constraints: "object", inventory_levels: "object" },
    output_schema: { production_plan: "array", shortage_risk: "array" },
    cost: 0.6,
    latency: 2000,
    accuracy_score: 0.93,
    dependencies: [],
    description: "针对锂电制造场景，综合化成段瓶颈、静置室库位及正极材料供应，生成最优排产计划。",
    files: {
      readme: "# S&OP Balancer (Lithium Battery Edition)\n\n## 概述\n锂电制造典型的TOC（瓶颈管理）场景优化器。针对后端化成（Formation）产能受限和中间品高温静置（Aging）周期长的特点，平衡前端极片制造速度与后端Pack交付需求。\n\n## 关键约束模型\n1. **化成柜OEE**: 限制电芯下线速度的硬约束。\n2. **静置室库位**: 限制WIP（在制品）积压上限。\n3. **正极材料供应**: LFP/NCM 昂贵主材的JIT到货匹配。\n\n## 业务价值\n* 消除化成段“堵柜”现象\n* 降低高价值正极材料库存资金占用\n* 确保 Pack 订单的齐套率",
      config: "{\"solver\": \"cbc\", \"time_horizon\": \"12 weeks\", \"constraints\": [\"formation_capacity\", \"aging_room_slots\"]}",
      script: "import pulp\n\ndef optimize_plan(forecast, constraints, inventory):\n    # 锂电专用规划模型\n    # 优先满足 Pack 交付，同时平滑化成柜负载\n    prob = pulp.LpProblem(\"Battery_SOP\", pulp.LpMaximize)\n    return {\n        \"production_plan\": [50000, 52000, 50000], # Cell count\n        \"formation_utilization\": 0.98\n    }",
      scriptLang: "python"
    }
  },
  {
    skill_id: "equipment_rul_pred_v2",
    name: "设备RUL预测",
    version: "2.1.5",
    domain: ["predictive_maintenance"],
    capability_tags: ["maintenance", "iot", "prediction"],
    input_schema: { vibration_spectrum: "array", oil_analysis: "object", run_hours: "number" },
    output_schema: { rul_days: "number", confidence: "number", failure_mode: "string" },
    cost: 0.4,
    latency: 150,
    accuracy_score: 0.91,
    dependencies: [],
    description: "利用振动和油液分析数据，预测关键设备（如涂布机辊轴）的剩余寿命。",
    files: {
      readme: "# Equipment RUL Prediction\n\n## 概述\nRemaining Useful Life (RUL) 预测模型。\n\n## 输入数据\n* **振动频谱**: 频域特征用于识别轴承磨损。\n* **油液分析**: 铁谱分析数据用于检测齿轮箱磨损。\n\n## 算法\n结合 CNN (提取频域特征) 和 LSTM (时序退化建模) 的混合网络。",
      config: "{\"model_path\": \"s3://models/rul_hybrid_v2.pt\", \"threshold_alert\": 7}",
      script: "def predict_rul(data):\n    # 模拟深度学习推理\n    health_index = calculate_hi(data)\n    rul = map_hi_to_rul(health_index)\n    return {\"rul_days\": 45, \"confidence\": 0.88}",
      scriptLang: "python"
    }
  },
  {
    skill_id: "repair_time_estimator_v1",
    name: "维修工时智能估算",
    version: "1.0.0",
    domain: ["breakdown_maintenance"],
    capability_tags: ["maintenance", "scheduling", "resource_allocation"],
    input_schema: { 
        failure_code: "string", 
        similar_work_orders: "array", 
        expert_availability: "object",
        spare_parts_status: "object" 
    },
    output_schema: { estimated_minutes: "number", recommended_expert: "string", parts_arrival_time: "number" },
    cost: 0.3,
    latency: 80,
    accuracy_score: 0.88,
    dependencies: [],
    description: "综合历史工单、专家排班及备件位置距离，精准预测故障恢复时间(MTTR)。",
    files: {
      readme: "# Repair Time Estimator\n\n## 概述\n当设备发生停机故障时，该技能用于快速估算预计修复时间 (Time-to-Repair)，辅助生产调度决策。\n\n## 核心逻辑\n1. **历史回溯**: 查询知识图谱中具有相同 `failure_code` 的历史工单，计算平均修复工时。\n2. **专家匹配**: 根据故障类型匹配技能矩阵，检查专家的当前工单状态及排班表。\n3. **备件物流**: \n   - 检查备件库存充足度。\n   - 计算从备件库（或供应商）到产线的物流距离和配送时间。\n\n## 场景示例\n涂布机模头堵塞，系统自动计算出清洗所需垫片库存充足，最近的熟练维修工在500米外的2号车间，预计总修复时间为 45 分钟。",
      config: "{\"search_radius\": \"factory_zone_a\", \"expert_skills_matrix\": \"db_ref_v1\", \"agv_speed\": \"1.5m/s\"}",
      script: "def estimate_repair(failure, resources):\n    # 1. 历史基准\n    base_time = get_historical_average(failure.code)\n    \n    # 2. 专家等待时间\n    expert = find_best_expert(resources.experts)\n    wait_time = expert.current_task_remaining if expert.busy else 0\n    \n    # 3. 备件配送时间\n    part_dist = get_distance(resources.parts.location, failure.location)\n    delivery_time = part_dist / 1.5 / 60 # minutes\n    \n    total_time = base_time + max(wait_time, delivery_time)\n    \n    return {\n        \"estimated_minutes\": round(total_time),\n        \"recommended_expert\": expert.name,\n        \"parts_arrival_time\": round(delivery_time)\n    }",
      scriptLang: "python"
    }
  },
  {
    skill_id: "cost_realtime_analyzer_v1",
    name: "单吨制造成本实时分析",
    version: "1.1.0",
    domain: ["cost_management"],
    capability_tags: ["management", "cost", "finance"],
    input_schema: { energy_consumption: "number", material_usage: "number", output_volume: "number" },
    output_schema: { cost_per_wh: "number", variance_reason: "string" },
    cost: 0.2,
    latency: 500,
    accuracy_score: 0.95,
    dependencies: [],
    description: "实时计算分段工序的能耗与物料成本，生成单瓦时(Wh)制造成本报表。",
    files: {
      readme: "# Cost Realtime Analyzer\n\n聚合SCADA能耗数据与MES投料数据，实时计算单吨成本。",
      config: "{\"currency\": \"CNY\", \"allocation_rule\": \"activity_based\"}",
      script: "def calculate_cost(energy, material, output):\n    return (energy * price + material) / output",
      scriptLang: "python"
    }
  },
  {
    skill_id: "inventory_turnover_opt_v2",
    name: "库存周转率优化建议",
    version: "2.0.1",
    domain: ["cost_management", "production_planning"],
    capability_tags: ["management", "inventory", "optimization"],
    input_schema: { current_stock: "object", sales_rate: "array" },
    output_schema: { recommended_stock_level: "object", dead_stock_alert: "array" },
    cost: 0.5,
    latency: 1200,
    accuracy_score: 0.91,
    dependencies: [],
    description: "分析呆滞物料风险，提供基于安全库存水位的采购与排产建议。",
    files: {
      readme: "# Inventory Optimizer\n\n识别库龄超标物料，并结合需求预测给出库存优化建议。",
      config: "{\"dead_stock_threshold_days\": 90}",
      script: "def optimize(stock, sales):\n    # EOQ Model logic\n    return recommendations",
      scriptLang: "python"
    }
  },
  {
    skill_id: "energy_consumption_audit_v1",
    name: "产线能耗异常审计",
    version: "1.0.0",
    domain: ["cost_management"],
    capability_tags: ["management", "energy", "audit"],
    input_schema: { meter_readings: "array", production_status: "string" },
    output_schema: { anomaly_score: "number", saving_potential: "string" },
    cost: 0.1,
    latency: 300,
    accuracy_score: 0.93,
    dependencies: [],
    description: "监控非生产时段的设备待机能耗，识别能源浪费点。",
    files: {
      readme: "# Energy Audit\n\n基于设备状态机监测能源浪费（如停机未断电）。",
      config: "{\"baseline_kwh\": 50}",
      script: "if status == 'idle' and power > 10: return 'anomaly'",
      scriptLang: "python"
    }
  },
  // ========== 产销匹配协同场景技能 ==========
  {
    skill_id: "demand_forecast_v3",
    name: "锂电需求智能预测",
    version: "3.2.0",
    domain: ["production_sales_match"],
    capability_tags: ["forecast", "sales", "ai_prediction"],
    input_schema: {
      historical_orders: "array",
      market_trends: "object",
      seasonality_factor: "number",
      customer_segments: "array"
    },
    output_schema: {
      predicted_demand: "array",
      confidence_interval: "object",
      trend_analysis: "string"
    },
    cost: 0.7,
    latency: 1500,
    accuracy_score: 0.92,
    dependencies: [],
    description: "基于历史订单、市场趋势和季节性因素，预测未来3-12个月的电芯需求（按产品型号、客户细分）。",
    files: {
      readme: "# Demand Forecast for Lithium Battery\n\n## 概述\n针对锂电行业特点构建的需求预测模型，考虑储能/动力不同市场的周期性波动。\n\n## 算法特性\n- **时序分解**: 分离趋势、季节、周期和随机成分\n- **客户细分**: 区分储能大项目（波动大）和动力电池（相对稳）\n- **外部变量**: 纳入锂价指数、新能源车销量等宏观指标\n\n## 输出\n提供点预测和置信区间，支持S&OP决策。",
      config: "{\"horizon_weeks\": 52, \"confidence_level\": 0.95, \"models\": [\"prophet\", \"lstm\"]}",
      script: "def forecast_demand(historical, market, seasonality, segments):\n    # Prophet + LSTM Ensemble\n    baseline = prophet_predict(historical, seasonality)\n    adjustment = lstm_market_adjustment(market)\n    return merge_predictions(baseline, adjustment)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "capacity_evaluation_v2",
    name: "多维度产能评估",
    version: "2.1.0",
    domain: ["production_sales_match"],
    capability_tags: ["capacity", "evaluation", "constraint_analysis"],
    input_schema: {
      equipment_status: "object",
      work_calendar: "object",
      product_mix: "array",
      bottleneck_processes: "array"
    },
    output_schema: {
      available_capacity: "object",
      utilization_forecast: "array",
      constraint_report: "object"
    },
    cost: 0.5,
    latency: 800,
    accuracy_score: 0.94,
    dependencies: [],
    description: "评估各工序（涂布、卷绕、化成等）的理论产能和可用产能，识别瓶颈工序。",
    files: {
      readme: "# Capacity Evaluation\n\n## 概述\n锂电制造产能评估器，针对多工序串联特性计算整体产出能力。\n\n## 评估维度\n1. **理论产能**: 设备铭牌参数计算\n2. **可用产能**: 扣除计划停机、保养\n3. **有效产能**: 考虑良品率和换型时间\n4. **瓶颈识别**: 找出限制整体产出的关键工序（通常是化成）\n\n## 应用场景\n- 接单评审：评估新订单交付可行性\n- 产能规划：支持扩产投资决策",
      config: "{\"oee_target\": 0.85, \"quality_rate\": 0.98}",
      script: "def evaluate_capacity(equipment, calendar, mix, bottlenecks):\n    for process in ['coating', 'winding', 'formation']:\n        theoretical = equipment[process].speed * calendar.hours\n        available = theoretical * equipment[process].oee\n    return find_bottleneck(process_capacities)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "smart_scheduling_v4",
    name: "智能排产引擎",
    version: "4.0.0",
    domain: ["production_sales_match"],
    capability_tags: ["scheduling", "optimization", "constraint_satisfaction"],
    input_schema: {
      demand_plan: "array",
      capacity_constraints: "object",
      material_availability: "object",
      priority_rules: "object"
    },
    output_schema: {
      production_schedule: "array",
      material_requirements: "array",
      bottleneck_warnings: "array"
    },
    cost: 0.8,
    latency: 3000,
    accuracy_score: 0.91,
    dependencies: ["demand_forecast_v3", "capacity_evaluation_v2"],
    description: "综合考虑需求、产能、物料齐套性，生成优化的主生产计划(MPS)和详细排程(APS)。",
    files: {
      readme: "# Smart Scheduling Engine\n\n## 概述\n锂电行业专用高级排程系统，解决前后工序产能不匹配、换型时间长等痛点。\n\n## 核心算法\n- **约束传播**: 处理物料齐套、设备互斥等硬约束\n- **启发式规则**: 最小化换型时间、均衡化生产\n- **优化目标**: 最大化交付率、最小化WIP库存\n\n## 特殊处理\n- **化成段排程**: 考虑化成柜充放电程序时长差异\n- **静置等待**: 自动计算高温静置时间窗口\n- **紧急插单**: 支持快速评估插单对整体计划的影响",
      config: "{\"solver\": \"ortools\", \"time_bucket\": \"hour\", \"lookahead_days\": 30}",
      script: "from ortools.constraint_solver import routing_enums_pb2\n\ndef optimize_schedule(demand, capacity, material, rules):\n    # 构建约束满足问题\n    model = create_cp_model(demand, capacity, material)\n    solver = cp_model.CpSolver()\n    return solver.Solve(model)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "inventory_optimization_v3",
    name: "全链路库存优化",
    version: "3.1.0",
    domain: ["production_sales_match"],
    capability_tags: ["inventory", "optimization", "working_capital"],
    input_schema: {
      current_inventory: "object",
      demand_forecast: "array",
      supply_leadtime: "object",
      cost_parameters: "object"
    },
    output_schema: {
      optimal_stock_levels: "object",
      reorder_points: "object",
      inventory_value_forecast: "array"
    },
    cost: 0.6,
    latency: 1200,
    accuracy_score: 0.89,
    dependencies: ["demand_forecast_v3"],
    description: "优化原材料（正极、负极、电解液）、在制品（WIP）和成品库存水平，平衡服务水平和资金占用。",
    files: {
      readme: "# Inventory Optimization\n\n## 概述\n锂电行业全链路库存优化，重点管理高价值正极材料（LFP/NCM）。\n\n## 优化策略\n1. **原材料**: 基于价格趋势和MOQ优化采购批量\n2. **WIP**: 控制极片、电芯在制品数量，减少资金占用\n3. **成品**: 按客户优先级配置安全库存\n\n## 核心算法\n- **(R,Q)策略**: 连续盘点补货\n- **动态安全库存**: 根据需求波动性自适应调整\n\n## 业务价值\n在确保98%订单满足率的前提下，降低库存资金占用15-20%。",
      config: "{\"service_level\": 0.98, \"holding_cost_rate\": 0.15}",
      script: "def optimize_inventory(current, demand, leadtime, costs):\n    for sku in ['LFP_powder', 'NCM523', 'electrolyte', 'separator']:\n        safety_stock = calculate_safety_stock(demand[sku], leadtime[sku])\n        eoq = calculate_eoq(demand[sku], costs.ordering, costs.holding)\n    return build_inventory_policy(safety_stock, eoq)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "supply_chain_collab_v2",
    name: "供应链协同平台",
    version: "2.3.0",
    domain: ["production_sales_match"],
    capability_tags: ["supply_chain", "collaboration", "supplier_management"],
    input_schema: {
      supplier_performance: "object",
      purchase_orders: "array",
      delivery_schedules: "object",
      quality_inspection: "object"
    },
    output_schema: {
      supplier_scorecards: "array",
      risk_alerts: "array",
      collaborative_forecast: "object"
    },
    cost: 0.4,
    latency: 600,
    accuracy_score: 0.93,
    dependencies: [],
    description: "管理与正极材料、电解液等关键供应商的协同，监控交付绩效，预警供应风险。",
    files: {
      readme: "# Supply Chain Collaboration\n\n## 概述\n锂电行业供应链协同平台，重点管理Tier1原材料供应商。\n\n## 功能模块\n1. **供应商绩效**: OTD（准时交付）、PPM（百万件不良率）自动计算\n2. **交付协同**: 共享预测、确认交期、预警偏差\n3. **质量协同**: 来料检验数据共享，推动供应商改进\n4. **VMI管理**: 供应商管理库存，自动触发补货\n\n## 关键指标\n- 正极材料OTD > 98%\n- 电解液PPM < 50\n- 预测准确率 > 85%",
      config: "{\"vmi_threshold_days\": 7, \"risk_alert_leadtime\": 3}",
      script: "def evaluate_suppliers(performance, orders, schedules, quality):\n    scorecards = {}\n    for supplier in ['catl_material', 'easpring', 'guotai']:\n        otd = calculate_otd(orders[supplier], schedules[supplier])\n        ppm = calculate_ppm(quality[supplier])\n        scorecards[supplier] = {'otd': otd, 'ppm': ppm, 'grade': grade_supplier(otd, ppm)}\n    return scorecards",
      scriptLang: "python"
    }
  },
  {
    skill_id: "order_fulfillment_tracking_v2",
    name: "订单全链路跟踪",
    version: "2.0.0",
    domain: ["production_sales_match"],
    capability_tags: ["order_management", "tracking", "visibility"],
    input_schema: {
      sales_orders: "array",
      production_status: "object",
      quality_inspection: "object",
      shipping_status: "object"
    },
    output_schema: {
      order_status_dashboard: "array",
      delivery_commitments: "array",
      delay_risk_alerts: "array"
    },
    cost: 0.3,
    latency: 400,
    accuracy_score: 0.96,
    dependencies: ["smart_scheduling_v4"],
    description: "实时跟踪订单从接单、排产、生产、质检到发货的全流程状态，预警交付风险。",
    files: {
      readme: "# Order Fulfillment Tracking\n\n## 概述\n锂电行业订单全链路可视化跟踪系统。\n\n## 跟踪节点\n1. **订单确认**: 评审交期可行性\n2. **物料齐套**: 追踪原材料到位状态\n3. **生产执行**: 各工序完工进度\n4. **质量放行**: 化成分容结果、出货检验\n5. **物流发运**: 车辆调度、在途跟踪\n\n## 预警机制\n- 黄色预警: 可能延迟1-3天\n- 红色预警: 可能延迟>3天\n自动触发产能调整或客户沟通流程",
      config: "{\"tracking_granularity\": \"process\", \"alert_threshold_days\": 3}",
      script: "def track_orders(orders, production, quality, shipping):\n    dashboard = []\n    for order in orders:\n        status = aggregate_status(order, production, quality, shipping)\n        risk = assess_delay_risk(order, status)\n        dashboard.append({'order_id': order.id, 'status': status, 'risk': risk})\n    return dashboard",
      scriptLang: "python"
    }
  },
  {
    skill_id: "logistics_optimization_v2",
    name: "物流调度优化",
    version: "2.1.0",
    domain: ["production_sales_match"],
    capability_tags: ["logistics", "route_optimization", "vehicle_scheduling"],
    input_schema: {
      delivery_orders: "array",
      vehicle_fleet: "object",
      route_constraints: "object",
      customer_time_windows: "object"
    },
    output_schema: {
      dispatch_plan: "array",
      route_details: "array",
      transportation_cost: "number"
    },
    cost: 0.5,
    latency: 900,
    accuracy_score: 0.90,
    dependencies: ["order_fulfillment_tracking_v2"],
    description: "优化成品电芯和Pack的配送路径和车辆调度，考虑客户时间窗、车辆容量和危险品运输限制。",
    files: {
      readme: "# Logistics Optimization\n\n## 概述\n锂电池成品物流配送优化系统，符合危险品(9类)运输规范。\n\n## 优化维度\n1. **路径优化**: VRPTW（带时间窗的车辆路径问题）\n2. **装载优化**: 考虑重量限制和堆叠约束\n3. **车辆调度**: 平衡自有车队和第三方物流\n4. **危险品合规**: 自动检查运输资质和包装要求\n\n## 约束条件\n- 9类危险品标识\n- 车辆GPS监控\n- 驾驶员危货资质\n- 温度监控（部分高镍产品）",
      config: "{\"max_route_duration\": 480, \"loading_efficiency_target\": 0.85, \"hazmat_class\": 9}",
      script: "from ortools.constraint_solver import routing_enums_pb2\n\ndef optimize_logistics(orders, fleet, constraints, time_windows):\n    # VRPTW求解\n    manager = pywrapcp.RoutingIndexManager(len(orders), fleet.vehicle_count, fleet.depot)\n    routing = pywrapcp.RoutingModel(manager)\n    # 添加距离和时间约束\n    return solve_vrptw(routing, manager, orders, time_windows)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "production_sales_alert_v1",
    name: "产销平衡预警",
    version: "1.5.0",
    domain: ["production_sales_match"],
    capability_tags: ["alert", "s_and_op", "early_warning"],
    input_schema: {
      production_actual: "array",
      sales_actual: "array",
      inventory_levels: "object",
      market_changes: "object"
    },
    output_schema: {
      imbalance_alerts: "array",
      recommended_actions: "array",
      scenario_simulations: "array"
    },
    cost: 0.2,
    latency: 300,
    accuracy_score: 0.88,
    dependencies: ["demand_forecast_v3", "capacity_evaluation_v2"],
    description: "监控产销偏差，当需求超出产能或产能闲置时发出预警，并提供调整建议。",
    files: {
      readme: "# Production-Sales Balance Alert\n\n## 概述\n产销平衡监控预警系统，支撑S&OP会议决策。\n\n## 预警类型\n1. **产能不足**: 需求 > 可用产能\n2. **产能闲置**: 产能利用率 < 70%\n3. **库存积压**: 成品库存 > 安全库存上限\n4. **缺货风险**: 成品库存 < 安全库存下限\n\n## 建议措施\n- 加班/外包\n- 促销活动\n- 客户优先级调整\n- 产能调配（储能/动力切换）",
      config: "{\"utilization_threshold_low\": 0.70, \"utilization_threshold_high\": 0.95}",
      script: "def check_balance(production, sales, inventory, market):\n    alerts = []\n    gap = sum(sales) - sum(production)\n    if gap > 0:\n        alerts.append({'type': 'shortage', 'severity': 'high', 'gap': gap})\n    elif utilization < 0.7:\n        alerts.append({'type': 'excess', 'severity': 'medium', 'recommendation': 'promotion'})\n    return alerts",
      scriptLang: "python"
    }
  },
  // ========== 新项目落地推演分析场景技能 ==========
  {
    skill_id: "npv_calculator_v1",
    name: "投资项目NPV/IRR计算器",
    version: "1.0.0",
    domain: ["new_project_planning"],
    capability_tags: ["finance", "investment", "npv", "irr"],
    input_schema: {
      initial_investment: "number",
      cash_flows: "array",
      discount_rate: "number",
      project_lifecycle: "number"
    },
    output_schema: {
      npv: "number",
      irr: "number",
      payback_period: "number",
      profitability_index: "number"
    },
    cost: 0.3,
    latency: 500,
    accuracy_score: 0.96,
    dependencies: [],
    description: "计算新生产线投资项目的净现值(NPV)、内部收益率(IRR)、投资回收期等关键财务指标。",
    files: {
      readme: "# NPV/IRR Calculator\n\n## 概述\n基于现金流折现法的投资项目财务评估工具。\n\n## 计算逻辑\n- NPV = ∑(CF_t / (1+r)^t) - Initial_Investment\n- IRR: 使NPV=0的折现率\n- 回收期: 累计现金流转正的时间点\n\n## 应用场景\n- 新产线投资决策\n- 扩建 vs 新建方案比选\n- 不同选址方案的经济性评估",
      config: "{\"default_discount_rate\": 0.10, \"tax_rate\": 0.25}",
      script: "def calculate_npv_irr(investment, cash_flows, discount_rate, lifecycle):\n    npv = -investment + sum([cf / (1+discount_rate)**t for t, cf in enumerate(cash_flows)])\n    irr = calculate_irr(cash_flows, investment)\n    payback = calculate_payback(cash_flows, investment)\n    return {'npv': npv, 'irr': irr, 'payback_period': payback}",
      scriptLang: "python"
    }
  },
  {
    skill_id: "location_optimizer_v1",
    name: "生产基地选址优化器",
    version: "1.0.0",
    domain: ["new_project_planning"],
    capability_tags: ["location", "optimization", "supply_chain", "multi_criteria"],
    input_schema: {
      candidate_locations: "array",
      customer_locations: "array",
      supplier_locations: "array",
      cost_factors: "object",
      constraint_weights: "object"
    },
    output_schema: {
      ranked_locations: "array",
      cost_breakdown: "object",
      risk_assessment: "object",
      recommendation: "string"
    },
    cost: 0.6,
    latency: 2000,
    accuracy_score: 0.89,
    dependencies: [],
    description: "综合考虑供应链距离、物流成本、土地价格、人工成本、税收政策、环保约束等多因素，为新建产线推荐最优选址。",
    files: {
      readme: "# Location Optimizer\n\n## 概述\n多目标优化算法驱动的生产基地选址决策支持系统。\n\n## 评估维度\n1. **供应链成本**: 原材料运输 + 成品配送\n2. **运营成本**: 土地 + 人工 + 能源 + 税收\n3. **风险因素**: 环保政策 + 劳动力供给 + 地方财政\n4. **战略价值**: 靠近客户 + 产业集群 + 扩展空间\n\n## 算法\nAHP层次分析法 + TOPSIS理想解排序",
      config: "{\"transport_cost_per_km\": 0.5, \"logistics_weight\": 0.3, \"labor_weight\": 0.25}",
      script: "def optimize_location(candidates, customers, suppliers, costs, weights):\n    scores = {}\n    for loc in candidates:\n        logistics_cost = calc_logistics(loc, customers, suppliers)\n        operating_cost = calc_operating(loc, costs)\n        risk_score = assess_risk(loc)\n        scores[loc] = weighted_score(logistics_cost, operating_cost, risk_score, weights)\n    return rank_locations(scores)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "risk_simulator_v1",
    name: "投资风险情景模拟器",
    version: "1.0.0",
    domain: ["new_project_planning"],
    capability_tags: ["risk", "simulation", "monte_carlo", "sensitivity"],
    input_schema: {
      base_case: "object",
      risk_scenarios: "array",
      simulation_runs: "number",
      confidence_level: "number"
    },
    output_schema: {
      scenario_results: "array",
      probability_distribution: "object",
      var_metrics: "object",
      sensitivity_ranking: "array"
    },
    cost: 0.8,
    latency: 5000,
    accuracy_score: 0.87,
    dependencies: ["npv_calculator_v1"],
    description: "通过蒙特卡洛模拟评估投资项目在不同风险情景下的表现，识别关键风险因子并量化潜在损失。",
    files: {
      readme: "# Risk Simulator\n\n## 概述\n基于蒙特卡洛模拟的投资风险评估工具。\n\n## 风险情景\n- 销量下滑（-20%、-30%、-50%）\n- 原材料涨价（+20%、+30%、+50%）\n- 建设延期（6个月、12个月、18个月）\n- 政策变化（补贴取消、环保加码）\n\n## 输出\n- 概率分布直方图\n- VaR风险价值\n- 敏感性排序",
      config: "{\"simulation_runs\": 10000, \"confidence_level\": 0.95}",
      script: "def simulate_risks(base_case, scenarios, runs, confidence):\n    results = []\n    for _ in range(runs):\n        scenario = sample_scenario(scenarios)\n        result = run_simulation(base_case, scenario)\n        results.append(result)\n    return analyze_distribution(results, confidence)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "market_forecast_v2",
    name: "新市场机会预测",
    version: "2.0.0",
    domain: ["new_project_planning"],
    capability_tags: ["market", "forecast", "demand", "growth"],
    input_schema: {
      target_market: "string",
      product_segment: "string",
      historical_data: "array",
      macro_indicators: "object",
      competitor_dynamics: "object"
    },
    output_schema: {
      market_size_forecast: "array",
      growth_rate: "number",
      market_share_potential: "number",
      entry_timing: "string",
      key_success_factors: "array"
    },
    cost: 0.5,
    latency: 1500,
    accuracy_score: 0.85,
    dependencies: ["demand_forecast_v3"],
    description: "预测目标市场（乘用车/商用车/储能）未来5-10年的需求规模和增长趋势，评估市场进入时机。",
    files: {
      readme: "# Market Forecast\n\n## 概述\n针对锂电新产能投资决策的市场需求预测模型。\n\n## 分析维度\n- **TAM/SAM/SOM**: 总体/可服务/可获得市场\n- **增长驱动因素**: 政策、技术、成本、竞争\n- **渗透率曲线**: 早期/成长期/成熟期\n- **区域差异**: 国内/海外、一线/下沉市场\n\n## 应用场景\n- 新产线产能规划\n- 产品线布局决策\n- 市场进入时机选择",
      config: "{\"forecast_horizon_years\": 10, \"growth_model\": \"bass_diffusion\"}",
      script: "def forecast_market(market, segment, historical, macro, competitors):\n    tam = calc_total_addressable_market(macro)\n    growth_rate = project_growth(historical, macro)\n    share_potential = assess_competitive_position(competitors)\n    return {'market_size': tam, 'growth': growth_rate, 'share': share_potential}",
      scriptLang: "python"
    }
  },
  {
    skill_id: "capex_analyzer_v1",
    name: "资本支出结构分析",
    version: "1.0.0",
    domain: ["new_project_planning"],
    capability_tags: ["capex", "investment", "cost_structure"],
    input_schema: {
      capacity_gwh: "number",
      technology_type: "string",
      automation_level: "string",
      location_factor: "number"
    },
    output_schema: {
      total_capex: "number",
      cost_breakdown: "object",
      unit_investment: "number",
      working_capital: "number",
      financing_requirement: "number"
    },
    cost: 0.4,
    latency: 800,
    accuracy_score: 0.92,
    dependencies: [],
    description: "估算新建产线的资本支出结构，包括设备投资、厂房建设、土地购置、流动资金等各项明细。",
    files: {
      readme: "# CAPEX Analyzer\n\n## 概述\n锂电产线资本支出估算模型。\n\n## 成本构成\n1. **设备投资** (60-70%): 涂布、卷绕、化成、分容等关键设备\n2. **厂房建设** (15-20%): 洁净厂房、公用工程、配套设施\n3. **土地购置** (5-10%): 根据地区地价差异较大\n4. **流动资金** (10-15%): 原材料、在制品、应收账款\n\n## 调整因子\n- 产能规模（规模经济）\n- 自动化程度\n- 地区成本差异",
      config: "{\"base_unit_cost_yuan_per_wh\": 0.35, \"scale_factor\": 0.85}",
      script: "def analyze_capex(capacity_gwh, tech_type, automation, location_factor):\n    base_capex = capacity_gwh * 1e9 * 0.35  # 元/Wh基准\n    equipment_ratio = 0.65 if automation == 'high' else 0.60\n    building_ratio = 0.15\n    land_ratio = 0.08 * location_factor\n    working_capital_ratio = 0.12\n    return calculate_breakdown(base_capex, equipment_ratio, building_ratio, land_ratio, working_capital_ratio)",
      scriptLang: "python"
    }
  },
  {
    skill_id: "sensitivity_analysis_v1",
    name: "投资决策敏感性分析",
    version: "1.0.0",
    domain: ["new_project_planning"],
    capability_tags: ["sensitivity", "tornado", "what_if", "break_even"],
    input_schema: {
      base_case_npv: "number",
      variable_ranges: "object",
      output_metrics: "array"
    },
    output_schema: {
      tornado_chart: "array",
      spider_chart: "array",
      break_even_points: "object",
      critical_variables: "array"
    },
    cost: 0.4,
    latency: 1000,
    accuracy_score: 0.94,
    dependencies: ["npv_calculator_v1"],
    description: "分析投资项目中各变量（销量、价格、成本、建设周期等）对NPV的敏感程度，识别关键决策因子。",
    files: {
      readme: "# Sensitivity Analysis\n\n## 概述\n tornado龙卷风图分析工具。\n\n## 分析变量\n- 销售量（±20%）\n- 销售价格（±15%）\n- 原材料成本（±30%）\n- 建设周期（±6个月）\n- 折现率（±2%）\n\n## 输出\n- 敏感性排序\n- 盈亏平衡点\n- 关键变量识别",
      config: "{\"variation_range\": 0.20, \"steps\": 5}",
      script: "def sensitivity_analysis(base_npv, variable_ranges, metrics):\n    tornado_data = []\n    for var, range_val in variable_ranges.items():\n        low_npv = calc_npv(var, -range_val)\n        high_npv = calc_npv(var, range_val)\n        sensitivity = abs(high_npv - low_npv)\n        tornado_data.append({'variable': var, 'low': low_npv, 'high': high_npv, 'sensitivity': sensitivity})\n    return sort_by_sensitivity(tornado_data)",
      scriptLang: "python"
    }
  },
  // ========== 产能评估推演预测分析场景技能 ==========
  {
    skill_id: "oee_analyzer_v1",
    name: "OEE综合效率分析器",
    version: "1.0.0",
    domain: ["capacity_assessment_prediction"],
    capability_tags: ["oee", "efficiency", "performance", "analysis"],
    input_schema: {
      availability_data: "object",
      performance_data: "object",
      quality_data: "object",
      time_period: "string"
    },
    output_schema: {
      oee_score: "number",
      availability_rate: "number",
      performance_rate: "number",
      quality_rate: "number",
      improvement_opportunities: "array"
    },
    cost: 0.3,
    latency: 600,
    accuracy_score: 0.95,
    dependencies: [],
    description: "计算锂电产线OEE（设备综合效率），识别时间损失、性能损失和质量损失，提供改善建议。",
    files: {
      readme: "# OEE Analyzer\n\n## 概述\n设备综合效率（OEE）分析工具，基于锂电行业特点优化。\n\n## 计算公式\n- OEE = 时间开动率 × 性能开动率 × 质量合格率\n- 时间开动率 = 实际运行时间 / 计划工作时间\n- 性能开动率 = 实际产出 / 理论产出\n- 质量合格率 = 合格品数 / 总产出数\n\n## 应用场景\n- 产能评估\n- 瓶颈识别\n- 改善机会发现",
      config: "{\"world_class_oee\": 0.85, \"target_oee\": 0.80}",
      script: "def analyze_oee(availability, performance, quality, period):\n    availability_rate = availability.actual_time / availability.planned_time\n    performance_rate = performance.actual_output / performance.theoretical_output\n    quality_rate = quality.good_units / quality.total_units\n    oee = availability_rate * performance_rate * quality_rate\n    improvements = identify_losses(availability, performance, quality)\n    return {'oee': oee, 'availability': availability_rate, 'performance': performance_rate, 'quality': quality_rate, 'improvements': improvements}",
      scriptLang: "python"
    }
  },
  {
    skill_id: "bottleneck_identifier_v1",
    name: "产线瓶颈识别器",
    version: "1.0.0",
    domain: ["capacity_assessment_prediction"],
    capability_tags: ["bottleneck", "constraint", "throughput", "optimization"],
    input_schema: {
      process_data: "array",
      cycle_times: "object",
      wip_levels: "object",
      utilization_rates: "object"
    },
    output_schema: {
      bottleneck_processes: "array",
      constraint_analysis: "object",
      capacity_utilization: "object",
      improvement_recommendations: "array"
    },
    cost: 0.4,
    latency: 800,
    accuracy_score: 0.92,
    dependencies: [],
    description: "基于TOC约束理论识别锂电产线瓶颈工序（涂布/卷绕/化成/分容等），分析产能限制因素。",
    files: {
      readme: "# Bottleneck Identifier\n\n## 概述\n基于约束理论（TOC）的产线瓶颈识别工具。\n\n## 分析维度\n- 工序周期时间对比\n- 设备利用率分析\n- 在制品（WIP）堆积情况\n- 产出节拍差异\n\n## 锂电行业重点\n- 涂布工序：面密度控制\n- 卷绕工序：对齐度要求\n- 化成工序：充放电时间\n- 分容工序：容量测试时长",
      config: "{\"bottleneck_threshold\": 0.90, \"wip_threshold\": 1000}",
      script: "def identify_bottlenecks(processes, cycle_times, wip, utilization):\n    bottlenecks = []\n    for process in processes:\n        if utilization[process] > 0.90 or wip[process] > 1000:\n            bottlenecks.append(process)\n    return {'bottlenecks': bottlenecks, 'analysis': analyze_constraint_impact(bottlenecks)}"
      ,
      scriptLang: "python"
    }
  },
  {
    skill_id: "equipment_health_monitor_v1",
    name: "设备健康度监测器",
    version: "1.0.0",
    domain: ["capacity_assessment_prediction"],
    capability_tags: ["health", "equipment", "monitoring", "prediction"],
    input_schema: {
      vibration_data: "array",
      temperature_data: "array",
      maintenance_history: "array",
      runtime_hours: "number"
    },
    output_schema: {
      health_score: "number",
      remaining_useful_life: "number",
      risk_level: "string",
      maintenance_recommendations: "array"
    },
    cost: 0.5,
    latency: 700,
    accuracy_score: 0.89,
    dependencies: [],
    description: "评估关键生产设备（涂布机、卷绕机、化成柜等）的健康状态，预测剩余使用寿命。",
    files: {
      readme: "# Equipment Health Monitor\n\n## 概述\n关键生产设备健康状态评估与预测工具。\n\n## 监测指标\n- 振动频谱分析\n- 温度趋势监测\n- 维护历史分析\n- 运行时间统计\n\n## 输出结果\n- 健康度评分（0-100）\n- 剩余使用寿命预测\n- 风险等级评估\n- 维护建议",
      config: "{\"health_threshold_good\": 80, \"health_threshold_warning\": 60}",
      script: "def monitor_health(vibration, temperature, maintenance, runtime):\n    health_score = calculate_health_score(vibration, temperature, maintenance)\n    rul = predict_rul(health_score, runtime)\n    risk = assess_risk_level(health_score)\n    return {'health': health_score, 'rul': rul, 'risk': risk, 'recommendations': generate_recommendations(health_score)}"
      ,
      scriptLang: "python"
    }
  },
  {
    skill_id: "roi_calculator_v1",
    name: "产能投资ROI计算器",
    version: "1.0.0",
    domain: ["capacity_assessment_prediction"],
    capability_tags: ["roi", "investment", "capacity", "return"],
    input_schema: {
      investment_amount: "number",
      incremental_revenue: "number",
      incremental_cost: "number",
      project_lifecycle: "number"
    },
    output_schema: {
      roi_percentage: "number",
      annual_return: "number",
      payback_period: "number",
      cumulative_cash_flow: "array"
    },
    cost: 0.3,
    latency: 500,
    accuracy_score: 0.94,
    dependencies: [],
    description: "计算产能扩张投资的ROI（投资回报率）、年化收益和投资回收期。",
    files: {
      readme: "# ROI Calculator\n\n## 概述\n产能扩张投资回报率计算工具。\n\n## 计算逻辑\n- ROI = (收益 - 成本) / 投资 × 100%\n- 年化收益 = 年增量收入 - 年增量成本\n- 回收期 = 投资额 / 年净收益\n\n## 应用场景\n- 产线扩产决策\n- 新线投资评估\n- 自动化改造ROI分析",
      config: "{\"target_roi\": 0.15, \"max_payback_years\": 5}",
      script: "def calculate_roi(investment, revenue, cost, lifecycle):\n    annual_profit = revenue - cost\n    roi = (annual_profit * lifecycle - investment) / investment\n    payback = investment / annual_profit\n    cash_flow = calculate_cumulative_cash_flow(investment, annual_profit, lifecycle)\n    return {'roi': roi, 'annual_return': annual_profit, 'payback': payback, 'cash_flow': cash_flow}",
      scriptLang: "python"
    }
  },
  {
    skill_id: "production_simulator_v1",
    name: "产能生产推演模拟器",
    version: "1.0.0",
    domain: ["capacity_assessment_prediction"],
    capability_tags: ["simulation", "production", "capacity", "what_if"],
    input_schema: {
      capacity_config: "object",
      demand_scenario: "object",
      production_constraints: "object",
      simulation_period: "number"
    },
    output_schema: {
      production_output: "array",
      capacity_utilization: "array",
      fulfillment_rate: "number",
      scenario_comparison: "object"
    },
    cost: 0.7,
    latency: 2000,
    accuracy_score: 0.88,
    dependencies: ["capacity_evaluation_v2"],
    description: "基于不同产能配置方案进行生产推演模拟，评估需求满足率和产能利用率。",
    files: {
      readme: "# Production Simulator\n\n## 概述\n产能配置方案推演模拟工具。\n\n## 模拟场景\n- 现有产能配置\n- 扩产方案A/B\n- 新建产线方案\n- 委外加工组合\n\n## 输出指标\n- 产出预测\n- 产能利用率\n- 订单满足率\n- 情景对比分析",
      config: "{\"simulation_months\": 12, \"confidence_level\": 0.95}",
      script: "def simulate_production(capacity, demand, constraints, period):\n    outputs = []\n    utilization = []\n    for month in range(period):\n        output = calculate_monthly_output(capacity, demand[month], constraints)\n        outputs.append(output)\n        utilization.append(output / capacity.total)\n    fulfillment = sum(outputs) / sum(demand)\n    return {'outputs': outputs, 'utilization': utilization, 'fulfillment': fulfillment}"
      ,
      scriptLang: "python"
    }
  },
  {
    skill_id: "risk_assessor_v1",
    name: "产能规划风险评估器",
    version: "1.0.0",
    domain: ["capacity_assessment_prediction"],
    capability_tags: ["risk", "assessment", "capacity", "planning"],
    input_schema: {
      market_risks: "object",
      operational_risks: "object",
      financial_risks: "object",
      mitigation_strategies: "array"
    },
    output_schema: {
      overall_risk_score: "number",
      risk_breakdown: "object",
      high_impact_risks: "array",
      mitigation_recommendations: "array"
    },
    cost: 0.5,
    latency: 1000,
    accuracy_score: 0.87,
    dependencies: [],
    description: "评估产能规划方案的多维度风险（市场、运营、财务），提供风险缓释建议。",
    files: {
      readme: "# Risk Assessor\n\n## 概述\n产能规划风险评估与管理工具。\n\n## 风险维度\n- 市场风险：需求波动、竞争加剧\n- 运营风险：设备故障、人员流失\n- 财务风险：资金压力、汇率波动\n- 政策风险：环保政策、能耗双控\n\n## 输出结果\n- 综合风险评分\n- 高风险项识别\n- 缓释策略建议",
      config: "{\"risk_threshold_low\": 30, \"risk_threshold_high\": 70}",
      script: "def assess_risks(market, operational, financial, strategies):\n    market_score = assess_market_risk(market)\n    operational_score = assess_operational_risk(operational)\n    financial_score = assess_financial_risk(financial)\n    overall = calculate_weighted_risk(market_score, operational_score, financial_score)\n    high_risks = identify_high_impact_risks(market, operational, financial)\n    return {'overall_score': overall, 'breakdown': {'market': market_score, 'operational': operational_score, 'financial': financial_score}, 'high_risks': high_risks, 'recommendations': generate_mitigation_strategies(high_risks)}"
      ,
      scriptLang: "python"
    }
  }
];

// Configuration for generating ontologically correct graphs per scenario
// Support both string format (for simple labels) and object format {id, name} (for semantic IDs with Chinese display names)
interface ScenarioGraphConfig {
    l2: (string | { id: string; name: string })[]; // Subsystems
    l3: Record<string, (string | { id: string; name: string })[]>; // Processes per Subsystem
    l4: Record<string, string[]>; // Parameters per Process (always Chinese labels)
}

const DEFAULT_GRAPH_CONFIG: ScenarioGraphConfig = {
    l2: ['子系统A', '子系统B'],
    l3: { '子系统A': ['过程1', '过程2'], '子系统B': ['过程3'] },
    l4: { '过程1': ['参数A'], '过程2': ['参数B'], '过程3': ['参数C'] }
};

const SCENARIO_CONFIGS: Record<string, ScenarioGraphConfig> = {
    'breakdown_maintenance': {
        l2: ['故障接报', '资源调度', '备件物流', '现场维修'],
        l3: {
            '故障接报': ['安灯呼叫', '故障分类', '远程初诊'],
            '资源调度': ['专家匹配', '工单排程'],
            '备件物流': ['库存查询', 'AGV配送', '备件出库'],
            '现场维修': ['拆解作业', '更换调试', '验证运行']
        },
        l4: {
            '故障分类': ['故障代码', '严重等级'],
            '远程初诊': ['报警日志', '历史图像'],
            '专家匹配': ['技能矩阵', '人员状态', '位置信息'],
            '库存查询': ['SKU数量', '库位坐标'],
            'AGV配送': ['路径规划', '预计到达时间'],
            '更换调试': ['扭矩记录', '试运行参数']
        }
    },
    'production_planning': {
        l2: ['订单需求', '瓶颈资源', '关键物料', '计划排程'],
        l3: {
            '订单需求': ['储能电芯订单', '动力电池订单', 'Pack交付计划'],
            '瓶颈资源': ['化成柜产能', '静置库位', '涂布车速'],
            '关键物料': ['正极主材(LFP/NCM)', '结构件', '电解液'],
            '计划排程': ['主生产计划(MPS)', '工序平衡分析']
        },
        l4: {
            '储能电芯订单': ['280Ah方壳', '交付DDT'],
            '化成柜产能': ['电源柜利用率', '托盘周转率'],
            '静置库位': ['库位占用率', '静置周期(7-14天)'],
            '正极主材(LFP/NCM)': ['供应商LT', '安全库存天数'],
            '主生产计划(MPS)': ['电芯产出量(Wh)', 'Pack齐套率']
        }
    },
    'cost_management': {
        l2: ['成本核算', '能源管理', '资金流'],
        l3: {
            '成本核算': ['料工费分摊', '差异分析'],
            '能源管理': ['电耗监控', '峰谷平衡'],
            '资金流': ['库存占用', '采购付款']
        },
        l4: {
            '料工费分摊': ['BOM定额', '实际工时'],
            '电耗监控': ['分项计量', '功率因数'],
            '库存占用': ['周转天数', '呆滞金额']
        }
    },
    'predictive_maintenance': {
        l2: ['数据采集', '信号处理', '状态监测', '决策支持'],
        l3: {
            '数据采集': ['振动监测', '温度监测', '油液采样'],
            '信号处理': ['去噪处理', '特征提取(FFT)'],
            '状态监测': ['健康度评分', '退化趋势分析'],
            '决策支持': ['剩余寿命(RUL)', '维护建议']
        },
        l4: {
            '振动监测': ['加速度峰值', '位移有效值'],
            '特征提取(FFT)': ['特征频率', '能量谱密度'],
            '健康度评分': ['基准偏差', '异常概率'],
            '剩余寿命(RUL)': ['预测天数', '置信区间']
        }
    },
    'coating': {
        l2: ['供料系统', '涂布机头', '干燥烘箱', '收卷单元'],
        l3: {
            '供料系统': ['浆料过滤', '精密泵送'],
            '涂布机头': ['间隙控制', '流体仿真'],
            '干燥烘箱': ['温区控制', '风速调节'],
            '收卷单元': ['张力控制', '纠偏控制']
        },
        l4: {
            '精密泵送': ['泵转速', '流量稳定性'],
            '间隙控制': ['极片厚度', '横向一致性'],
            '温区控制': ['实际温度', '升温速率'],
            '张力控制': ['收卷张力', '锥度系数']
        }
    },
    // Fallback/Generic configs for others to prevent "Spare parts connecting to Environment" issues
    'raw_material': {
        l2: ['供应商管理', '入库检验', '仓储环境'],
        l3: { '供应商管理': ['资质审核'], '入库检验': ['理化分析', '抽样检测'], '仓储环境': ['温湿度监控', '异物管控'] },
        l4: { '理化分析': ['水分含量', '纯度指标'], '抽样检测': ['包装完整性'], '温湿度监控': ['露点温度'] }
    },
    'mixing': {
        l2: ['投料系统', '搅拌工艺', '输送系统'],
        l3: { '投料系统': ['称重配料'], '搅拌工艺': ['分散均质', '脱泡处理'], '输送系统': ['管道清洗', '磁性过滤'] },
        l4: { '称重配料': ['配料精度'], '分散均质': ['搅拌转速', '浆料粘度', '固含量'], '脱泡处理': ['真空度'] }
    },
    'production_sales_match': {
        // Use IDs from PRODUCTION_SALES_PROCESS_MAP to enable backward analysis
        // ID format is semantic ID, label is Chinese display name
        l2: [
            { id: 'demand_forecast', name: '需求预测' },
            { id: 'sales_planning', name: '销售计划' },
            { id: 'capacity_planning', name: '产能规划' },
            { id: 'inventory_management', name: '库存管理' },
            { id: 'production_scheduling', name: '生产排程' },
            { id: 'quality_control', name: '质量控制' },
            { id: 'logistics_delivery', name: '物流配送' },
            { id: 'customer_service', name: '客户服务' }
        ],
        l3: {
            'demand_forecast': [
                { id: 'market_analysis', name: '市场分析' },
                { id: 'forecast_model', name: '预测模型' },
                { id: 'accuracy_evaluation', name: '准确度评估' }
            ],
            'sales_planning': [
                { id: 'sales_target', name: '销售目标' },
                { id: 'order_management', name: '订单管理' },
                { id: 'customer_segmentation', name: '客户分级' }
            ],
            'capacity_planning': [
                { id: 'capacity_assessment', name: '产能评估' },
                { id: 'bottleneck_analysis', name: '瓶颈分析' },
                { id: 'resource_allocation', name: '资源调配' }
            ],
            'inventory_management': [
                { id: 'raw_material_inventory', name: '原材料库存' },
                { id: 'wip_inventory', name: '在制品库存' },
                { id: 'finished_goods_inventory', name: '成品库存' },
                { id: 'safety_stock', name: '安全库存' }
            ],
            'production_scheduling': [
                { id: 'mps_generation', name: '主生产计划' },
                { id: 'production_tracking', name: '生产跟踪' },
                { id: 'exception_handling', name: '异常处理' }
            ],
            'quality_control': [
                { id: 'quality_inspection', name: '质量检验' },
                { id: 'defect_analysis', name: '缺陷分析' },
                { id: 'improvement_tracking', name: '改进跟踪' }
            ],
            'logistics_delivery': [
                { id: 'delivery_planning', name: '配送计划' },
                { id: 'shipment_tracking', name: '发货跟踪' },
                { id: 'carrier_management', name: '承运商管理' }
            ],
            'customer_service': [
                { id: 'order_inquiry', name: '订单查询' },
                { id: 'complaint_handling', name: '投诉处理' },
                { id: 'satisfaction_survey', name: '满意度调查' }
            ]
        },
        l4: {
            'market_analysis': ['市场趋势', '竞争对手分析', '需求波动性'],
            'forecast_model': ['时间序列模型', '机器学习预测', '集成预测'],
            'accuracy_evaluation': ['MAE指标', 'MAPE指标', '偏差分析'],
            'sales_target': ['月度目标', '季度目标', '年度目标'],
            'order_management': ['订单录入', '订单验证', '优先级排序'],
            'customer_segmentation': ['等级分类', '价值评分', '风险评估'],
            'capacity_assessment': ['设备OEE', '人员可用性', '班次产能'],
            'bottleneck_analysis': ['化成柜瓶颈', '静置库位瓶颈', '涂布瓶颈'],
            'resource_allocation': ['储/动切换', '加班安排', '外包决策'],
            'raw_material_inventory': ['正极材料库存', '负极材料库存', '电解液库存'],
            'wip_inventory': ['极片WIP', '电芯WIP', '静置电芯'],
            'finished_goods_inventory': ['储能电芯库存', '动力电芯库存', 'Pack库存'],
            'safety_stock': ['服务水平', '补货点设置', '补货批量'],
            'mps_generation': ['粗能力计划', '物料计划', '产能计划'],
            'production_tracking': ['完工率', '质量状态', '产出预测'],
            'exception_handling': ['延误响应', '质量问题', '产能短缺'],
            'quality_inspection': ['来料检验', '过程检验', '成品检验'],
            'defect_analysis': ['根本原因', '缺陷趋势', '纠正措施'],
            'improvement_tracking': ['改善项目', '六西格玛', '质量审核'],
            'delivery_planning': ['路径优化', '时间窗约束', '装载优化'],
            'shipment_tracking': ['GPS跟踪', 'ETA预测', '异常预警'],
            'carrier_management': ['承运商选择', '费率谈判', '绩效评估']
        }
    },
    'new_project_planning': {
        // 新项目落地推演分析 - 5层决策结构
        l2: [
            { id: 'strategic_decision', name: '战略层决策' },
            { id: 'market_analysis', name: '需求与市场层' },
            { id: 'capacity_manufacturing', name: '产能与制造层' },
            { id: 'finance_investment', name: '财务与投资层' },
            { id: 'risk_constraints', name: '风险与约束层' }
        ],
        l3: {
            'strategic_decision': [
                { id: 'use_existing_line', name: '是否使用现有产线' },
                { id: 'add_new_capacity', name: '是否需要新增产能' },
                { id: 'expand_or_new', name: '扩建还是新建' },
                { id: 'location_selection', name: '新建地址选择' },
                { id: 'tech_upgrade', name: '技术路线升级' },
                { id: 'phased_investment', name: '是否分阶段投建' },
                { id: 'customer_partnership', name: '是否与客户共建' },
                { id: 'gov_policy_support', name: '政府政策支持' }
            ],
            'market_analysis': [
                { id: 'order_commitment', name: '客户订单锁定比例' },
                { id: 'contract_duration', name: '合同周期长度' },
                { id: 'demand_volatility', name: '需求波动性' },
                { id: 'customer_concentration', name: '客户集中度' },
                { id: 'price_trend', name: '销售价格趋势' },
                { id: 'product_lifecycle', name: '产品生命周期预测' },
                { id: 'tech_substitution', name: '技术替代风险' }
            ],
            'capacity_manufacturing': [
                { id: 'current_utilization', name: '当前产能利用率' },
                { id: 'oee_analysis', name: 'OEE设备综合效率' },
                { id: 'yield_rate', name: '良率水平' },
                { id: 'tech_compatibility', name: '技术适配性' },
                { id: 'equipment_age', name: '设备老化程度' },
                { id: 'retrofit_feasibility', name: '改造可行性' },
                { id: 'switching_cost', name: '切换成本' },
                { id: 'capacity_flexibility', name: '产能弹性空间' },
                { id: 'staffing_match', name: '人员匹配度' }
            ],
            'finance_investment': [
                { id: 'capex_investment', name: 'CAPEX投资额' },
                { id: 'construction_cycle', name: '建设周期' },
                { id: 'equipment_delivery', name: '设备交付周期' },
                { id: 'land_acquisition', name: '土地获取周期' },
                { id: 'policy_approval', name: '政策审批周期' },
                { id: 'automation_level', name: '自动化水平' },
                { id: 'unit_cost_forecast', name: '单位制造成本预测' },
                { id: 'energy_cost', name: '能耗成本' },
                { id: 'depreciation_period', name: '折旧年限' },
                { id: 'economies_scale', name: '规模经济临界点' },
                { id: 'expansion_potential', name: '未来扩展能力' },
                { id: 'digital_infrastructure', name: '数字化基础设施' }
            ],
            'risk_constraints': [
                { id: 'sales_decline_scenario', name: '销量下降20%情景' },
                { id: 'material_price_rise', name: '原材料上涨30%' },
                { id: 'customer_default', name: '客户违约风险' },
                { id: 'tech_route_substitution', name: '技术路线替代' },
                { id: 'subsidy_removal', name: '政策补贴取消' },
                { id: 'delay_production_risk', name: '延期投产风险' },
                { id: 'equipment_delay', name: '设备交付延迟' },
                { id: 'approval_delay', name: '环保审批延迟' },
                { id: 'exchange_rate_risk', name: '汇率风险' },
                { id: 'strategic_shift_risk', name: '战略转型风险' }
            ]
        },
        l4: {
            'use_existing_line': ['现有产线产能', '改造成本评估', '停产损失'],
            'add_new_capacity': ['产能缺口分析', '投资回收期', '市场需求预测'],
            'expand_or_new': ['扩建成本', '新建成本', '建设周期对比'],
            'location_selection': ['供应链距离', '物流成本', '土地价格', '人工成本', '电价', '税收政策', '环保政策', '产业集群'],
            'tech_upgrade': ['新工艺导入', '自动化升级', '数字化改造', '良率提升潜力'],
            'phased_investment': ['一期产能', '二期扩展', '资金压力分散'],
            'customer_partnership': ['绑定协议', '共建模式', '风险分担'],
            'gov_policy_support': ['税收优惠', '土地补贴', '能耗指标', '产业基金'],
            'order_commitment': ['订单覆盖率', '违约条款', '客户信用评级'],
            'contract_duration': ['长期合约占比', '价格调整机制', '续约概率'],
            'demand_volatility': ['季节性波动', '市场不确定性', '预测准确率'],
            'current_utilization': ['产线利用率', '峰值负荷', '瓶颈工序'],
            'oee_analysis': ['时间开动率', '性能开动率', '合格品率'],
            'capex_investment': ['设备投资', '厂房建设', '土地购置', '流动资金'],
            'construction_cycle': ['土建周期', '设备安装', '调试爬坡', '量产时间'],
            'sales_decline_scenario': ['盈亏平衡点', '现金流压力', '产能消化'],
            'material_price_rise': ['成本传导', '价格谈判', '供应商管理']
        }
    },
    'capacity_assessment_prediction': {
        // 产能评估推演预测分析 - 锂电企业产能规划（供给侧视角）
        l2: [
            { id: 'current_capacity', name: '现有产能评估' },
            { id: 'supply_capability', name: '产能供给能力评估' },
            { id: 'capacity_expansion', name: '产能扩展潜力' },
            { id: 'capacity_planning', name: '产能规划方案' },
            { id: 'investment_decision', name: '投资决策推演' },
            { id: 'risk_simulation', name: '风险情景模拟' }
        ],
        l3: {
            'current_capacity': [
                { id: 'theoretical_capacity', name: '理论产能测算' },
                { id: 'effective_capacity', name: '有效产能评估' },
                { id: 'oee_analysis', name: 'OEE综合分析' },
                { id: 'bottleneck_process', name: '瓶颈工序识别' },
                { id: 'equipment_status', name: '设备状态评估' },
                { id: 'personnel_config', name: '人员配置评估' }
            ],
            'supply_capability': [
                { id: 'max_output_capacity', name: '最大产出能力' },
                { id: 'sustainable_capacity', name: '可持续产能' },
                { id: 'flexibility_assessment', name: '产能弹性评估' },
                { id: 'quality_capacity', name: '质量合格产能' },
                { id: 'resource_constraints', name: '资源约束分析' },
                { id: 'operation_mode', name: '运营模式分析' }
            ],
            'capacity_expansion': [
                { id: 'short_term_expansion', name: '短期扩产潜力' },
                { id: 'medium_term_expansion', name: '中期扩产潜力' },
                { id: 'long_term_expansion', name: '长期扩产潜力' },
                { id: 'peak_capacity_analysis', name: '峰值产能分析' },
                { id: 'capacity_ceiling', name: '产能天花板分析' }
            ],
            'capacity_planning': [
                { id: 'existing_line_expansion', name: '现有产线扩产' },
                { id: 'new_line_construction', name: '新建产线方案' },
                { id: 'oem_consideration', name: '委外加工评估' },
                { id: 'automation_upgrade', name: '自动化升级' },
                { id: 'process_optimization', name: '工艺优化挖潜' },
                { id: 'multi_shift_operation', name: '多班制运营' }
            ],
            'investment_decision': [
                { id: 'capex_estimation', name: '资本支出估算' },
                { id: 'roi_analysis', name: '投资回报分析' },
                { id: 'payback_period', name: '回收期测算' },
                { id: 'npv_calculation', name: 'NPV净现值分析' },
                { id: 'financing_options', name: '融资方案选择' }
            ],
            'risk_simulation': [
                { id: 'capacity_volatility', name: '产能波动风险' },
                { id: 'technology_obsolescence', name: '技术淘汰风险' },
                { id: 'policy_change', name: '政策变化风险' },
                { id: 'supply_chain_disruption', name: '供应链中断风险' },
                { id: 'market_competition', name: '市场竞争风险' }
            ]
        },
        l4: {
            'theoretical_capacity': ['设备铭牌产能', '理论产出计算', '产能利用率'],
            'effective_capacity': ['良品率修正', '换型时间损耗', '计划停机时间'],
            'oee_analysis': ['时间开动率', '性能开动率', '质量合格率'],
            'bottleneck_process': ['化成工序', '涂布工序', '卷绕工序', '分容工序'],
            'equipment_status': ['设备老化率', '故障频率', '维修成本'],
            'max_output_capacity': ['极限产能测算', '设备满负荷产出', '产能爬坡极限'],
            'sustainable_capacity': ['稳定产能水平', '质量标准产能', '可持续运营产能'],
            'flexibility_assessment': ['产能调节范围', '快速响应能力', '弹性扩产空间'],
            'quality_capacity': ['A品产能', '合格品产能', '返修品产能'],
            'resource_constraints': ['电力供应约束', '原料供应约束', '劳动力约束'],
            'short_term_expansion': ['3个月扩产潜力', '6个月扩产潜力', '12个月扩产潜力'],
            'existing_line_expansion': ['设备增加', '节拍提升', '良率改善'],
            'new_line_construction': ['GWh产能投资', '建设周期', '设备选型'],
            'oem_consideration': ['代工成本', '质量控制', '产能锁定'],
            'capex_estimation': ['设备投资', '厂房投资', '土地投资', '流动资金'],
            'roi_analysis': ['年化收益率', '盈亏平衡点', '现金流分析'],
            'capacity_volatility': ['设备故障情景', '原料短缺情景', '人员流失情景'],
            'technology_obsolescence': ['固态电池威胁', '钠离子替代', '技术迭代周期']
        }
    }
};

// Function to generate ontologically consistent graphs
const generateSpecificGraph = (scenarioId: string, scenarioName: string, skillIds: string[]): OntologyData => {
    const nodes: OntologyNode[] = [];
    const links: OntologyLink[] = [];

    // Helpers
    const randStatus = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
    const config = SCENARIO_CONFIGS[scenarioId] || DEFAULT_GRAPH_CONFIG; // Use specific or default

    // 示例数据生成器
    const owners = ['张工', '李经理', '王主管', '刘工程师', '陈博士', '赵主任', '孙技术员', '周专家'];
    const frequencies = ['实时', '每分钟', '每小时', '每班', '每日', '每周', '每月', '按需'];
    const dataFormats = ['JSON', 'XML', 'CSV', '数据库表', '消息队列', '文件', 'API接口', '二进制流'];
    // 数据源类型：导入、各系统对接
    const dataSources = ['导入', 'CRM系统', 'BOM系统', 'MES系统', 'ERP系统', 'SCM系统', 'PLM系统', 'WMS系统'];

    const getRandomOwner = () => owners[Math.floor(Math.random() * owners.length)];
    const getRandomFrequency = () => frequencies[Math.floor(Math.random() * frequencies.length)];
    const getRandomFormat = () => dataFormats[Math.floor(Math.random() * dataFormats.length)];
    const getRandomDataSource = () => dataSources[Math.floor(Math.random() * dataSources.length)];

    // 根据场景生成相关任务
    const generatePendingTasks = (nodeId: string, nodeName: string, nodeLevel: number): any[] => {
      const tasks: any[] = [];
      const taskCount = Math.floor(Math.random() * 3) + 1; // 1-3个任务

      // 场景相关的任务模板
      const scenarioTaskTemplates: Record<string, Array<{title: string, desc: string, priority: string}>> = {
        raw_material: [
          { title: '原材料质检数据录入', desc: `录入${scenarioName}相关原材料的质量检测数据`, priority: 'high' },
          { title: '供应商资质审核', desc: '审核新供应商资质文件并归档', priority: 'high' },
          { title: '来料检验报告提交', desc: '提交来料检验报告至质量管理系统', priority: 'medium' },
          { title: '批次追溯信息维护', desc: '维护原材料批次追溯信息', priority: 'medium' },
        ],
        mixing: [
          { title: '浆料粘度检测数据提交', desc: '提交搅拌后浆料粘度检测数据', priority: 'high' },
          { title: '配比参数确认', desc: '确认原材料配比参数设置', priority: 'high' },
          { title: '搅拌工艺参数上报', desc: '上报搅拌工艺过程参数', priority: 'medium' },
          { title: '浆料质量异常处理', desc: '处理浆料质量异常情况', priority: 'high' },
        ],
        coating: [
          { title: '涂布厚度检测数据提交', desc: '提交涂布厚度检测数据至MES系统', priority: 'high' },
          { title: '面密度检测报告', desc: '提交极片面密度检测报告', priority: 'high' },
          { title: '涂布速度参数确认', desc: '确认涂布速度参数设置', priority: 'medium' },
          { title: '涂布缺陷记录提交', desc: '提交涂布缺陷检测记录', priority: 'medium' },
        ],
        calendaring: [
          { title: '压实密度数据录入', desc: '录入辊压后极片压实密度数据', priority: 'high' },
          { title: '辊压参数上报', desc: '上报辊压压力和速度参数', priority: 'medium' },
          { title: '延展率检测报告', desc: '提交极片延展率检测报告', priority: 'medium' },
          { title: '辊压质量异常处理', desc: '处理辊压质量异常情况', priority: 'high' },
        ],
        winding: [
          { title: '对齐度检测数据提交', desc: '提交卷绕对齐度检测数据', priority: 'high' },
          { title: '张力参数确认', desc: '确认卷绕张力参数设置', priority: 'medium' },
          { title: 'Overhang检测记录', desc: '提交Overhang检测记录', priority: 'high' },
          { title: '卷绕工艺参数上报', desc: '上报卷绕工艺过程参数', priority: 'medium' },
        ],
        formation: [
          { title: '化成数据上传', desc: '上传电芯化成过程数据', priority: 'high' },
          { title: '容量测试报告', desc: '提交电芯容量测试报告', priority: 'high' },
          { title: '电芯分级结果确认', desc: '确认电芯分级分类结果', priority: 'high' },
          { title: '化成异常记录提交', desc: '提交化成过程异常记录', priority: 'medium' },
        ],
        production_planning: [
          { title: '生产计划数据提交', desc: '提交月度/周度生产计划数据', priority: 'high' },
          { title: '产能评估报告', desc: '提交产能评估分析报告', priority: 'medium' },
          { title: '物料需求确认', desc: '确认生产物料需求清单', priority: 'high' },
          { title: '排产计划审核', desc: '审核排产计划并提交', priority: 'high' },
        ],
        predictive_maintenance: [
          { title: '设备状态数据提交', desc: '提交设备运行状态监测数据', priority: 'high' },
          { title: '故障预警处理', desc: '处理设备故障预警信息', priority: 'high' },
          { title: '维护计划确认', desc: '确认设备维护计划安排', priority: 'medium' },
          { title: '备件库存更新', desc: '更新备件库存信息', priority: 'medium' },
        ],
        default: [
          { title: `${nodeName}数据采集`, desc: `采集${nodeName}相关数据并提交`, priority: 'high' },
          { title: `${nodeName}质量检查`, desc: `执行${nodeName}质量检查并提交报告`, priority: 'high' },
          { title: `${nodeName}参数确认`, desc: `确认${nodeName}关键参数设置`, priority: 'medium' },
          { title: `${nodeName}异常处理`, desc: `处理${nodeName}过程中的异常情况`, priority: 'medium' },
          { title: `${nodeName}报告提交`, desc: `提交${nodeName}相关工作报告`, priority: 'low' },
        ]
      };

      // 获取当前场景的任务模板
      const taskTemplates = scenarioTaskTemplates[scenarioId] || scenarioTaskTemplates.default;

      for (let i = 0; i < taskCount; i++) {
        const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
        const statuses = ['pending', 'in_progress', 'completed'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        tasks.push({
          id: `task_${scenarioId}_${nodeId}_${i}`,
          title: template.title,
          description: template.desc,
          priority: template.priority,
          status: status,
          dueDate: status === 'completed' ? undefined : `2024-03-${10 + Math.floor(Math.random() * 20)}`,
          assignee: undefined // 任务由当前节点负责人提交，不需要单独指派
        });
      }
      return tasks;
    };

    // 辅助函数：生成关联节点状态
    const createRelatedNode = (id: string, label: string) => ({
      id,
      label,
      dataSubmitted: Math.random() > 0.3, // 70%概率按时提交
      instructionCompleted: Math.random() > 0.2 // 80%概率完成指令
    });

    // Level 1: Scenario Root
    const rootId = 'root';
    nodes.push({
      id: rootId,
      label: scenarioName,
      type: 'concept',
      group: 1,
      data_readiness: 100,
      owner: getRandomOwner(),
      responsibility: `全面负责${scenarioName}场景的业务管理、数据治理和系统协调，确保各环节高效协同运行`,
      dataSource: '综合管理平台',
      dataFormat: 'JSON',
      updateFrequency: '实时监控',
      pendingTasks: generatePendingTasks(rootId, scenarioName, 1)
    });

    // Level 2: Sub-Systems
    const l2Nodes: { id: string; label: string }[] = [];
    config.l2.forEach((l2Item, i) => {
        // Support both string format (old) and object format {id, name} (new)
        const isObject = typeof l2Item === 'object' && l2Item !== null && 'id' in l2Item;
        const l2Id = isObject ? (l2Item as any).id : l2Item;
        const l2Label = isObject ? (l2Item as any).name : l2Item;

        l2Nodes.push({ id: l2Id, label: l2Label });
        // L2 nodes usually have aggregated high data readiness
        nodes.push({
            id: l2Id,
            label: l2Label,
            type: 'concept',
            group: 2,
            data_readiness: randStatus(80, 100),
            owner: getRandomOwner(),
            responsibility: `管理${l2Label}子系统的运行状态，协调内部工艺过程，确保与子系统间数据互通`,
            upstreamNodes: i > 0 ? [createRelatedNode(l2Nodes[i - 1].id, l2Nodes[i - 1].label)] : undefined,
            downstreamNodes: i < config.l2.length - 1 ? [createRelatedNode(
                (typeof config.l2[i + 1] === 'object' && config.l2[i + 1] !== null && 'id' in config.l2[i + 1])
                    ? (config.l2[i + 1] as any).id
                    : config.l2[i + 1],
                (typeof config.l2[i + 1] === 'object' && config.l2[i + 1] !== null && 'name' in config.l2[i + 1])
                    ? (config.l2[i + 1] as any).name
                    : config.l2[i + 1]
            )] : undefined,
            dataSource: getRandomDataSource(),
            dataFormat: getRandomFormat(),
            updateFrequency: getRandomFrequency(),
            pendingTasks: generatePendingTasks(l2Id, l2Label, 2)
        });
        links.push({ source: rootId, target: l2Id, relation: '组成' });

        // Level 3: Processes
        // L3 config key can be the ID (for object format) or the label (for string format)
        const l3Config = config.l3[l2Id] || config.l3[l2Label] || [`${l2Label}_Process`];
        const l3Nodes: { id: string; label: string }[] = [];
        l3Config.forEach((l3Item, j) => {
            // Support both string format and object format {id, name}
            const isL3Object = typeof l3Item === 'object' && l3Item !== null && 'id' in l3Item;
            const l3Id = isL3Object ? (l3Item as any).id : l3Item;
            const l3Label = isL3Object ? (l3Item as any).name : l3Item;

            l3Nodes.push({ id: l3Id, label: l3Label });
            nodes.push({
                id: l3Id,
                label: l3Label,
                type: 'concept',
                group: 3,
                data_readiness: randStatus(60, 95),
                owner: getRandomOwner(),
                responsibility: `执行${l3Label}工艺过程，监控关键指标，确保工艺参数在合理范围内`,
                upstreamNodes: j > 0 ? [createRelatedNode(l3Nodes[j - 1].id, l3Nodes[j - 1].label)] : [createRelatedNode(l2Id, l2Label)],
                downstreamNodes: j < l3Config.length - 1 ? [createRelatedNode(
                    (typeof l3Config[j + 1] === 'object' && l3Config[j + 1] !== null && 'id' in l3Config[j + 1])
                        ? (l3Config[j + 1] as any).id
                        : `${l2Id}_l3_${j + 1}`,
                    (typeof l3Config[j + 1] === 'object' && l3Config[j + 1] !== null && 'name' in l3Config[j + 1])
                        ? (l3Config[j + 1] as any).name
                        : l3Config[j + 1]
                )] : undefined,
                dataSource: getRandomDataSource(),
                dataFormat: getRandomFormat(),
                updateFrequency: getRandomFrequency(),
                pendingTasks: generatePendingTasks(l3Id, l3Label, 3)
            });
            links.push({ source: l2Id, target: l3Id, relation: '包含' });

            // Level 4: Parameters
            // L4 config key can be the ID (for object format) or the label (for string format)
            const parameters = config.l4[l3Id] || config.l4[l3Label] || (SCENARIO_CONFIGS[scenarioId] ? [] : [`${l3Label}_Param`]);
            const l4Nodes: { id: string; label: string }[] = [];
            parameters.forEach((l4Label, k) => {
                // L4 always uses generated IDs since they are Chinese labels
                const l4Id = `${l3Id}_l4_${k}`;
                l4Nodes.push({ id: l4Id, label: l4Label });
                // L4 (Raw Data) can have varying readiness
                nodes.push({
                    id: l4Id,
                    label: l4Label,
                    type: 'concept',
                    group: 4,
                    data_readiness: randStatus(40, 90),
                    owner: getRandomOwner(),
                    responsibility: `采集和预处理${l4Label}数据，确保数据质量和时效性`,
                    upstreamNodes: [createRelatedNode(l3Id, l3Label)],
                    downstreamNodes: k < parameters.length - 1 ? [createRelatedNode(
                        `${l3Id}_l4_${k + 1}`,
                        parameters[k + 1]
                    )] : undefined,
                    dataSource: getRandomDataSource(),
                    dataFormat: getRandomFormat(),
                    updateFrequency: ['实时', '每分钟', '每小时'][Math.floor(Math.random() * 3)],
                    pendingTasks: generatePendingTasks(l4Id, l4Label, 4)
                });
                links.push({ source: l3Id, target: l4Id, relation: '监控' });
            });
        });
    });

    // Level 5: Skills
    // Connect skills to relevant L4 nodes if possible, or L3 if no L4 matches, or random L3/L4 as fallback
    // For specific scenarios, we try to match names, otherwise attach to the last generated nodes
    const l4Nodes = nodes.filter(n => n.group === 4);
    const l3Nodes = nodes.filter(n => n.group === 3);
    const targetNodes = l4Nodes.length > 0 ? l4Nodes : l3Nodes;

    skillIds.forEach((sid, idx) => {
        const skill = MOCK_SKILLS.find(s => s.skill_id === sid);
        if (skill && targetNodes.length > 0) {
            // Intelligent linking could go here, for now we attach to nodes to ensure graph connectivity
            // Use modulo to distribute skills if multiple
            const targetNode = targetNodes[idx % targetNodes.length];

            nodes.push({
                id: skill.skill_id,
                label: skill.name,
                type: 'skill',
                group: 5,
                data_readiness: 100, // Skills themselves are "ready"
                owner: getRandomOwner(),
                responsibility: `提供${skill.name}智能算法服务，分析输入数据并输出预测/控制结果，支持业务决策`,
                upstreamNodes: [targetNode.id],
                dataSourceFormat: 'API接口',
                updateFrequency: '实时调用',
                pendingTasks: [
                  {
                    id: `task_skill_${sid}_1`,
                    title: '模型性能监控',
                    description: '监控模型预测准确率，触发重训练流程',
                    priority: 'high',
                    status: 'pending',
                    dueDate: '2024-03-15',
                    assignee: getRandomOwner()
                  },
                  {
                    id: `task_skill_${sid}_2`,
                    title: '算法版本更新',
                    description: '升级到最新模型版本',
                    priority: 'medium',
                    status: 'in_progress',
                    assignee: getRandomOwner()
                  }
                ]
            });
            links.push({ source: targetNode.id, target: skill.skill_id, relation: '赋能' });
        }
    });

    return { nodes, links };
};

export const SCENARIO_ONTOLOGY_MAP: Record<string, OntologyData> = {
  'raw_material': generateSpecificGraph('raw_material', '原材料管理', ['material_purity_check_v2']),
  'mixing': generateSpecificGraph('mixing', '搅拌制浆', ['viscosity_prediction_v3']),
  'coating': generateSpecificGraph('coating', '涂布工艺', ['coating_thickness_loop_v1']),
  'calendaring': generateSpecificGraph('calendaring', '辊压工艺', ['roller_pressure_opt_v2']),
  'slitting': generateSpecificGraph('slitting', '分切工艺', []), 
  'winding': generateSpecificGraph('winding', '卷绕叠片', ['tension_control_algo_v1']),
  'assembly': generateSpecificGraph('assembly', '组装焊接', []),
  'baking_injection': generateSpecificGraph('baking_injection', '烘烤注液', ['electrolyte_soaking_pred_v1']),
  'formation': generateSpecificGraph('formation', '化成分容', ['capacity_prediction_v5']),
  'pack': generateSpecificGraph('pack', '模组Pack', ['thermal_runaway_warning_v2']),
  'production_planning': generateSpecificGraph('production_planning', '产销计划 (S&OP)', ['sop_balancer_v1', 'inventory_turnover_opt_v2']),
  'predictive_maintenance': generateSpecificGraph('predictive_maintenance', '设备预测性维护', ['equipment_rul_pred_v2']),
  'breakdown_maintenance': generateSpecificGraph('breakdown_maintenance', '设备故障维修', ['repair_time_estimator_v1']),
  'cost_management': generateSpecificGraph('cost_management', '经营成本管理', ['cost_realtime_analyzer_v1', 'energy_consumption_audit_v1']),
  'production_sales_match': generateSpecificGraph('production_sales_match', '产销匹配协同', [
    'demand_forecast_v3', 'capacity_evaluation_v2', 'smart_scheduling_v4', 'inventory_optimization_v3',
    'supply_chain_collab_v2', 'order_fulfillment_tracking_v2', 'logistics_optimization_v2', 'production_sales_alert_v1'
  ]),
  'new_project_planning': generateSpecificGraph('new_project_planning', '新项目落地推演分析', [
    'capacity_evaluation_v2', 'cost_realtime_analyzer_v1', 'npv_calculator_v1', 'location_optimizer_v1',
    'risk_simulator_v1', 'market_forecast_v2', 'capex_analyzer_v1', 'sensitivity_analysis_v1'
  ]),
  'capacity_assessment_prediction': generateSpecificGraph('capacity_assessment_prediction', '产能评估推演预测分析', [
    'capacity_evaluation_v2', 'demand_forecast_v3', 'oee_analyzer_v1', 'bottleneck_identifier_v1',
    'equipment_health_monitor_v1', 'roi_calculator_v1', 'production_simulator_v1', 'risk_assessor_v1'
  ]),
};

export const RECENT_EXECUTIONS: ExecutionLog[] = [
  { id: "exec_1001", timestamp: "2023-10-25 10:30:00", task_text: "检测涂布机A台面密度异常", status: "success", skills_used: ["coating_thickness_loop_v1"], duration: 120, result_summary: "调整+2um" },
  { id: "exec_1002", timestamp: "2023-10-25 10:35:12", task_text: "分析批次B203的化成容量数据", status: "success", skills_used: ["capacity_prediction_v5"], duration: 980, result_summary: "预测均值 102Ah" },
  { id: "exec_1003", timestamp: "2023-10-25 11:05:00", task_text: "Pack线热失控风险扫描", status: "failed", skills_used: ["thermal_runaway_warning_v2"], duration: 45, result_summary: "传感器离线" },
  { id: "exec_1004", timestamp: "2023-10-25 13:10:00", task_text: "估算卷绕机#3主轴故障修复时间", status: "success", skills_used: ["repair_time_estimator_v1"], duration: 85, result_summary: "预计45分钟 (专家:张工)" },
  { id: "exec_1005", timestamp: "2023-10-25 13:45:00", task_text: "核算产线A的单瓦时制造成本", status: "success", skills_used: ["cost_realtime_analyzer_v1"], duration: 420, result_summary: "0.34 元/Wh" },
];

// ==================== 推演分析节点配置 ====================
// 定义哪些业务流程节点支持推演分析功能

export const SIMULATION_NODES: import('./types').SimulationNodeConfig[] = [
  // ========== 新项目落地推演分析节点 ==========
  {
    nodeId: 'strategic_decision',
    nodeName: '战略决策',
    scenarioId: 'new_project_planning',
    category: 'investment_decision',
    description: '基于市场分析和财务测算进行投资决策推演',
    inputParams: [
      { id: 'market_growth_rate', name: '市场增长率', description: '目标市场年复合增长率', dataType: 'number', required: true, unit: '%', defaultValue: 15 },
      { id: 'investment_scale', name: '投资规模', description: '项目总投资金额', dataType: 'number', required: true, unit: '亿元' },
      { id: 'payback_period', name: '预期回收期', description: '投资回收期要求', dataType: 'number', required: true, unit: '年', defaultValue: 5 },
      { id: 'strategic_priority', name: '战略优先级', description: '项目战略重要性评分', dataType: 'number', required: true, unit: '分', defaultValue: 8 },
    ],
    outputMetrics: ['决策得分', '战略匹配度', '投资优先级'],
    supportedSkills: ['market_forecast_v1', 'npv_calculator_v1', 'risk_assessor_v1']
  },
  {
    nodeId: 'site_selection',
    nodeName: '选址评估',
    scenarioId: 'new_project_planning',
    category: 'investment_decision',
    description: '评估不同选址方案的综合优劣势',
    inputParams: [
      { id: 'land_cost', name: '土地成本', description: '单位土地成本', dataType: 'number', required: true, unit: '元/㎡' },
      { id: 'logistics_distance', name: '物流距离', description: '距主要客户平均距离', dataType: 'number', required: true, unit: 'km' },
      { id: 'labor_availability', name: '劳动力可得性', description: '当地劳动力供给评分', dataType: 'number', required: true, unit: '分', defaultValue: 7 },
      { id: 'policy_support', name: '政策支持力度', description: '地方政府政策支持评分', dataType: 'number', required: true, unit: '分', defaultValue: 8 },
    ],
    outputMetrics: ['选址综合评分', '成本指数', '供应链效率指数'],
    supportedSkills: ['site_evaluator_v1', 'logistics_optimizer_v1']
  },
  {
    nodeId: 'financial_profitability',
    nodeName: '盈利能力分析',
    scenarioId: 'new_project_planning',
    category: 'financial_analysis',
    description: '评估项目财务可行性和盈利能力',
    inputParams: [
      { id: 'revenue_forecast', name: '收入预测', description: '年度收入预测', dataType: 'number', required: true, unit: '亿元' },
      { id: 'capex', name: '资本支出', description: '初始资本支出', dataType: 'number', required: true, unit: '亿元' },
      { id: 'opex_ratio', name: '运营成本率', description: '运营成本占收入比例', dataType: 'number', required: true, unit: '%', defaultValue: 75 },
      { id: 'discount_rate', name: '折现率', description: '项目折现率', dataType: 'number', required: true, unit: '%', defaultValue: 10 },
    ],
    outputMetrics: ['NPV', 'IRR', '投资回收期', 'ROIC'],
    supportedSkills: ['npv_calculator_v1', 'financial_model_v1']
  },
  {
    nodeId: 'risk_assessment',
    nodeName: '风险评估',
    scenarioId: 'new_project_planning',
    category: 'risk_assessment',
    description: '识别和量化项目潜在风险',
    inputParams: [
      { id: 'market_volatility', name: '市场波动率', description: '市场需求波动程度', dataType: 'number', required: true, unit: '%', defaultValue: 20 },
      { id: 'technology_maturity', name: '技术成熟度', description: '技术成熟度评分', dataType: 'number', required: true, unit: '分', defaultValue: 8 },
      { id: 'regulatory_risk', name: '政策风险', description: '政策变化风险评分', dataType: 'number', required: true, unit: '分', defaultValue: 5 },
      { id: 'competition_intensity', name: '竞争强度', description: '市场竞争激烈程度', dataType: 'number', required: true, unit: '分', defaultValue: 7 },
    ],
    outputMetrics: ['综合风险指数', '市场风险', '技术风险', '财务风险'],
    supportedSkills: ['risk_assessor_v1', 'scenario_analyzer_v1']
  },

  // ========== 产能评估推演预测分析节点 ==========
  {
    nodeId: 'current_capacity',
    nodeName: '现有产能评估',
    scenarioId: 'capacity_assessment_prediction',
    category: 'capacity_planning',
    description: '评估现有产线产能状况和瓶颈',
    inputParams: [
      { id: 'current_oee', name: '当前OEE', description: '设备综合效率', dataType: 'number', required: true, unit: '%', defaultValue: 85 },
      { id: 'daily_operating_hours', name: '日运行小时', description: '产线日运行时间', dataType: 'number', required: true, unit: '小时', defaultValue: 22 },
      { id: 'planned_downtime', name: '计划停机时间', description: '月度计划维护时间', dataType: 'number', required: true, unit: '小时', defaultValue: 48 },
      { id: 'product_mix', name: '产品组合', description: '各产品型号占比', dataType: 'string', required: true },
    ],
    outputMetrics: ['理论产能', '有效产能', '产能利用率', '瓶颈工序'],
    supportedSkills: ['oee_analyzer_v1', 'bottleneck_identifier_v1', 'capacity_calculator_v1']
  },
  {
    nodeId: 'capacity_expansion',
    nodeName: '产能扩展潜力',
    scenarioId: 'capacity_assessment_prediction',
    category: 'capacity_planning',
    description: '分析产能扩展潜力和扩产方案',
    inputParams: [
      { id: 'expansion_capacity', name: '扩产容量', description: '计划扩产容量', dataType: 'number', required: true, unit: 'GWh' },
      { id: 'unit_investment_cost', name: '单位投资成本', description: '单位产能投资成本', dataType: 'number', required: true, unit: '亿元/GWh' },
      { id: 'construction_period', name: '建设周期', description: '产能建设周期', dataType: 'number', required: true, unit: '月', defaultValue: 18 },
      { id: 'demand_growth_scenario', name: '需求增长情景', description: '需求增长预测情景', dataType: 'string', required: true, defaultValue: '基准情景' },
    ],
    outputMetrics: ['扩产潜力', '投资NPV', 'IRR', '投资回收期'],
    supportedSkills: ['investment_optimizer_v1', 'timeline_planner_v1']
  },
  {
    nodeId: 'investment_decision',
    nodeName: '投资决策推演',
    scenarioId: 'capacity_assessment_prediction',
    category: 'investment_decision',
    description: '产能扩建投资决策分析',
    inputParams: [
      { id: 'capex_amount', name: '资本支出', description: '总投资金额', dataType: 'number', required: true, unit: '亿元' },
      { id: 'financing_rate', name: '融资成本', description: '年化融资成本', dataType: 'number', required: true, unit: '%', defaultValue: 5 },
      { id: 'tax_rate', name: '税率', description: '企业所得税率', dataType: 'number', required: true, unit: '%', defaultValue: 25 },
      { id: 'project_lifecycle', name: '项目周期', description: '项目运营周期', dataType: 'number', required: true, unit: '年', defaultValue: 10 },
    ],
    outputMetrics: ['投资NPV', 'IRR', '投资回收期', '产能达成率'],
    supportedSkills: ['investment_optimizer_v1', 'timeline_planner_v1']
  },
  {
    nodeId: 'risk_simulation',
    nodeName: '风险情景模拟',
    scenarioId: 'capacity_assessment_prediction',
    category: 'risk_assessment',
    description: '模拟不同风险情景下的产能表现',
    inputParams: [
      { id: 'risk_scenario', name: '风险情景', description: '选择模拟的风险情景', dataType: 'string', required: true, defaultValue: '基准情景' },
      { id: 'volatility_rate', name: '波动率', description: '市场需求波动率', dataType: 'number', required: true, unit: '%', defaultValue: 15 },
      { id: 'confidence_level', name: '置信水平', description: '统计置信水平', dataType: 'number', required: true, unit: '%', defaultValue: 95 },
    ],
    outputMetrics: ['风险值VaR', '情景概率', '预期损失', '应对建议'],
    supportedSkills: ['risk_assessor_v1', 'scenario_analyzer_v1']
  },

  // ========== 产销匹配协同推演节点 ==========
  {
    nodeId: 'demand_forecast',
    nodeName: '需求预测',
    scenarioId: 'production_sales_match',
    category: 'demand_forecast',
    description: '基于历史数据和市场信息进行需求预测',
    inputParams: [
      { id: 'historical_orders', name: '历史订单数据', description: '过去12个月订单数据', dataType: 'file', required: true, source: 'file_import' },
      { id: 'seasonality_factor', name: '季节性因子', description: '需求季节性波动系数', dataType: 'number', required: true, unit: '%', defaultValue: 15 },
      { id: 'market_growth', name: '市场增长率', description: '预期市场增长率', dataType: 'number', required: true, unit: '%', defaultValue: 20 },
      { id: 'customer_forecast', name: '客户预测', description: '大客户提供的预测数据', dataType: 'file', required: false, source: 'file_import' },
    ],
    outputMetrics: ['预测准确度', '月度需求量', '季度趋势'],
    supportedSkills: ['demand_forecast_v1', 'seasonality_analyzer_v1']
  },
  {
    nodeId: 'capacity_planning',
    nodeName: '产能规划',
    scenarioId: 'production_sales_match',
    category: 'production_scheduling',
    description: '平衡需求与产能，制定生产计划',
    inputParams: [
      { id: 'forecasted_demand', name: '预测需求', description: '各产品预测需求量', dataType: 'number', required: true, unit: 'MWh' },
      { id: 'available_capacity', name: '可用产能', description: '各产线可用产能', dataType: 'number', required: true, unit: 'MWh' },
      { id: 'priority_rules', name: '优先级规则', description: '订单优先级规则', dataType: 'string', required: true },
      { id: 'changeover_time', name: '换型时间', description: '产品换型所需时间', dataType: 'number', required: true, unit: '小时', defaultValue: 4 },
    ],
    outputMetrics: ['产能利用率', '订单满足率', '换型次数', '生产计划'],
    supportedSkills: ['aps_optimizer_v1', 'scheduler_v1']
  },
  {
    nodeId: 'inventory_management',
    nodeName: '库存管理',
    scenarioId: 'production_sales_match',
    category: 'supply_chain',
    description: '优化成品和原材料库存水平',
    inputParams: [
      { id: 'current_inventory', name: '当前库存', description: '各物料当前库存量', dataType: 'file', required: true, source: 'file_import' },
      { id: 'service_level_target', name: '服务水平目标', description: '目标订单满足率', dataType: 'number', required: true, unit: '%', defaultValue: 95 },
      { id: 'holding_cost_rate', name: '库存持有成本率', description: '年度库存持有成本比例', dataType: 'number', required: true, unit: '%', defaultValue: 15 },
      { id: 'stockout_cost', name: '缺货成本', description: '单位缺货成本', dataType: 'number', required: true, unit: '元/件' },
    ],
    outputMetrics: ['最优库存水平', '库存周转天数', '库存成本', '缺货风险'],
    supportedSkills: ['inventory_optimizer_v1', 'safety_stock_calculator_v1']
  },
];

// 根据节点ID获取推演配置
export function getSimulationConfig(nodeId: string): import('./types').SimulationNodeConfig | undefined {
  return SIMULATION_NODES.find(config => config.nodeId === nodeId);
}

// 判断节点是否为推演分析节点
export function isSimulationNode(nodeId: string): boolean {
  return SIMULATION_NODES.some(config => config.nodeId === nodeId);
}

// ==================== 原子化业务语义库 ====================
// 企业统一的语义标准 - 不可再分的业务因子

export const ATOMIC_ONTOLOGY_LIBRARY: AtomicOntology[] = [
  // 物理量
  {
    id: 'atom_temperature',
    name: '温度',
    description: '物理环境的温度测量值',
    category: 'physical',
    dataType: 'number',
    unit: '°C',
    constraints: { min: -273.15, max: 10000 },
    tags: ['物理', '环境', '热力学'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_pressure',
    name: '压力',
    description: '气体或液体的压力值',
    category: 'physical',
    dataType: 'number',
    unit: 'Pa',
    constraints: { min: 0, max: 100000000 },
    tags: ['物理', '流体', '力学'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_vibration_frequency',
    name: '振动频率',
    description: '机械振动的频率',
    category: 'physical',
    dataType: 'number',
    unit: 'Hz',
    constraints: { min: 0, max: 100000 },
    tags: ['物理', '振动', '机械'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_vibration_amplitude',
    name: '振动幅度',
    description: '机械振动的幅度',
    category: 'physical',
    dataType: 'number',
    unit: 'mm',
    constraints: { min: 0, max: 1000 },
    tags: ['物理', '振动', '机械'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_thickness',
    name: '厚度',
    description: '物体厚度测量值',
    category: 'physical',
    dataType: 'number',
    unit: 'μm',
    constraints: { min: 0, max: 100000 },
    tags: ['物理', '尺寸', '几何'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // 化学量
  {
    id: 'atom_purity',
    name: '纯度',
    description: '物质的纯度百分比',
    category: 'chemical',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['化学', '质量', '成分'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_ph_value',
    name: 'PH值',
    description: '酸碱度测量值',
    category: 'chemical',
    dataType: 'number',
    unit: 'pH',
    constraints: { min: 0, max: 14 },
    tags: ['化学', '酸碱度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_viscosity',
    name: '粘度',
    description: '流体粘度',
    category: 'chemical',
    dataType: 'number',
    unit: 'Pa·s',
    constraints: { min: 0, max: 1000000 },
    tags: ['化学', '流体', '物理性质'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_moisture_content',
    name: '水分含量',
    description: '物质中水分的含量',
    category: 'chemical',
    dataType: 'number',
    unit: 'ppm',
    constraints: { min: 0, max: 1000000 },
    tags: ['化学', '湿度', '质量'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // 时间量
  {
    id: 'atom_duration',
    name: '持续时间',
    description: '过程或操作的持续时间',
    category: 'temporal',
    dataType: 'number',
    unit: 's',
    constraints: { min: 0, max: 3153600000 },
    tags: ['时间', '周期'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_frequency',
    name: '频率',
    description: '事件发生的频率',
    category: 'temporal',
    dataType: 'number',
    unit: 'Hz',
    constraints: { min: 0, max: 1000000000 },
    tags: ['时间', '速率'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_timestamp',
    name: '时间戳',
    description: '事件发生的具体时间点',
    category: 'temporal',
    dataType: 'datetime',
    tags: ['时间', '记录'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // 财务量
  {
    id: 'atom_cost',
    name: '成本',
    description: '生产或运营成本',
    category: 'financial',
    dataType: 'number',
    unit: 'CNY',
    constraints: { min: 0 },
    tags: ['财务', '成本', '经济'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_unit_cost',
    name: '单位成本',
    description: '单位产品成本',
    category: 'financial',
    dataType: 'number',
    unit: 'CNY/unit',
    constraints: { min: 0 },
    tags: ['财务', '成本', '单位'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_energy_cost',
    name: '能耗成本',
    description: '能源消耗成本',
    category: 'financial',
    dataType: 'number',
    unit: 'CNY',
    constraints: { min: 0 },
    tags: ['财务', '能耗', '成本'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_inventory_value',
    name: '库存价值',
    description: '库存物资价值',
    category: 'financial',
    dataType: 'number',
    unit: 'CNY',
    constraints: { min: 0 },
    tags: ['财务', '库存', '资产'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // 物流量
  {
    id: 'atom_inventory_days',
    name: '库存天数',
    description: '库存可维持的天数',
    category: 'logistical',
    dataType: 'number',
    unit: 'days',
    constraints: { min: 0 },
    tags: ['物流', '库存', '周转'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_turnover_rate',
    name: '周转率',
    description: '库存周转速度',
    category: 'logistical',
    dataType: 'number',
    unit: '次/年',
    constraints: { min: 0 },
    tags: ['物流', '库存', '效率'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_delivery_time',
    name: '配送时间',
    description: '从订单到交付的时间',
    category: 'logistical',
    dataType: 'number',
    unit: 'hours',
    constraints: { min: 0 },
    tags: ['物流', '配送', '时间'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_quantity',
    name: '数量',
    description: '物品的数量',
    category: 'logistical',
    dataType: 'number',
    unit: 'pcs',
    constraints: { min: 0 },
    tags: ['物流', '计数'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // 质量量
  {
    id: 'atom_defect_rate',
    name: '缺陷率',
    description: '产品缺陷百分比',
    category: 'quality',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['质量', '缺陷', '百分比'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_yield_rate',
    name: '良品率',
    description: '产品合格百分比',
    category: 'quality',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['质量', '合格', '百分比'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_precision',
    name: '精度',
    description: '加工或测量精度',
    category: 'quality',
    dataType: 'number',
    unit: 'mm',
    constraints: { min: 0 },
    tags: ['质量', '精度', '尺寸'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_surface_roughness',
    name: '表面粗糙度',
    description: '表面光洁度',
    category: 'quality',
    dataType: 'number',
    unit: 'Ra',
    constraints: { min: 0 },
    tags: ['质量', '表面', '粗糙度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // 运营量
  {
    id: 'atom_capacity',
    name: '产能',
    description: '生产能力',
    category: 'operational',
    dataType: 'number',
    unit: 'units/hour',
    constraints: { min: 0 },
    tags: ['运营', '产能', '效率'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_oee',
    name: 'OEE',
    description: '设备综合效率',
    category: 'operational',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['运营', '设备', '效率'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_utilization_rate',
    name: '利用率',
    description: '资源利用率',
    category: 'operational',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['运营', '效率', '利用'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_mttr',
    name: 'MTTR',
    description: '平均修复时间',
    category: 'operational',
    dataType: 'number',
    unit: 'minutes',
    constraints: { min: 0 },
    tags: ['运营', '维护', '时间'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_mtbf',
    name: 'MTBF',
    description: '平均故障间隔时间',
    category: 'operational',
    dataType: 'number',
    unit: 'hours',
    constraints: { min: 0 },
    tags: ['运营', '可靠性', '时间'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ==================== 锂电制造专用原子业务语义 ====================

  // === 电性能 (electrical) ===
  {
    id: 'atom_voltage',
    name: '电压',
    description: '电池电压或极片电位',
    category: 'electrical',
    dataType: 'number',
    unit: 'V',
    constraints: { min: 0, max: 5 },
    tags: ['电性能', '电池', '电压'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_current',
    name: '电流',
    description: '充放电电流',
    category: 'electrical',
    dataType: 'number',
    unit: 'A',
    constraints: { min: -1000, max: 1000 },
    tags: ['电性能', '电流', '充放电'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_resistance',
    name: '内阻',
    description: '电池交流内阻或直流内阻',
    category: 'electrical',
    dataType: 'number',
    unit: 'mΩ',
    constraints: { min: 0, max: 100 },
    tags: ['电性能', '内阻', '电池'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_capacity',
    name: '容量',
    description: '电池额定容量或实际容量',
    category: 'electrical',
    dataType: 'number',
    unit: 'Ah',
    constraints: { min: 0, max: 10000 },
    tags: ['电性能', '容量', '电池'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_energy_density',
    name: '能量密度',
    description: '质量能量密度或体积能量密度',
    category: 'electrical',
    dataType: 'number',
    unit: 'Wh/kg',
    constraints: { min: 0, max: 500 },
    tags: ['电性能', '能量密度', '电池'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_power_density',
    name: '功率密度',
    description: '质量功率密度',
    category: 'electrical',
    dataType: 'number',
    unit: 'W/kg',
    constraints: { min: 0, max: 20000 },
    tags: ['电性能', '功率密度', '电池'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_soc',
    name: 'SOC',
    description: '电池荷电状态(State of Charge)',
    category: 'electrical',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['电性能', 'SOC', '电池状态'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_soh',
    name: 'SOH',
    description: '电池健康状态(State of Health)',
    category: 'electrical',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['电性能', 'SOH', '电池健康'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_coulombic_efficiency',
    name: '库伦效率',
    description: '充放电库伦效率',
    category: 'electrical',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['电性能', '效率', '电池'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_self_discharge',
    name: '自放电率',
    description: '电池自放电速率',
    category: 'electrical',
    dataType: 'number',
    unit: '%/月',
    constraints: { min: 0, max: 100 },
    tags: ['电性能', '自放电', '电池'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // === 材料特性 (material) ===
  {
    id: 'atom_particle_size',
    name: '粒径(D50)',
    description: '材料中位粒径',
    category: 'material',
    dataType: 'number',
    unit: 'μm',
    constraints: { min: 0, max: 100 },
    tags: ['材料', '粒径', '正极', '负极'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_specific_surface',
    name: '比表面积',
    description: '材料单位质量的表面积',
    category: 'material',
    dataType: 'number',
    unit: 'm²/g',
    constraints: { min: 0, max: 100 },
    tags: ['材料', '比表面积', '正极', '负极'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_tap_density',
    name: '振实密度',
    description: '材料振实后的密度',
    category: 'material',
    dataType: 'number',
    unit: 'g/cm³',
    constraints: { min: 0, max: 10 },
    tags: ['材料', '密度', '正极', '负极'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_bulk_density',
    name: '松装密度',
    description: '材料自然堆积密度',
    category: 'material',
    dataType: 'number',
    unit: 'g/cm³',
    constraints: { min: 0, max: 10 },
    tags: ['材料', '密度', '正极', '负极'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_moisture_content_ppm',
    name: '水分含量(PPM)',
    description: '材料中微量水分含量',
    category: 'material',
    dataType: 'number',
    unit: 'ppm',
    constraints: { min: 0, max: 10000 },
    tags: ['材料', '水分', '正极', '负极', '电解液'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_magnetic_impurities',
    name: '磁性异物',
    description: '材料中磁性杂质含量',
    category: 'material',
    dataType: 'number',
    unit: 'ppb',
    constraints: { min: 0, max: 100000 },
    tags: ['材料', '杂质', '正极', '安全'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_electrolyte_conductivity',
    name: '电解液电导率',
    description: '电解液离子电导率',
    category: 'material',
    dataType: 'number',
    unit: 'mS/cm',
    constraints: { min: 0, max: 20 },
    tags: ['材料', '电解液', '电导率'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_electrolyte_density',
    name: '电解液密度',
    description: '电解液质量密度',
    category: 'material',
    dataType: 'number',
    unit: 'g/cm³',
    constraints: { min: 0.5, max: 2 },
    tags: ['材料', '电解液', '密度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_separator_porosity',
    name: '隔膜孔隙率',
    description: '隔膜孔隙体积占比',
    category: 'material',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['材料', '隔膜', '孔隙'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_separator_thickness',
    name: '隔膜厚度',
    description: '隔膜基材厚度',
    category: 'material',
    dataType: 'number',
    unit: 'μm',
    constraints: { min: 1, max: 50 },
    tags: ['材料', '隔膜', '厚度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_active_material_ratio',
    name: '活性物质比例',
    description: '极片中活性物质质量占比',
    category: 'material',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['材料', '极片', '配方'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // === 工艺参数 (process) ===
  {
    id: 'atom_slurry_viscosity',
    name: '浆料粘度',
    description: '搅拌后浆料的粘度',
    category: 'process',
    dataType: 'number',
    unit: 'mPa·s',
    constraints: { min: 0, max: 50000 },
    tags: ['工艺', '搅拌', '浆料', '粘度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_slurry_solid_content',
    name: '浆料固含量',
    description: '浆料中固体物质质量占比',
    category: 'process',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['工艺', '搅拌', '浆料', '固含量'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_slurry_fineness',
    name: '浆料细度',
    description: '浆料中颗粒细度',
    category: 'process',
    dataType: 'number',
    unit: 'μm',
    constraints: { min: 0, max: 100 },
    tags: ['工艺', '搅拌', '浆料', '细度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_coating_speed',
    name: '涂布速度',
    description: '极片涂布线速度',
    category: 'process',
    dataType: 'number',
    unit: 'm/min',
    constraints: { min: 0, max: 200 },
    tags: ['工艺', '涂布', '速度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_areal_density',
    name: '面密度',
    description: '极片单位面积质量',
    category: 'process',
    dataType: 'number',
    unit: 'mg/cm²',
    constraints: { min: 0, max: 100 },
    tags: ['工艺', '涂布', '面密度', '质量'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_calendering_pressure',
    name: '辊压压力',
    description: '极片辊压线压力',
    category: 'process',
    dataType: 'number',
    unit: 'T/m',
    constraints: { min: 0, max: 200 },
    tags: ['工艺', '辊压', '压力'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_calendering_gaps',
    name: '辊缝间隙',
    description: '辊压时上下辊间隙',
    category: 'process',
    dataType: 'number',
    unit: 'μm',
    constraints: { min: 0, max: 1000 },
    tags: ['工艺', '辊压', '间隙'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_electrode_density',
    name: '极片压实密度',
    description: '辊压后极片密度',
    category: 'process',
    dataType: 'number',
    unit: 'g/cm³',
    constraints: { min: 0, max: 5 },
    tags: ['工艺', '辊压', '密度', '极片'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_slitting_width',
    name: '分切宽度',
    description: '极片分切后宽度',
    category: 'process',
    dataType: 'number',
    unit: 'mm',
    constraints: { min: 0, max: 1000 },
    tags: ['工艺', '分切', '宽度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_burr_height',
    name: '毛刺高度',
    description: '分切后极片边缘毛刺高度',
    category: 'process',
    dataType: 'number',
    unit: 'μm',
    constraints: { min: 0, max: 50 },
    tags: ['工艺', '分切', '毛刺', '安全'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_winding_tension',
    name: '卷绕张力',
    description: '极片卷绕时的张力',
    category: 'process',
    dataType: 'number',
    unit: 'N',
    constraints: { min: 0, max: 500 },
    tags: ['工艺', '卷绕', '张力'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_alignment_accuracy',
    name: '对齐度',
    description: '正负极片对齐精度',
    category: 'process',
    dataType: 'number',
    unit: 'mm',
    constraints: { min: 0, max: 10 },
    tags: ['工艺', '卷绕', '叠片', '对齐'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_overhang',
    name: 'Overhang',
    description: '负极超出正极的长度',
    category: 'process',
    dataType: 'number',
    unit: 'mm',
    constraints: { min: 0, max: 10 },
    tags: ['工艺', '卷绕', '叠片', '安全'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_electrolyte_injection',
    name: '注液量',
    description: '单电芯注液量',
    category: 'process',
    dataType: 'number',
    unit: 'g',
    constraints: { min: 0, max: 1000 },
    tags: ['工艺', '注液', '电解液'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_formation_voltage',
    name: '化成电压',
    description: '化成工艺截止电压',
    category: 'process',
    dataType: 'number',
    unit: 'V',
    constraints: { min: 0, max: 5 },
    tags: ['工艺', '化成', '电压'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_formation_current',
    name: '化成电流',
    description: '化成工艺电流',
    category: 'process',
    dataType: 'number',
    unit: 'A',
    constraints: { min: 0, max: 100 },
    tags: ['工艺', '化成', '电流'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_aging_time',
    name: '老化时间',
    description: '高温或常温老化时间',
    category: 'process',
    dataType: 'number',
    unit: 'h',
    constraints: { min: 0, max: 720 },
    tags: ['工艺', '化成', '老化', '时间'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // === 环境参数 (environmental) ===
  {
    id: 'atom_dew_point',
    name: '露点温度',
    description: '环境空气露点温度',
    category: 'environmental',
    dataType: 'number',
    unit: '°C',
    constraints: { min: -100, max: 50 },
    tags: ['环境', '湿度', '露点', '干燥'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_cleanliness',
    name: '洁净度',
    description: '车间空气洁净度等级',
    category: 'environmental',
    dataType: 'string',
    constraints: { enum: ['Class 100', 'Class 1000', 'Class 10000', 'Class 100000'] },
    tags: ['环境', '洁净度', '车间'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_ambient_humidity',
    name: '环境湿度',
    description: '环境相对湿度',
    category: 'environmental',
    dataType: 'number',
    unit: '%RH',
    constraints: { min: 0, max: 100 },
    tags: ['环境', '湿度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_dust_particles',
    name: '粉尘颗粒数',
    description: '单位体积空气中粉尘颗粒数',
    category: 'environmental',
    dataType: 'number',
    unit: '个/m³',
    constraints: { min: 0 },
    tags: ['环境', '粉尘', '洁净度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // === 安全参数 (safety) ===
  {
    id: 'atom_temperature_rise',
    name: '温升',
    description: '电池工作温升',
    category: 'safety',
    dataType: 'number',
    unit: '°C',
    constraints: { min: 0, max: 100 },
    tags: ['安全', '温度', '热失控'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_gas_concentration',
    name: '气体浓度',
    description: '电解液挥发气体或产气浓度',
    category: 'safety',
    dataType: 'number',
    unit: 'ppm',
    constraints: { min: 0 },
    tags: ['安全', '气体', '泄漏'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_short_circuit_current',
    name: '短路电流',
    description: '电池短路时电流',
    category: 'safety',
    dataType: 'number',
    unit: 'A',
    constraints: { min: 0 },
    tags: ['安全', '短路', '电流'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_nail_penetration',
    name: '针刺通过率',
    description: '针刺安全测试通过率',
    category: 'safety',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['安全', '针刺', '测试'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_crush_resistance',
    name: '挤压通过率',
    description: '挤压安全测试通过率',
    category: 'safety',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['安全', '挤压', '测试'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // === 设备参数 (equipment) ===
  {
    id: 'atom_spindle_speed',
    name: '主轴转速',
    description: '设备主轴旋转速度',
    category: 'equipment',
    dataType: 'number',
    unit: 'rpm',
    constraints: { min: 0, max: 10000 },
    tags: ['设备', '转速', '主轴'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_tension_control',
    name: '张力控制精度',
    description: '设备张力控制精度',
    category: 'equipment',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['设备', '张力', '精度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_positioning_accuracy',
    name: '定位精度',
    description: '设备定位精度',
    category: 'equipment',
    dataType: 'number',
    unit: 'mm',
    constraints: { min: 0, max: 10 },
    tags: ['设备', '定位', '精度'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_motor_power',
    name: '电机功率',
    description: '设备电机功率',
    category: 'equipment',
    dataType: 'number',
    unit: 'kW',
    constraints: { min: 0, max: 1000 },
    tags: ['设备', '电机', '功率'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_equipment_oee',
    name: '设备OEE',
    description: '设备综合效率',
    category: 'equipment',
    dataType: 'number',
    unit: '%',
    constraints: { min: 0, max: 100 },
    tags: ['设备', 'OEE', '效率'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // === 产品规格 (product) ===
  {
    id: 'atom_cell_dimensions',
    name: '电芯尺寸',
    description: '电芯长宽厚尺寸',
    category: 'product',
    dataType: 'object',
    tags: ['产品', '电芯', '尺寸'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_cell_weight',
    name: '电芯重量',
    description: '电芯单体重量',
    category: 'product',
    dataType: 'number',
    unit: 'g',
    constraints: { min: 0, max: 10000 },
    tags: ['产品', '电芯', '重量'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_pack_voltage',
    name: 'Pack电压',
    description: '电池包额定电压',
    category: 'product',
    dataType: 'number',
    unit: 'V',
    constraints: { min: 0, max: 1000 },
    tags: ['产品', 'Pack', '电压'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_pack_capacity',
    name: 'Pack容量',
    description: '电池包额定容量',
    category: 'product',
    dataType: 'number',
    unit: 'Ah',
    constraints: { min: 0, max: 10000 },
    tags: ['产品', 'Pack', '容量'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_cycle_life',
    name: '循环寿命',
    description: '电池循环次数（容量保持80%）',
    category: 'product',
    dataType: 'number',
    unit: '次',
    constraints: { min: 0, max: 10000 },
    tags: ['产品', '寿命', '循环'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_voltage_consistency',
    name: '电压一致性',
    description: '电池包内单体电压差异',
    category: 'product',
    dataType: 'number',
    unit: 'mV',
    constraints: { min: 0, max: 1000 },
    tags: ['产品', 'Pack', '一致性', 'BMS'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'atom_temperature_consistency',
    name: '温度一致性',
    description: '电池包内温度差异',
    category: 'product',
    dataType: 'number',
    unit: '°C',
    constraints: { min: 0, max: 20 },
    tags: ['产品', 'Pack', '一致性', '热管理'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// 原子分类标签
export const ATOMIC_CATEGORIES = [
  // 通用分类
  { value: 'physical', label: '物理量', color: '#3b82f6', icon: 'Gauge', description: '温度、压力、振动等物理参数' },
  { value: 'chemical', label: '化学量', color: '#8b5cf6', icon: 'Beaker', description: '纯度、PH值、化学成分等' },
  { value: 'temporal', label: '时间量', color: '#06b6d4', icon: 'Clock', description: '周期、频率、持续时间等' },
  { value: 'financial', label: '财务量', color: '#10b981', icon: 'DollarSign', description: '成本、价格、利润率等' },
  { value: 'logistical', label: '物流量', color: '#f59e0b', icon: 'Package', description: '库存、周转率、配送时间等' },
  { value: 'quality', label: '质量量', color: '#ef4444', icon: 'CheckCircle', description: '合格率、缺陷率、精度等' },
  { value: 'operational', label: '运营量', color: '#6366f1', icon: 'Activity', description: '产能、OEE、利用率等' },
  // 锂电制造专用分类
  { value: 'electrical', label: '电性能', color: '#f59e0b', icon: 'Zap', description: '电压、电流、容量、内阻等电池电性能参数' },
  { value: 'material', label: '材料特性', color: '#14b8a6', icon: 'CircleDot', description: '粒径、比表面积、振实密度等材料参数' },
  { value: 'process', label: '工艺参数', color: '#ec4899', icon: 'Settings', description: '涂布速度、辊压压力、注液量等工艺参数' },
  { value: 'environmental', label: '环境参数', color: '#84cc16', icon: 'Cloud', description: '露点温度、洁净度、环境湿度等' },
  { value: 'safety', label: '安全参数', color: '#dc2626', icon: 'ShieldAlert', description: '温升、气体浓度、安全测试等' },
  { value: 'equipment', label: '设备参数', color: '#64748b', icon: 'Wrench', description: '主轴转速、张力、定位精度等设备参数' },
  { value: 'product', label: '产品规格', color: '#0ea5e9', icon: 'Box', description: '电芯尺寸、重量、循环寿命等产品参数' }
];

// ==================== 产销场景专用业务语义库 ====================
// 用于业务流程图谱倒推业务语义和技能

export interface BusinessSemanticDef {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'production' | 'inventory' | 'quality' | 'finance' | 'logistics' | 'customer' | 'planning';
  atoms: string[]; // 关联的业务释义ID
  skills: string[]; // 关联的技能ID
  processNodes: string[]; // 关联的业务流程节点ID
}

// 产销场景业务语义定义 - 36个原子业务语义
export const PRODUCTION_SALES_SEMANTICS: BusinessSemanticDef[] = [
  // === 销售类 (5个) ===
  {
    id: 'sem_sales_forecast',
    name: '销售预测',
    description: '基于历史数据和市场趋势预测未来销售量',
    category: 'sales',
    atoms: ['atom_quantity', 'atom_timestamp', 'atom_frequency', 'atom_energy_density', 'atom_capacity'],
    skills: ['demand_forecast_v3'],
    processNodes: ['demand_forecast', 'sales_planning']
  },
  {
    id: 'sem_order_management',
    name: '订单管理',
    description: '客户订单的接收、确认和跟踪管理',
    category: 'sales',
    atoms: ['atom_quantity', 'atom_timestamp', 'atom_delivery_time', 'atom_cost'],
    skills: ['order_fulfillment_tracking_v2'],
    processNodes: ['order_receive', 'order_confirm', 'delivery_commit']
  },
  {
    id: 'sem_price_management',
    name: '价格管理',
    description: '产品定价和价格策略管理',
    category: 'sales',
    atoms: ['atom_unit_cost', 'atom_cost', 'atom_energy_cost'],
    skills: ['cost_realtime_analyzer_v1'],
    processNodes: ['price_calc', 'price_adjust']
  },
  {
    id: 'sem_delivery_commitment',
    name: '交付承诺',
    description: '基于产能和库存向客户承诺交付日期',
    category: 'sales',
    atoms: ['atom_delivery_time', 'atom_quantity', 'atom_inventory_days'],
    skills: ['order_fulfillment_tracking_v2', 'smart_scheduling_v4'],
    processNodes: ['delivery_commit', 'delivery_confirm']
  },
  {
    id: 'sem_fulfillment_tracking',
    name: '履约跟踪',
    description: '跟踪订单从接收到交付的全流程',
    category: 'sales',
    atoms: ['atom_timestamp', 'atom_duration', 'atom_delivery_time'],
    skills: ['order_fulfillment_tracking_v2'],
    processNodes: ['order_receive', 'production_start', 'quality_check', 'delivery_confirm']
  },

  // === 生产类 (5个) ===
  {
    id: 'sem_capacity_planning',
    name: '产能规划',
    description: '评估和规划生产能力，识别瓶颈工序',
    category: 'production',
    atoms: ['atom_capacity', 'atom_oee', 'atom_utilization_rate', 'atom_duration'],
    skills: ['capacity_evaluation_v2', 'smart_scheduling_v4'],
    processNodes: ['capacity_eval', 'bottleneck_analysis', 'production_schedule']
  },
  {
    id: 'sem_production_scheduling',
    name: '生产排程',
    description: '综合考虑需求、产能、物料生成优化排程',
    category: 'production',
    atoms: ['atom_capacity', 'atom_duration', 'atom_timestamp', 'atom_utilization_rate'],
    skills: ['smart_scheduling_v4', 'sop_balancer_v1'],
    processNodes: ['production_schedule', 'material_plan', 'work_order_release']
  },
  {
    id: 'sem_work_order_mgmt',
    name: '工单管理',
    description: '生产工单的下达、执行和跟踪',
    category: 'production',
    atoms: ['atom_quantity', 'atom_timestamp', 'atom_duration'],
    skills: ['smart_scheduling_v4'],
    processNodes: ['work_order_create', 'work_order_execute', 'work_order_complete']
  },
  {
    id: 'sem_oee_monitoring',
    name: 'OEE监控',
    description: '设备综合效率的实时监控和分析',
    category: 'production',
    atoms: ['atom_oee', 'atom_utilization_rate', 'atom_mttr', 'atom_mtbf'],
    skills: ['equipment_rul_pred_v2'],
    processNodes: ['oee_calc', 'oee_analysis']
  },
  {
    id: 'sem_process_control',
    name: '工序控制',
    description: '关键工序的参数控制和优化',
    category: 'production',
    atoms: ['atom_temperature', 'atom_pressure', 'atom_thickness', 'atom_viscosity'],
    skills: ['coating_thickness_loop_v1', 'viscosity_prediction_v3'],
    processNodes: ['process_param_set', 'process_monitor', 'process_adjust']
  },

  // === 库存类 (5个) ===
  {
    id: 'sem_inventory_management',
    name: '库存管理',
    description: '原材料、在制品和成品库存管理',
    category: 'inventory',
    atoms: ['atom_quantity', 'atom_inventory_value', 'atom_inventory_days', 'atom_turnover_rate'],
    skills: ['inventory_optimization_v3', 'inventory_turnover_opt_v2'],
    processNodes: ['inventory_check', 'inventory_adjust', 'safety_stock_calc']
  },
  {
    id: 'sem_safety_stock',
    name: '安全库存',
    description: '基于需求波动和供应周期计算安全库存',
    category: 'inventory',
    atoms: ['atom_quantity', 'atom_delivery_time', 'atom_frequency'],
    skills: ['inventory_optimization_v3'],
    processNodes: ['safety_stock_calc', 'reorder_point_calc']
  },
  {
    id: 'sem_replenishment',
    name: '补货管理',
    description: '库存补货的触发时机和批量优化',
    category: 'inventory',
    atoms: ['atom_quantity', 'atom_inventory_days', 'atom_delivery_time'],
    skills: ['inventory_optimization_v3', 'supply_chain_collab_v2'],
    processNodes: ['replenishment_trigger', 'purchase_order_create']
  },
  {
    id: 'sem_vmi_management',
    name: 'VMI管理',
    description: '供应商管理库存的协同',
    category: 'inventory',
    atoms: ['atom_quantity', 'atom_inventory_days', 'atom_delivery_time'],
    skills: ['supply_chain_collab_v2'],
    processNodes: ['vmi_monitor', 'vmi_replenish']
  },
  {
    id: 'sem_wip_control',
    name: '在制品控制',
    description: '生产过程中的WIP数量控制',
    category: 'inventory',
    atoms: ['atom_quantity', 'atom_duration', 'atom_inventory_value'],
    skills: ['smart_scheduling_v4', 'inventory_optimization_v3'],
    processNodes: ['wip_monitor', 'wip_adjust']
  },

  // === 质量类 (4个) ===
  {
    id: 'sem_quality_control',
    name: '质量控制',
    description: '生产过程中的质量检验和控制',
    category: 'quality',
    atoms: ['atom_defect_rate', 'atom_yield_rate', 'atom_precision'],
    skills: ['quality_predict_v2'],
    processNodes: ['quality_check', 'defect_analysis', 'quality_report']
  },
  {
    id: 'sem_pass_rate_mgmt',
    name: '直通率管理',
    description: '产品一次直通率的监控和提升',
    category: 'quality',
    atoms: ['atom_yield_rate', 'atom_defect_rate'],
    skills: ['quality_predict_v2'],
    processNodes: ['pass_rate_calc', 'pass_rate_improve']
  },
  {
    id: 'sem_delivery_quality',
    name: '交付质量',
    description: '交付产品的质量和客户验收',
    category: 'quality',
    atoms: ['atom_yield_rate', 'atom_defect_rate', 'atom_precision'],
    skills: ['quality_predict_v2', 'order_fulfillment_tracking_v2'],
    processNodes: ['final_inspection', 'delivery_quality_check']
  },
  {
    id: 'sem_quality_alert',
    name: '质量预警',
    description: '质量异常的早期预警和处理',
    category: 'quality',
    atoms: ['atom_defect_rate', 'atom_yield_rate', 'atom_frequency'],
    skills: ['production_sales_alert_v1', 'quality_predict_v2'],
    processNodes: ['quality_monitor', 'alert_trigger', 'alert_handle']
  },

  // === 财务类 (5个) ===
  {
    id: 'sem_cost_calculation',
    name: '成本核算',
    description: '生产成本的实时核算和分析',
    category: 'finance',
    atoms: ['atom_cost', 'atom_unit_cost', 'atom_energy_cost'],
    skills: ['cost_realtime_analyzer_v1'],
    processNodes: ['cost_calc', 'cost_analysis']
  },
  {
    id: 'sem_profit_analysis',
    name: '利润分析',
    description: '产品利润率的计算和分析',
    category: 'finance',
    atoms: ['atom_cost', 'atom_unit_cost'],
    skills: ['cost_realtime_analyzer_v1'],
    processNodes: ['profit_calc', 'profit_analysis']
  },
  {
    id: 'sem_inventory_cost',
    name: '库存成本',
    description: '库存资金占用和持有成本',
    category: 'finance',
    atoms: ['atom_inventory_value', 'atom_cost'],
    skills: ['inventory_optimization_v3'],
    processNodes: ['inventory_cost_calc', 'inventory_value_monitor']
  },
  {
    id: 'sem_ar_management',
    name: '应收管理',
    description: '应收账款和回款管理',
    category: 'finance',
    atoms: ['atom_cost', 'atom_timestamp'],
    skills: ['order_fulfillment_tracking_v2'],
    processNodes: ['invoice_create', 'payment_track']
  },
  {
    id: 'sem_overdue_monitor',
    name: '逾期监控',
    description: '逾期账款和交付的监控预警',
    category: 'finance',
    atoms: ['atom_timestamp', 'atom_delivery_time'],
    skills: ['production_sales_alert_v1'],
    processNodes: ['overdue_check', 'overdue_alert']
  },

  // === 物流类 (4个) ===
  {
    id: 'sem_delivery_mgmt',
    name: '交付管理',
    description: '产品配送和交付时间管理',
    category: 'logistics',
    atoms: ['atom_delivery_time', 'atom_quantity', 'atom_timestamp'],
    skills: ['logistics_optimization_v2', 'order_fulfillment_tracking_v2'],
    processNodes: ['delivery_arrange', 'delivery_track', 'delivery_confirm']
  },
  {
    id: 'sem_logistics_cost',
    name: '物流成本',
    description: '运输和配送成本管理',
    category: 'logistics',
    atoms: ['atom_cost', 'atom_delivery_time'],
    skills: ['logistics_optimization_v2'],
    processNodes: ['logistics_cost_calc', 'route_optimize']
  },
  {
    id: 'sem_in_transit_track',
    name: '在途跟踪',
    description: '运输过程中的货物跟踪',
    category: 'logistics',
    atoms: ['atom_timestamp', 'atom_delivery_time', 'atom_location'],
    skills: ['logistics_optimization_v2'],
    processNodes: ['in_transit_monitor', 'eta_update']
  },
  {
    id: 'sem_delivery_accuracy',
    name: '交付准确率',
    description: '准时交付率和交付准确性',
    category: 'logistics',
    atoms: ['atom_delivery_time', 'atom_quantity', 'atom_timestamp'],
    skills: ['order_fulfillment_tracking_v2'],
    processNodes: ['delivery_accuracy_calc', 'delivery_performance']
  },

  // === 客户类 (4个) ===
  {
    id: 'sem_credit_mgmt',
    name: '信用管理',
    description: '客户信用评估和额度管理',
    category: 'customer',
    atoms: ['atom_cost', 'atom_timestamp'],
    skills: ['supply_chain_collab_v2'],
    processNodes: ['credit_check', 'credit_adjust']
  },
  {
    id: 'sem_customer_rating',
    name: '客户评级',
    description: '客户分级和优先级管理',
    category: 'customer',
    atoms: ['atom_quantity', 'atom_cost', 'atom_timestamp'],
    skills: ['supply_chain_collab_v2'],
    processNodes: ['customer_rating_calc', 'priority_adjust']
  },
  {
    id: 'sem_satisfaction',
    name: '客户满意度',
    description: '客户满意度调查和分析',
    category: 'customer',
    atoms: ['atom_defect_rate', 'atom_delivery_time', 'atom_yield_rate'],
    skills: ['order_fulfillment_tracking_v2'],
    processNodes: ['satisfaction_survey', 'satisfaction_analysis']
  },
  {
    id: 'sem_customer_comm',
    name: '客户沟通',
    description: '交付变更等异常情况的客户沟通',
    category: 'customer',
    atoms: ['atom_timestamp', 'atom_delivery_time'],
    skills: ['production_sales_alert_v1', 'supply_chain_collab_v2'],
    processNodes: ['customer_notify', 'negotiation']
  },

  // === 计划类 (4个) ===
  {
    id: 'sem_master_schedule',
    name: '主生产计划',
    description: 'MPS主生产计划的制定',
    category: 'planning',
    atoms: ['atom_capacity', 'atom_quantity', 'atom_timestamp'],
    skills: ['smart_scheduling_v4', 'sop_balancer_v1'],
    processNodes: ['mps_create', 'mps_adjust']
  },
  {
    id: 'sem_material_requirements',
    name: '物料需求计划',
    description: 'MRP物料需求计算',
    category: 'planning',
    atoms: ['atom_quantity', 'atom_delivery_time', 'atom_inventory_days'],
    skills: ['smart_scheduling_v4', 'inventory_optimization_v3'],
    processNodes: ['mrp_calc', 'material_plan']
  },
  {
    id: 'sem_delivery_planning',
    name: '交货计划',
    description: '客户交货期的计划和承诺',
    category: 'planning',
    atoms: ['atom_delivery_time', 'atom_capacity', 'atom_quantity'],
    skills: ['order_fulfillment_tracking_v2', 'smart_scheduling_v4'],
    processNodes: ['delivery_plan', 'delivery_commit']
  },
  {
    id: 'sem_achievement_rate',
    name: '计划达成率',
    description: '生产计划执行情况的跟踪分析',
    category: 'planning',
    atoms: ['atom_quantity', 'atom_capacity', 'atom_utilization_rate'],
    skills: ['production_sales_alert_v1', 'sop_balancer_v1'],
    processNodes: ['plan_achievement_calc', 'deviation_analysis']
  }
];

// ==================== 业务流程节点到语义/技能映射 ====================
// 用于从业务流程图谱倒推所需的业务语义和技能

export interface ProcessNodeMapping {
  nodeId: string;
  nodeName: string;
  semantics: string[]; // 关联的业务语义ID
  skills: string[]; // 关联的技能ID
  atoms: string[]; // 所需业务释义
}

// 产销场景核心业务流程节点映射
export const PRODUCTION_SALES_PROCESS_MAP: ProcessNodeMapping[] = [
  // L2 Nodes
  {
    nodeId: 'demand_forecast',
    nodeName: '需求预测',
    semantics: ['sem_sales_forecast'],
    skills: ['demand_forecast_v3'],
    atoms: ['atom_quantity', 'atom_timestamp', 'atom_frequency']
  },
  {
    nodeId: 'sales_planning',
    nodeName: '销售计划',
    semantics: ['sem_sales_forecast', 'sem_master_schedule'],
    skills: ['demand_forecast_v3', 'sop_balancer_v1'],
    atoms: ['atom_quantity', 'atom_capacity', 'atom_timestamp']
  },
  {
    nodeId: 'capacity_planning',
    nodeName: '产能规划',
    semantics: ['sem_capacity_planning'],
    skills: ['capacity_evaluation_v2', 'sop_balancer_v1'],
    atoms: ['atom_capacity', 'atom_oee', 'atom_utilization_rate']
  },
  {
    nodeId: 'inventory_management',
    nodeName: '库存管理',
    semantics: ['sem_inventory_management', 'sem_safety_stock'],
    skills: ['inventory_optimization_v3'],
    atoms: ['atom_quantity', 'atom_inventory_value', 'atom_inventory_days']
  },
  {
    nodeId: 'production_scheduling',
    nodeName: '生产排程',
    semantics: ['sem_production_scheduling', 'sem_master_schedule'],
    skills: ['smart_scheduling_v4', 'sop_balancer_v1'],
    atoms: ['atom_capacity', 'atom_duration', 'atom_timestamp', 'atom_utilization_rate']
  },
  {
    nodeId: 'quality_control',
    nodeName: '质量控制',
    semantics: ['sem_quality_control', 'sem_pass_rate_mgmt'],
    skills: ['quality_predict_v2'],
    atoms: ['atom_defect_rate', 'atom_yield_rate', 'atom_precision']
  },
  {
    nodeId: 'logistics_delivery',
    nodeName: '物流配送',
    semantics: ['sem_delivery_mgmt', 'sem_logistics_cost'],
    skills: ['logistics_optimization_v2'],
    atoms: ['atom_delivery_time', 'atom_quantity', 'atom_cost']
  },
  {
    nodeId: 'customer_service',
    nodeName: '客户服务',
    semantics: ['sem_order_management', 'sem_customer_satisfaction'],
    skills: ['order_fulfillment_tracking_v2'],
    atoms: ['atom_quantity', 'atom_cost', 'atom_timestamp']
  },
  // L3 Nodes - Demand Forecast children
  {
    nodeId: 'market_analysis',
    nodeName: '市场分析',
    semantics: ['sem_sales_forecast'],
    skills: ['demand_forecast_v3'],
    atoms: ['atom_quantity', 'atom_timestamp', 'atom_frequency']
  },
  {
    nodeId: 'forecast_model',
    nodeName: '预测模型',
    semantics: ['sem_sales_forecast'],
    skills: ['demand_forecast_v3'],
    atoms: ['atom_quantity', 'atom_precision', 'atom_frequency']
  },
  {
    nodeId: 'accuracy_evaluation',
    nodeName: '准确度评估',
    semantics: ['sem_sales_forecast'],
    skills: ['demand_forecast_v3'],
    atoms: ['atom_precision', 'atom_yield_rate']
  },
  // L3 Nodes - Sales Planning children
  {
    nodeId: 'sales_target',
    nodeName: '销售目标',
    semantics: ['sem_sales_forecast', 'sem_master_schedule'],
    skills: ['sop_balancer_v1'],
    atoms: ['atom_quantity', 'atom_capacity']
  },
  {
    nodeId: 'order_management',
    nodeName: '订单管理',
    semantics: ['sem_order_management'],
    skills: ['order_fulfillment_tracking_v2'],
    atoms: ['atom_quantity', 'atom_timestamp', 'atom_cost']
  },
  {
    nodeId: 'customer_segmentation',
    nodeName: '客户分级',
    semantics: ['sem_customer_satisfaction'],
    skills: ['supply_chain_collab_v2'],
    atoms: ['atom_quantity', 'atom_cost']
  },
  // L3 Nodes - Capacity Planning children
  {
    nodeId: 'capacity_assessment',
    nodeName: '产能评估',
    semantics: ['sem_capacity_planning'],
    skills: ['capacity_evaluation_v2'],
    atoms: ['atom_capacity', 'atom_oee', 'atom_utilization_rate']
  },
  {
    nodeId: 'bottleneck_analysis',
    nodeName: '瓶颈分析',
    semantics: ['sem_capacity_planning'],
    skills: ['capacity_evaluation_v2', 'smart_scheduling_v4'],
    atoms: ['atom_capacity', 'atom_utilization_rate', 'atom_duration']
  },
  {
    nodeId: 'resource_allocation',
    nodeName: '资源调配',
    semantics: ['sem_capacity_planning', 'sem_production_scheduling'],
    skills: ['smart_scheduling_v4', 'sop_balancer_v1'],
    atoms: ['atom_capacity', 'atom_utilization_rate']
  },
  // L3 Nodes - Inventory Management children
  {
    nodeId: 'raw_material_inventory',
    nodeName: '原材料库存',
    semantics: ['sem_inventory_management'],
    skills: ['inventory_optimization_v3'],
    atoms: ['atom_quantity', 'atom_inventory_value', 'atom_inventory_days']
  },
  {
    nodeId: 'wip_inventory',
    nodeName: '在制品库存',
    semantics: ['sem_wip_control'],
    skills: ['inventory_optimization_v3', 'smart_scheduling_v4'],
    atoms: ['atom_quantity', 'atom_duration', 'atom_inventory_value']
  },
  {
    nodeId: 'finished_goods_inventory',
    nodeName: '成品库存',
    semantics: ['sem_inventory_management'],
    skills: ['inventory_optimization_v3'],
    atoms: ['atom_quantity', 'atom_inventory_value', 'atom_inventory_days']
  },
  {
    nodeId: 'safety_stock',
    nodeName: '安全库存',
    semantics: ['sem_safety_stock'],
    skills: ['inventory_optimization_v3'],
    atoms: ['atom_quantity', 'atom_inventory_days', 'atom_delivery_time']
  },
  // L3 Nodes - Production Scheduling children
  {
    nodeId: 'mps_generation',
    nodeName: '主生产计划',
    semantics: ['sem_master_schedule', 'sem_material_requirements'],
    skills: ['smart_scheduling_v4', 'sop_balancer_v1'],
    atoms: ['atom_capacity', 'atom_duration', 'atom_timestamp']
  },
  {
    nodeId: 'production_tracking',
    nodeName: '生产跟踪',
    semantics: ['sem_work_order_mgmt', 'sem_oee_monitoring'],
    skills: ['smart_scheduling_v4'],
    atoms: ['atom_capacity', 'atom_oee', 'atom_utilization_rate', 'atom_duration']
  },
  {
    nodeId: 'exception_handling',
    nodeName: '异常处理',
    semantics: ['sem_process_control'],
    skills: ['equipment_rul_pred_v2'],
    atoms: ['atom_duration', 'atom_defect_rate']
  },
  // L3 Nodes - Quality Control children
  {
    nodeId: 'quality_inspection',
    nodeName: '质量检验',
    semantics: ['sem_quality_control'],
    skills: ['quality_predict_v2'],
    atoms: ['atom_defect_rate', 'atom_yield_rate', 'atom_precision']
  },
  {
    nodeId: 'defect_analysis',
    nodeName: '缺陷分析',
    semantics: ['sem_pass_rate_mgmt'],
    skills: ['quality_predict_v2'],
    atoms: ['atom_defect_rate', 'atom_precision']
  },
  {
    nodeId: 'improvement_tracking',
    nodeName: '改进跟踪',
    semantics: ['sem_pass_rate_mgmt'],
    skills: ['quality_predict_v2'],
    atoms: ['atom_yield_rate', 'atom_precision']
  },
  // L3 Nodes - Logistics Delivery children
  {
    nodeId: 'delivery_planning',
    nodeName: '配送计划',
    semantics: ['sem_delivery_planning'],
    skills: ['logistics_optimization_v2'],
    atoms: ['atom_delivery_time', 'atom_quantity', 'atom_cost']
  },
  {
    nodeId: 'shipment_tracking',
    nodeName: '发货跟踪',
    semantics: ['sem_delivery_mgmt', 'sem_fulfillment_tracking'],
    skills: ['order_fulfillment_tracking_v2'],
    atoms: ['atom_delivery_time', 'atom_timestamp', 'atom_duration']
  },
  {
    nodeId: 'carrier_management',
    nodeName: '承运商管理',
    semantics: ['sem_logistics_cost'],
    skills: ['logistics_optimization_v2'],
    atoms: ['atom_cost', 'atom_delivery_time']
  }
];

// ==================== 关联性分析工具函数 ====================

/**
 * 根据业务流程节点ID获取所需的业务语义和技能
 */
export function getRequirementsByProcessNode(nodeId: string): {
  semantics: BusinessSemanticDef[];
  skills: string[];
  atoms: string[];
} {
  const mapping = PRODUCTION_SALES_PROCESS_MAP.find(p => p.nodeId === nodeId);
  if (!mapping) {
    return { semantics: [], skills: [], atoms: [] };
  }

  const semantics = PRODUCTION_SALES_SEMANTICS.filter(s =>
    mapping.semantics.includes(s.id)
  );

  // 合并业务流程映射和语义定义中的技能
  const allSkills = Array.from(new Set([
    ...mapping.skills,
    ...semantics.flatMap(s => s.skills)
  ]));

  // 合并所有业务释义
  const allAtoms = Array.from(new Set([
    ...mapping.atoms,
    ...semantics.flatMap(s => s.atoms)
  ]));

  return { semantics, skills: allSkills, atoms: allAtoms };
}

/**
 * 根据业务语义ID获取关联的技能和业务释义
 */
export function getSkillsBySemantic(semanticId: string): {
  semantic?: BusinessSemanticDef;
  skills: string[];
  atoms: string[];
} {
  const semantic = PRODUCTION_SALES_SEMANTICS.find(s => s.id === semanticId);
  if (!semantic) {
    return { skills: [], atoms: [] };
  }

  return {
    semantic,
    skills: semantic.skills,
    atoms: semantic.atoms
  };
}

/**
 * 获取产销场景完整的依赖关系图
 */
export function getProductionSalesDependencyGraph(): {
  nodes: { id: string; type: 'process' | 'semantic' | 'skill' | 'atom'; name: string }[];
  links: { source: string; target: string; type: string }[];
} {
  const nodes: { id: string; type: 'process' | 'semantic' | 'skill' | 'atom'; name: string }[] = [];
  const links: { source: string; target: string; type: string }[] = [];

  // 添加业务流程节点
  PRODUCTION_SALES_PROCESS_MAP.forEach(proc => {
    nodes.push({ id: proc.nodeId, type: 'process', name: proc.nodeName });

    // 业务流程 -> 业务语义
    proc.semantics.forEach(semId => {
      const sem = PRODUCTION_SALES_SEMANTICS.find(s => s.id === semId);
      if (sem) {
        links.push({ source: proc.nodeId, target: semId, type: 'requires_semantic' });

        // 业务语义 -> 技能
        sem.skills.forEach(skillId => {
          links.push({ source: semId, target: skillId, type: 'uses_skill' });
        });

        // 业务语义 -> 业务释义
        sem.atoms.forEach(atomId => {
          links.push({ source: semId, target: atomId, type: 'depends_on_atom' });
        });
      }
    });

    // 业务流程直接依赖的业务释义
    proc.atoms.forEach(atomId => {
      links.push({ source: proc.nodeId, target: atomId, type: 'measures_atom' });
    });
  });

  // 添加业务语义节点
  PRODUCTION_SALES_SEMANTICS.forEach(sem => {
    if (!nodes.find(n => n.id === sem.id)) {
      nodes.push({ id: sem.id, type: 'semantic', name: sem.name });
    }
  });

  return { nodes, links };
}

// 动态场景存储 - 用户创建的场景
export let DYNAMIC_SCENARIOS: BusinessScenario[] = [];

// 动态场景业务语义映射
export let DYNAMIC_ONTOLOGY_MAP: Record<string, OntologyData> = {};

// 添加动态场景
export const addDynamicScenario = (scenario: BusinessScenario, ontologyData: OntologyData) => {
  DYNAMIC_SCENARIOS = [...DYNAMIC_SCENARIOS, scenario];
  DYNAMIC_ONTOLOGY_MAP[scenario.id] = ontologyData;
};

// 更新动态场景
export const updateDynamicScenario = (scenarioId: string, updates: Partial<BusinessScenario>) => {
  DYNAMIC_SCENARIOS = DYNAMIC_SCENARIOS.map(s =>
    s.id === scenarioId ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
  );
};

// 删除动态场景
export const deleteDynamicScenario = (scenarioId: string) => {
  DYNAMIC_SCENARIOS = DYNAMIC_SCENARIOS.filter(s => s.id !== scenarioId);
  delete DYNAMIC_ONTOLOGY_MAP[scenarioId];
};

// 获取所有场景（静态+动态）
export const getAllScenarios = (): Scenario[] => {
  const dynamicScenarios: Scenario[] = DYNAMIC_SCENARIOS.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    isDynamic: true,
    sourceScenarioId: s.id
  }));
  return [...SCENARIOS, ...dynamicScenarios];
};

// 获取场景的完整本体数据
export const getScenarioOntologyData = (scenarioId: string): OntologyData | undefined => {
  // 先查静态场景
  if (SCENARIO_ONTOLOGY_MAP[scenarioId]) {
    return SCENARIO_ONTOLOGY_MAP[scenarioId];
  }
  // 再查动态场景
  return DYNAMIC_ONTOLOGY_MAP[scenarioId];
};

// 将分子本体转换为图谱数据
export const convertMolecularToOntologyData = (
  scenario: BusinessScenario,
  skills: Skill[]
): OntologyData => {
  const nodes: OntologyNode[] = [];
  const links: OntologyLink[] = [];

  // 示例数据生成器
  const owners = ['张工', '李经理', '王主管', '刘工程师', '陈博士', '赵主任', '孙技术员', '周专家'];
  const frequencies = ['实时', '每分钟', '每小时', '每班', '每日', '每周', '每月', '按需'];
  const dataFormats = ['JSON', 'XML', 'CSV', '数据库表', '消息队列', '文件', 'API接口', '二进制流'];
  const dataSources = ['导入', 'CRM系统', 'BOM系统', 'MES系统', 'ERP系统', 'SCM系统', 'PLM系统', 'WMS系统'];

  const getRandomOwner = () => owners[Math.floor(Math.random() * owners.length)];
  const getRandomFrequency = () => frequencies[Math.floor(Math.random() * frequencies.length)];
  const getRandomFormat = () => dataFormats[Math.floor(Math.random() * dataFormats.length)];
  const getRandomDataSource = () => dataSources[Math.floor(Math.random() * dataSources.length)];

  // 根据场景生成相关任务
  const generatePendingTasks = (nodeId: string, nodeName: string, nodeLevel: number): any[] => {
    const tasks: any[] = [];
    const taskCount = Math.floor(Math.random() * 3) + 1; // 1-3个任务

    // 场景相关的任务模板
    const scenarioTaskTemplates: Record<string, Array<{title: string, desc: string, priority: string}>> = {
      default: [
        { title: `${nodeName}数据采集`, desc: `采集${nodeName}相关数据并提交`, priority: 'high' },
        { title: `${nodeName}质量检查`, desc: `执行${nodeName}质量检查并提交报告`, priority: 'high' },
        { title: `${nodeName}参数确认`, desc: `确认${nodeName}关键参数设置`, priority: 'medium' },
        { title: `${nodeName}异常处理`, desc: `处理${nodeName}过程中的异常情况`, priority: 'medium' },
        { title: `${nodeName}报告提交`, desc: `提交${nodeName}相关工作报告`, priority: 'low' },
      ]
    };

    const taskTemplates = scenarioTaskTemplates[scenario.id] || scenarioTaskTemplates.default;

    for (let i = 0; i < taskCount; i++) {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const statuses = ['pending', 'in_progress', 'completed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      tasks.push({
        id: `task_${scenario.id}_${nodeId}_${i}`,
        title: template.title,
        description: template.desc,
        priority: template.priority,
        status: status,
        dueDate: status === 'completed' ? undefined : `2024-03-${10 + Math.floor(Math.random() * 20)}`,
        assignee: undefined
      });
    }
    return tasks;
  };

  // 辅助函数：生成关联节点状态
  const createRelatedNode = (id: string, label: string) => ({
    id,
    label,
    dataSubmitted: Math.random() > 0.3,
    instructionCompleted: Math.random() > 0.2
  });

  // L1: 场景根节点
  nodes.push({
    id: 'root',
    label: scenario.name,
    type: 'concept',
    group: 1,
    data_readiness: 100,
    owner: getRandomOwner(),
    responsibility: `全面负责${scenario.name}场景的业务管理、数据治理和系统协调，确保各环节高效协同运行`,
    dataSource: '综合管理平台',
    dataFormat: 'JSON',
    updateFrequency: '实时监控',
    pendingTasks: generatePendingTasks('root', scenario.name, 1)
  });

  // 构建层级结构
  const l2Nodes = scenario.molecularStructure.filter(m => m.level === 2);
  const l3Nodes = scenario.molecularStructure.filter(m => m.level === 3);
  const l4Nodes = scenario.molecularStructure.filter(m => m.level === 4);

  // L2: 子系统
  l2Nodes.forEach((l2, i) => {
    nodes.push({
      id: l2.id,
      label: l2.name,
      type: 'concept',
      group: 2,
      data_readiness: 85 + Math.floor(Math.random() * 15),
      owner: getRandomOwner(),
      responsibility: `管理${l2.name}子系统的运行状态，协调内部工艺过程，确保与子系统间数据互通`,
      upstreamNodes: i > 0 ? [createRelatedNode(l2Nodes[i - 1].id, l2Nodes[i - 1].name)] : undefined,
      downstreamNodes: i < l2Nodes.length - 1 ? [createRelatedNode(l2Nodes[i + 1].id, l2Nodes[i + 1].name)] : undefined,
      dataSource: getRandomDataSource(),
      dataFormat: getRandomFormat(),
      updateFrequency: getRandomFrequency(),
      pendingTasks: generatePendingTasks(l2.id, l2.name, 2)
    });
    links.push({ source: 'root', target: l2.id, relation: '包含' });
  });

  // L3: 工艺过程
  l3Nodes.forEach((l3, i) => {
    const sameParentL3 = l3Nodes.filter(n => n.parentId === l3.parentId);
    const indexInParent = sameParentL3.findIndex(n => n.id === l3.id);
    const parentL2 = l2Nodes.find(l2 => l2.id === l3.parentId);
    nodes.push({
      id: l3.id,
      label: l3.name,
      type: 'concept',
      group: 3,
      data_readiness: 60 + Math.floor(Math.random() * 35),
      owner: getRandomOwner(),
      responsibility: `执行${l3.name}工艺过程，监控关键指标，确保工艺参数在合理范围内`,
      upstreamNodes: indexInParent > 0
        ? [createRelatedNode(sameParentL3[indexInParent - 1].id, sameParentL3[indexInParent - 1].name)]
        : parentL2 ? [createRelatedNode(parentL2.id, parentL2.name)] : undefined,
      downstreamNodes: indexInParent < sameParentL3.length - 1
        ? [createRelatedNode(sameParentL3[indexInParent + 1].id, sameParentL3[indexInParent + 1].name)]
        : undefined,
      dataSource: getRandomDataSource(),
      dataFormat: getRandomFormat(),
      updateFrequency: getRandomFrequency(),
      pendingTasks: generatePendingTasks(l3.id, l3.name, 3)
    });
    links.push({ source: l3.parentId || 'root', target: l3.id, relation: '包含' });
  });

  // L4: 参数（关联原子本体）
  l4Nodes.forEach((l4, i) => {
    // 获取原子引用信息
    const atomNames = l4.atomRefs
      .map(ref => {
        const atom = ATOMIC_ONTOLOGY_LIBRARY.find(a => a.id === ref.atomId);
        return atom ? `${atom.name}(${ref.role})` : null;
      })
      .filter(Boolean)
      .join(', ');
    const parentL3 = l3Nodes.find(l3 => l3.id === l4.parentId);

    nodes.push({
      id: l4.id,
      label: l4.name + (atomNames ? ` [${atomNames}]` : ''),
      type: 'concept',
      group: 4,
      data_readiness: 40 + Math.floor(Math.random() * 50),
      owner: getRandomOwner(),
      responsibility: `采集和预处理${l4.name}数据，确保数据质量和时效性`,
      upstreamNodes: parentL3 ? [createRelatedNode(parentL3.id, parentL3.name)] : undefined,
      dataSource: getRandomDataSource(),
      dataFormat: getRandomFormat(),
      updateFrequency: ['实时', '每分钟', '每小时'][Math.floor(Math.random() * 3)],
      pendingTasks: generatePendingTasks(l4.id, l4.name, 4)
    });
    links.push({ source: l4.parentId || 'root', target: l4.id, relation: '监控' });
  });

  // L5: 关联技能
  const relevantSkills = skills.filter(s =>
    s.domain.includes(scenario.id) ||
    s.capability_tags.some(tag =>
      scenario.tags.some(st => st.toLowerCase().includes(tag.toLowerCase()))
    )
  );

  relevantSkills.forEach((skill, idx) => {
    nodes.push({
      id: skill.skill_id,
      label: skill.name,
      type: 'skill',
      group: 5,
      data_readiness: 100,
      owner: getRandomOwner(),
      responsibility: `提供${skill.name}智能算法服务，分析输入数据并输出预测/控制结果，支持业务决策`,
      upstreamNodes: l4Nodes.length > 0 ? [l4Nodes[idx % l4Nodes.length]?.id] : [l3Nodes[idx % l3Nodes.length]?.id],
      dataSource: 'API接口',
      dataFormat: 'JSON',
      updateFrequency: '实时调用',
      pendingTasks: [
        {
          id: `task_skill_${skill.skill_id}_1`,
          title: '模型性能监控',
          description: '监控模型预测准确率，触发重训练流程',
          priority: 'high',
          status: 'pending',
          dueDate: '2024-03-15'
        },
        {
          id: `task_skill_${skill.skill_id}_2`,
          title: '算法版本更新',
          description: '升级到最新模型版本',
          priority: 'medium',
          status: 'in_progress',
          assignee: getRandomOwner()
        }
      ]
    });
    // 连接到相关的L4节点或L3节点
    const targetNodes = l4Nodes.length > 0 ? l4Nodes : l3Nodes;
    if (targetNodes.length > 0) {
      const target = targetNodes[idx % targetNodes.length];
      links.push({ source: target.id, target: skill.skill_id, relation: '赋能' });
    }
  });

  return { nodes, links };
};