namespace WeeklyReportAPI.Model
{
    public class WSR_SummaryDetails
    {
        public int SummaryID { get; set; }
        public string Overall { get; set; }
        public char OverallStatus { get; set; }
        public char ScheduleStatus { get; set; }
        public char ResourceStatus { get; set; }
        public string Risk { get; set; }
        public char RiskStatus { get; set; }
        public DateTime WeekEndingDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string Name { get; set; }
    }
}
