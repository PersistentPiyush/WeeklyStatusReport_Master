using WeeklyReportAPI.Model;

namespace WeeklyReportAPI.DTO
{
    public class WeeklySummaryReport
    {
        public WSR_ActionItems ActionItem { get; set; }
        public WSR_SummaryDetails Summary { get; set; }
        public WSR_Teams Team { get; set; }

    }
}
