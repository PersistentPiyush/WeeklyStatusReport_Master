using SqlKata;
using SqlKata.Execution;
using System.Reflection.Metadata.Ecma335;
using WeeklyReportAPI.DTO;
using WeeklyReportAPI.Model;
using WeeklyReportAPI.Repository;

namespace WeeklyReportAPI.DAL
{
    public interface IActionItemDAL
    {
        public IEnumerable<WSR_ActionItems> GetActionItem();
        public WeeklySummaryReport GetSummaryReport(DateTime? WeekEndingDate);
        public bool AddWeeklySummaryReport(WeeklySummaryReport weeklySummaryReport);
        public List<WeeklySummaryReport> GetDataSummaryReport(DateTime StartDate, DateTime WeekEndingDate);
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
        public WeeklySummaryReport GetSummaryReport(DateTime? WeekEndingDate)
        {
            WeeklySummaryReport weeklySummaryReport = new WeeklySummaryReport();
            List<WSR_SummaryDetails> allSummary = new List<WSR_SummaryDetails>();
            List<WSR_ActionItems> actionItems = new List<WSR_ActionItems>();
            List<ActionitemList> actionItemsList = new List<ActionitemList>();
            List<WSR_Teams> teams = new List<WSR_Teams>();
            WSR_SummaryDetails summaryDetail = new WSR_SummaryDetails();
            try
            {
                allSummary = db.Query("WSR_SummaryDetails").Get<WSR_SummaryDetails>().ToList();
                summaryDetail = db.Query("WSR_SummaryDetails").WhereDate("WSR_SummaryDetails.WeekEndingDate", WeekEndingDate).Get<WSR_SummaryDetails>().FirstOrDefault();
                if (summaryDetail != null)
                {
                    teams = db.Query("WSR_Teams").Where("SummaryID", summaryDetail.SummaryID).Get<WSR_Teams>().ToList();
                    weeklySummaryReport.Summary = summaryDetail;                   
                    weeklySummaryReport.Teams = teams;
                }
                actionItems = db.Query("WSR_ActionItems").Get<WSR_ActionItems>().ToList();
                
                actionItemsList = actionItems.ConvertAll(x => new ActionitemList
                {
                    ActionItem = x.ActionItem,
                    ActionItemID = x.ActionItemID,
                    SummaryID = x.SummaryID,
                    isActive=x.isActive,
                    ETA=x.ETA,
                    Owner=x.Owner,
                    Remarks=x.Remarks,
                    Status=x.Status,
                    CreatedOn = allSummary.Where(y => y.SummaryID == x.SummaryID).First().CreatedOn,
                }); 
                weeklySummaryReport.ActionItems = actionItemsList;
                var MaxID = db.Query("WSR_ActionItems").AsMax("ActionItemID").Get();
                weeklySummaryReport.ActionItemMaxID = MaxID.First().max;
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
                    RiskMitigation = weeklySummaryReport.Summary.RiskMitigation,
                    WeekEndingDate = weeklySummaryReport.Summary.WeekEndingDate,
                    Name= weeklySummaryReport.Summary.Name,
                    CreatedBy = weeklySummaryReport.Summary.CreatedBy,
                    CreatedOn = DateTime.Now
                });
                foreach (WSR_ActionItems actionitem in weeklySummaryReport.ActionItems)
                {
                    if (!isActionItemExists(actionitem))
                    {
                        insertIntoActionItems(actionitem, SummaryID);
                        insertIntoRemarkHistory(actionitem, SummaryID);
                    }
                    else
                    {
                        UpdateIntoActionItems(actionitem);
                        if (!isRemarkExists(actionitem))
                        {
                            insertIntoRemarkHistory(actionitem, SummaryID);
                        }
                    }
                   
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

        public List<WeeklySummaryReport> GetDataSummaryReport(DateTime StartDate, DateTime WeekEndingDate)
        {

            List<WeeklySummaryReport> dateSummaryReportlist = new List<WeeklySummaryReport>();
            List<WSR_SummaryDetails> allSummary = new List<WSR_SummaryDetails>();
            List<WSR_ActionItems> actionItems = new List<WSR_ActionItems>();
            List<WSR_Teams> teams = new List<WSR_Teams>();
            List<WSR_SummaryDetails> summaryDetail = new List<WSR_SummaryDetails>();
            List<ActionitemList> actionItemsList = new List<ActionitemList>();
            try
            {
                allSummary = db.Query("WSR_SummaryDetails").Get<WSR_SummaryDetails>().ToList();
                summaryDetail = db.Query("WSR_SummaryDetails").WhereDate("WSR_SummaryDetails.WeekEndingDate", ">=", StartDate).WhereDate("WSR_SummaryDetails.WeekEndingDate", "<=", WeekEndingDate).Get<WSR_SummaryDetails>().ToList();
                foreach (WSR_SummaryDetails summarydata in summaryDetail)
                {
                    WeeklySummaryReport weeklySummaryReport = new WeeklySummaryReport();
                    if (summarydata != null)
                    {
                        actionItems = db.Query("WSR_ActionItems").Where("SummaryID", summarydata.SummaryID).Get<WSR_ActionItems>().ToList();

                        teams = db.Query("WSR_Teams").Where("SummaryID", summarydata.SummaryID).Get<WSR_Teams>().ToList();
                        weeklySummaryReport.Summary = summarydata;
                        actionItemsList = actionItems.ConvertAll(x => new ActionitemList
                        {
                            ActionItem = x.ActionItem,
                            ActionItemID = x.ActionItemID,
                            SummaryID = x.SummaryID,
                            isActive = x.isActive,
                            ETA = x.ETA,
                            Owner = x.Owner,
                            Remarks = x.Remarks,
                            Status = x.Status,

                            CreatedOn = allSummary.Where(y => y.SummaryID == x.SummaryID).First().CreatedOn,
                        });
                        weeklySummaryReport.ActionItems = actionItemsList;
                        //weeklySummaryReport.ActionItems = actionItems;
                        weeklySummaryReport.Teams = teams;
                    }
                    dateSummaryReportlist.Add(weeklySummaryReport);
                }
            }



            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return dateSummaryReportlist;
        }
        private bool isActionItemExists(WSR_ActionItems actionitem)
        {
            bool isExists = false;
            var count = db.Query("WSR_ActionItems").Where("SummaryID", actionitem.SummaryID)
                                              .Where("ActionItemID", actionitem.ActionItemID)
                                              .SelectRaw("Count(*) as count").Get();
            if (count.First().count != 0)
                isExists = true;
            return isExists;

        }
        private void insertIntoActionItems(WSR_ActionItems actionitem,int SummaryID)
        {
            db.Query("WSR_ActionItems").Insert(new
            {
                ActionItemID = actionitem.ActionItemID,
                SummaryID = SummaryID,
                ActionItem = actionitem.ActionItem,
                ETA = actionitem.ETA,
                Owner = actionitem.Owner,
                Remarks = actionitem.Remarks,
                Status = "Open"
            });
        }
        private void UpdateIntoActionItems(WSR_ActionItems actionitem)
        {
            var query2 = db.Query("WSR_ActionItems").Where("SummaryID", actionitem.SummaryID).Where("ActionItemID", actionitem.ActionItemID).Update(new
            {
                ActionItem = actionitem.ActionItem,
                ETA = actionitem.ETA,
                Owner = actionitem.Owner,
                Remarks = actionitem.Remarks,
                Status = actionitem.Status,
                isActive = actionitem.isActive
            });
        }
        private void insertIntoRemarkHistory(WSR_ActionItems actionitem, int SummaryID)
        {
            db.Query("WSR_RemarkHistory").Insert(new
            {
                SummaryID = SummaryID,
                ActionItemID = actionitem.ActionItemID,
                Remark = actionitem.Remarks,
                AddedDate = DateTime.Now
            });
        }
        private bool isRemarkExists(WSR_ActionItems actionitem)
        {
            bool isRemarkExists = false;
            isRemarkExists = db.Query("WSR_RemarkHistory").Where("SummaryID", actionitem.SummaryID)
                                                  .Where("ActionItemID", actionitem.ActionItemID)
                                                  .Where("Remark", actionitem.Remarks).Exists();
            return isRemarkExists;
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
                    RiskMitigation = weeklySummaryReport.Summary.RiskMitigation,
                    WeekEndingDate = weeklySummaryReport.Summary.WeekEndingDate,
                    Name = weeklySummaryReport.Summary.Name,
                    UpdatedBy = weeklySummaryReport.Summary.UpdatedBy,
                    UpdatedOn = DateTime.Now,

                });
                foreach (WSR_ActionItems actionitem in weeklySummaryReport.ActionItems)
                {
                    //temp solutions plz assign summaryid from ui in case of updating
                    actionitem.SummaryID =  actionitem.SummaryID!=0 ? actionitem.SummaryID : SummaryID;

                    var count = db.Query("WSR_ActionItems").Where("SummaryID", actionitem.SummaryID)
                                               .Where("ActionItemID", actionitem.ActionItemID)
                                               .SelectRaw("Count(*) as count").Get();
                    if (count.First().count == 0)
                    {
                        //insert action item if not exist
                        db.Query("WSR_ActionItems").Insert(new
                        {
                            ActionItemID = actionitem.ActionItemID,
                            SummaryID = actionitem.SummaryID,         //check for summar id
                            ActionItem = actionitem.ActionItem,
                            ETA = actionitem.ETA,
                            Owner = actionitem.Owner,
                            Remarks = actionitem.Remarks,
                            Status = "Open"
                        });
                        //adding in remark history
                        db.Query("WSR_RemarkHistory").Insert(new
                        {
                            SummaryID = SummaryID,
                            ActionItemID = actionitem.ActionItemID,
                            Remarks = actionitem.Remarks,
                            AddedDate = DateTime.Now
                        });
                    }
                    else
                    {
                        //update action item
                        var query2 = db.Query("WSR_ActionItems").Where("SummaryID", actionitem.SummaryID).Where("ActionItemID", actionitem.ActionItemID).Update(new
                        {
                            ActionItem = actionitem.ActionItem,
                            ETA = actionitem.ETA,
                            Owner = actionitem.Owner,
                            Remarks = actionitem.Remarks,
                            Status = actionitem.Status,
                            isActive = actionitem.isActive
                        });

                        var RemarkExist = db.Query("WSR_RemarkHistory").Where("SummaryID", actionitem.SummaryID)
                                               .Where("ActionItemID", actionitem.ActionItemID)
                                               .Where("Remark", actionitem.Remarks).Exists();
                        //.SelectRaw("Count(*) as count").Get();
                        if (!RemarkExist)
                        {
                            //adding in remark history
                            db.Query("WSR_RemarkHistory").Insert(new
                            {
                                SummaryID = SummaryID,
                                ActionItemID = actionitem.ActionItemID,
                                Remark = actionitem.Remarks,
                                AddedDate = DateTime.Now
                            });
                        }
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
