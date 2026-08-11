import { AlertModel, IAlertDoc } from "../models/Alert.model";
import { AlertRuleModel, IAlertRuleDoc } from "../models/AlertRule.model";

export class AlertRepository {
  async saveRule(data: Partial<IAlertRuleDoc>): Promise<IAlertRuleDoc> {
    return AlertRuleModel.findOneAndUpdate(
      { ruleId: data.ruleId },
      { $set: data },
      { upsert: true, new: true }
    ).exec() as Promise<IAlertRuleDoc>;
  }

  async findRules(): Promise<IAlertRuleDoc[]> {
    return AlertRuleModel.find({}).sort({ ruleName: 1 }).exec();
  }

  async saveAlert(data: Partial<IAlertDoc>): Promise<IAlertDoc> {
    const doc = new AlertModel(data);
    return doc.save();
  }

  async findAlerts(limit = 50): Promise<IAlertDoc[]> {
    return AlertModel.find({}).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async countAlerts(filter: any = {}): Promise<number> {
    return AlertModel.countDocuments(filter).exec();
  }
}

export const alertRepository = new AlertRepository();
