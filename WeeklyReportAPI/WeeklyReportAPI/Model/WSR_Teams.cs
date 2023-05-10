namespace WeeklyReportAPI.Model
{
    public class WSR_Teams
    {
        public int TeamID { get; set; }
        public int SummaryID { get; set; }
        public string Name { get; set; }
        public string TaskCompleted { get; set; }
        public string TaskInProgress { get; set; }
        public string CurrentWeekPlan { get; set; }
        public int NoOfTaskCompleted { get; set; }
        public int NoOfTaskInProgress { get; set; }
    }
}