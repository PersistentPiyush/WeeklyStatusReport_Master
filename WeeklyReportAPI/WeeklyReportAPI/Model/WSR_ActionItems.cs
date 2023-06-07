namespace WeeklyReportAPI.Model
{
    public class WSR_ActionItems
    {
        public int ActionItemID { get; set; }
        public int SummaryID { get; set; }
        public string ActionItem { get; set; }
        public string Owner { get; set; }
        public DateTime ETA { get; set; }
        public string Status { get; set; }
        public string Remarks { get; set; }
        public bool isActive { get; set; }
        public DateTime CompletionDate { get; set; }
    }
}
