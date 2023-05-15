import {WSR_SummaryDetails} from "../model/wsr-summary-details.model";
import { WSR_ActionItems } from './wsr-action-items.model';
import { WSR_Teams } from './wsr-teams.model';

export class WeeklySummaryReport {
    Summary: WSR_SummaryDetails
    ActionItems: WSR_ActionItems[]
    Teams: WSR_Teams[]
}