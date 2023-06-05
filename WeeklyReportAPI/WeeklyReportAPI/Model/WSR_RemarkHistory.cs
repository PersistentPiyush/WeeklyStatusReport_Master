namespace WeeklyReportAPI.Model
{
    public class WSR_RemarkHistory
    {
        public int RemarkID { get; set; }
        public int SummaryID { get; set; }
        public int ActionItemID { get; set; }
        public string Remark { get; set;}
        public DateTime AddedDate { get; set; }
    }
}
