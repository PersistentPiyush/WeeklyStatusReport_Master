using SqlKata;
using SqlKata.Execution;
using WeeklyReportAPI.DTO;
using WeeklyReportAPI.Model;
using WeeklyReportAPI.Repository;

namespace WeeklyReportAPI.DAL
{
    public interface IActionItemDAL
    {
        public IEnumerable<WSR_ActionItems> GetActionItem();
        public WeeklySummaryReport GetSummaryReport(DateTime WeekEndingDate);
        public bool AddWeeklySummaryReport(WeeklySummaryReport weeklySummaryReport);
        public bool UpdateWeeklySummaryReport(int SummaryID, WeeklySummaryReport weeklySummaryReport);
    }
    public class ActionItemDAL : IActionItemDAL
    {
        static DBContext _context = new DBContext();
        QueryFactory db = _context.GetQueryFactory();
        public IEnumerable<WSR_ActionItems> GetActionItem()
        {
            IEnumerable<WSR_ActionItems> actionsItems = new List<WSR_ActionItems>();
            try
            {
                actionsItems = db.Query("WSR_ActionItems").Get<WSR_ActionItems>();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return actionsItems;

        }
        public WeeklySummaryReport GetSummaryReport(DateTime WeekEndingDate)
        {
            WeeklySummaryReport weeklySummaryReport = new WeeklySummaryReport();
            List<WSR_ActionItems> actionItems = new List<WSR_ActionItems>();
            List<WSR_Teams> teams = new List<WSR_Teams>();
            WSR_SummaryDetails summaryDetail = new WSR_SummaryDetails();
            try
            {
                summaryDetail = db.Query("WSR_SummaryDetails").WhereDate("WSR_SummaryDetails.WeekEndingDate", WeekEndingDate).Get<WSR_SummaryDetails>().FirstOrDefault();
                if (summaryDetail != null)
                {
                    actionItems = db.Query("WSR_ActionItems").Where("SummaryID", summaryDetail.SummaryID).Get<WSR_ActionItems>().ToList();

                    teams = db.Query("WSR_Teams").Where("SummaryID", summaryDetail.SummaryID).Get<WSR_Teams>().ToList();
                    weeklySummaryReport.Summary = summaryDetail;
                    weeklySummaryReport.ActionItems = actionItems;
                    weeklySummaryReport.Teams = teams;
                }
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return weeklySummaryReport;

        }
        public bool AddWeeklySummaryReport(WeeklySummaryReport weeklySummaryReport)
        {
            bool datainserted = false;
            try
            {
                int SummaryID = db.Query("WSR_SummaryDetails").InsertGetId<int>(new
                {
                    Overall = weeklySummaryReport.Summary.Overall,
                    OverallStatus = weeklySummaryReport.Summary.OverallStatus,
                    ScheduleStatus = weeklySummaryReport.Summary.ScheduleStatus,
                    ResourceStatus = weeklySummaryReport.Summary.ResourceStatus,
                    Risk = weeklySummaryReport.Summary.Risk,
                    RiskStatus = weeklySummaryReport.Summary.RiskStatus,
                    WeekEndingDate = weeklySummaryReport.Summary.WeekEndingDate,
                    Name= weeklySummaryReport.Summary.Name,
                    CreatedBy = weeklySummaryReport.Summary.CreatedBy,
                    CreatedOn = DateTime.Now
                });
                foreach (WSR_ActionItems actionitem in weeklySummaryReport.ActionItems)
                {
                    db.Query("WSR_ActionItems").Insert(new
                    {
                        SummaryID = SummaryID,
                        ActionItem = actionitem.ActionItem,
                        ETA = actionitem.ETA,
                        Owner = actionitem.Owner,
                        Remarks = actionitem.Remarks,
                        Status = "Open"
                    });
                }
                foreach (WSR_Teams team in weeklySummaryReport.Teams)
                {

                    db.Query("WSR_Teams").Insert(new
                    {
                        TeamID=team.TeamID,
                        SummaryID = SummaryID,
                        TeamName = team.TeamName,
                        LeadName = team.LeadName,
                        TaskCompleted = team.TaskCompleted,
                        TaskInProgress = team.TaskInProgress,
                        CurrentWeekPlan = team.CurrentWeekPlan
                    });
                }
                if (SummaryID != 0)
                {
                    datainserted = true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return datainserted;
        }

        public bool UpdateWeeklySummaryReport(int SummaryID, WeeklySummaryReport weeklySummaryReport)
        {
            bool dataupdated = false;
            try
            {
                var query = db.Query("WSR_SummaryDetails").Where("SummaryID", SummaryID).Update(new
                {
                    Overall = weeklySummaryReport.Summary.Overall,
                    OverallStatus = weeklySummaryReport.Summary.OverallStatus,
                    ScheduleStatus = weeklySummaryReport.Summary.ScheduleStatus,
                    ResourceStatus = weeklySummaryReport.Summary.ResourceStatus,
                    Risk = weeklySummaryReport.Summary.Risk,
                    RiskStatus = weeklySummaryReport.Summary.RiskStatus,
                    WeekEndingDate = weeklySummaryReport.Summary.WeekEndingDate,
                    Name = weeklySummaryReport.Summary.Name,
                    UpdatedBy = weeklySummaryReport.Summary.UpdatedBy,
                    UpdatedOn = DateTime.Now,

                });
                foreach (WSR_ActionItems actionitem in weeklySummaryReport.ActionItems)
                {
                    if (actionitem.ActionItemID == 0)
                    {
                        //insert action item if not exist
                        db.Query("WSR_ActionItems").Insert(new
                        {
                            SummaryID = SummaryID,
                            ActionItem = actionitem.ActionItem,
                            ETA = actionitem.ETA,
                            Owner = actionitem.Owner,
                            Remarks = actionitem.Remarks,
                            Status = "Open"
                        });
                    }
                    else
                    {
                        //update action item
                        var query2 = db.Query("WSR_ActionItems").Where("SummaryID", SummaryID).Update(new
                        {
                            ActionItem = actionitem.ActionItem,
                            ETA = actionitem.ETA,
                            Owner = actionitem.Owner,
                            Remarks = actionitem.Remarks,
                            Status = actionitem.Status,
                            isActive = actionitem.isActive
                        });
                    }
                }
                foreach (WSR_Teams team in weeklySummaryReport.Teams)
                {
                    var query1 = db.Query("WSR_Teams").Where(new
                    {
                        SummaryID = SummaryID,
                        TeamID = team.TeamID,
                    }).Update(new
                    {
                        LeadName = team.LeadName,
                        TeamName = team.TeamName,
                        TeamID = team.TeamID,
                        TaskCompleted = team.TaskCompleted,
                        TaskInProgress = team.TaskInProgress,
                        CurrentWeekPlan = team.CurrentWeekPlan
                    });
                }
                dataupdated = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return dataupdated;
        }
    }
}
