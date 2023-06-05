using WeeklyReportAPI.Model;

namespace WeeklyReportAPI.DTO
{
    public class WeeklySummaryReport
    {
        public WSR_SummaryDetails Summary { get; set; }
        public List<ActionitemList> ActionItems { get; set; }
        public List<WSR_Teams> Teams { get; set; }
        public int ActionItemMaxID { get; set; }    
    }
    public class ActionitemList : WSR_ActionItems
    { 
        public DateTime CreatedOn { get; set; } 
    }
}
