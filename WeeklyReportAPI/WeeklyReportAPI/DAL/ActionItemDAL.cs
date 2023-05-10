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
        public dynamic GetSummaryReport(DateTime WeekEndingDate);
        public bool AddWeeklySummaryReport(WeeklySummaryReport weeklySummaryReport);
        public bool UpdateWeeklySummaryReport(int SummaryID,WeeklySummaryReport weeklySummaryReport);
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
        public dynamic GetSummaryReport(DateTime WeekEndingDate)
        {
            dynamic summaryReport = null;
            try
            {
                summaryReport = db.Query("WSR_SummaryDetails").WhereDate("WSR_SummaryDetails.WeekEndingDate", WeekEndingDate)
                    .Join("WSR_ActionItems", "WSR_SummaryDetails.SummaryID", "WSR_ActionItems.SummaryID")
                    .Join("WSR_Teams", "WSR_SummaryDetails.SummaryID", "WSR_Teams.SummaryID").Get();
            }
            
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return summaryReport;

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
                    Schedule = weeklySummaryReport.Summary.Schedule,
                    ScheduleStatus = weeklySummaryReport.Summary.ScheduleStatus,
                    Resource = weeklySummaryReport.Summary.Resource,
                    ResourceStatus = weeklySummaryReport.Summary.ResourceStatus,
                    Risk = weeklySummaryReport.Summary.Risk,
                    RiskStatus = weeklySummaryReport.Summary.RiskStatus,
                    WeekEndingDate = weeklySummaryReport.Summary.WeekEndingDate,
                    CreatedBy = weeklySummaryReport.Summary.CreatedBy,
                    CreatedOn = DateTime.Now
                });
                int ActionItemID = db.Query("WSR_ActionItems").InsertGetId<int>(new
                {
                    SummaryID = SummaryID,
                    ActionItem = weeklySummaryReport.ActionItem.ActionItem,
                    ETA = weeklySummaryReport.ActionItem.ETA,
                    Owner = weeklySummaryReport.ActionItem.Owner,
                    Remarks = weeklySummaryReport.ActionItem.Remarks,
                    Status = weeklySummaryReport.ActionItem.Status,
                    isActive = weeklySummaryReport.ActionItem.isActive

                });

                int TeamID =db.Query("WSR_Teams").InsertGetId<int>(new
                {
                    SummaryID = SummaryID,
                    Name = weeklySummaryReport.Team.Name,
                    TaskCompleted = weeklySummaryReport.Team.TaskCompleted,
                    TaskInProgress = weeklySummaryReport.Team.TaskInProgress,
                    CurrentWeekPlan = weeklySummaryReport.Team.CurrentWeekPlan,
                    NoOfTaskCompleted = weeklySummaryReport.Team.NoOfTaskCompleted,
                    NoOfTaskInProgress = weeklySummaryReport.Team.NoOfTaskInProgress,
                });
                if (SummaryID!=0 &&  ActionItemID!=0 && TeamID != 0) {
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
                    Schedule = weeklySummaryReport.Summary.Schedule,
                    ScheduleStatus = weeklySummaryReport.Summary.ScheduleStatus,
                    Resource = weeklySummaryReport.Summary.Resource,
                    ResourceStatus = weeklySummaryReport.Summary.ResourceStatus,
                    Risk = weeklySummaryReport.Summary.Risk,
                    RiskStatus = weeklySummaryReport.Summary.RiskStatus,
                    WeekEndingDate = weeklySummaryReport.Summary.WeekEndingDate,
                    UpdatedBy = weeklySummaryReport.Summary.UpdatedBy,
                    UpdatedOn = DateTime.Now,

                });
                var query2= db.Query("WSR_ActionItems").Where("SummaryID", SummaryID).Update(new
                {
                    ActionItem = weeklySummaryReport.ActionItem.ActionItem,
                    ETA = weeklySummaryReport.ActionItem.ETA,
                    Owner = weeklySummaryReport.ActionItem.Owner,
                    Remarks = weeklySummaryReport.ActionItem.Remarks,
                    Status = weeklySummaryReport.ActionItem.Status,
                    isActive = weeklySummaryReport.ActionItem.isActive
                });

                var  query1 = db.Query("WSR_Teams").Where("SummaryID", SummaryID).Update(new
                {
                    Name = weeklySummaryReport.Team.Name,
                    TaskCompleted = weeklySummaryReport.Team.TaskCompleted,
                    TaskInProgress = weeklySummaryReport.Team.TaskInProgress,
                    CurrentWeekPlan = weeklySummaryReport.Team.CurrentWeekPlan,
                    NoOfTaskCompleted = weeklySummaryReport.Team.NoOfTaskCompleted,
                    NoOfTaskInProgress = weeklySummaryReport.Team.NoOfTaskInProgress,
                });
                /*         if (SummaryID != 0 && ActionItemID != 0 && TeamID != 0)
                         {

                         }*/
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
