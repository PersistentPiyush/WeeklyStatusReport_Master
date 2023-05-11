using WeeklyReportAPI.Model;

namespace WeeklyReportAPI.DTO
{
    public class WeeklySummaryReport
    {
        public WSR_SummaryDetails Summary { get; set; }
        public List<WSR_ActionItems> ActionItems { get; set; }        
        public List<WSR_Teams> Teams { get; set; }
    }
}
