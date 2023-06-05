import {WSR_SummaryDetails} from "../model/wsr-summary-details.model";
import { WSR_ActionItems } from './wsr-action-items.model';
import { WSR_RemarkHistory } from "./wsr-remarks-history.model";
import { WSR_Teams } from './wsr-teams.model';

export class WeeklySummaryReport {
    Summary: WSR_SummaryDetails
    ActionItems: ActionitemList[]
    Teams: WSR_Teams[]
    ActionItemMaxID: number
}
export class ActionitemList extends WSR_ActionItems
{ 
CreatedOn : Date
remarkHistory :WSR_RemarkHistory[]
}