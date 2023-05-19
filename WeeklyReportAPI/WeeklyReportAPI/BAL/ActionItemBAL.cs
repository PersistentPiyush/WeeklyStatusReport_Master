using SqlKata.Execution;
using WeeklyReportAPI.Model;
using WeeklyReportAPI.Repository;
using WeeklyReportAPI.DAL;
using Microsoft.AspNetCore.Mvc;
using WeeklyReportAPI.DTO;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Net;

namespace WeeklyReportAPI.BAL
{
    public interface IActionItemBAL
    {
        public Response GetWeeklySummaryReport(DateTime WeekEndingDate);
        public Response AddWeeklySummaryReport(WeeklySummaryReport weeklySummaryReport);
        public Response GetDateSummaryReport(DateTime StartDate, DateTime WeekEndingDate);
        public Response UpdateWeeklySummaryReport(int SummaryId,WeeklySummaryReport weeklySummaryReport);
    }

    public class ActionItemBAL : IActionItemBAL
    {
        IActionItemDAL _actionItemDAL;
        public ActionItemBAL(IActionItemDAL actionItemDAL)
        {
            _actionItemDAL = actionItemDAL;
        }

        public Response GetActionItembal()
        {
            Response response = new Response();
            try
            {              

                IEnumerable<WSR_ActionItems> actionItems = _actionItemDAL.GetActionItem();
                if (actionItems.Count() != 0)
                {
                    response.Data = JsonSerializer.Serialize(actionItems);
                    response.StatusCode = (int)HttpStatusCode.OK;
                    response.Message = "Data Retrieved Successfully";
                }
            }
            catch (Exception ex) {
                throw new Exception(ex.ToString());
            }
            return response;

        }
        public Response GetWeeklySummaryReport(DateTime WeekEndingDate)
        {
            Response response = new Response();
            try
            {

                dynamic actionItems = _actionItemDAL.GetSummaryReport(WeekEndingDate);
                if (actionItems!=null)
                {
                    response.Data = JsonSerializer.Serialize(actionItems);
                    response.StatusCode = (int)HttpStatusCode.OK;
                    response.Message = "Data Retrieved Successfully";
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
            return response;

        }
        public Response AddWeeklySummaryReport(WeeklySummaryReport weeklySummaryReport)
        {
            Response response = new Response();
            try
            {

                bool  datainserted = _actionItemDAL.AddWeeklySummaryReport(weeklySummaryReport);
                if (datainserted)
                {
                    response.StatusCode = (int)HttpStatusCode.Created;
                    response.Message = "Data Added Successfully";
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
            return response;
        }

        public Response GetDateSummaryReport(DateTime StartDate, DateTime WeekEndingDate)
        {
            Response response = new Response();
            try
            {



                dynamic actionItems = _actionItemDAL.GetDataSummaryReport(StartDate, WeekEndingDate);
                if (actionItems != null)
                {
                    response.Data = JsonSerializer.Serialize(actionItems);
                    response.StatusCode = (int)HttpStatusCode.OK;
                    response.Message = "Data Retrieved Successfully";
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
            return response;



        }

        public Response UpdateWeeklySummaryReport(int SummaryId, WeeklySummaryReport weeklySummaryReport)
        {
            Response response = new Response();
            try
            {

                bool datainserted = _actionItemDAL.UpdateWeeklySummaryReport(SummaryId, weeklySummaryReport);
                if (datainserted)
                {
                    response.StatusCode = (int)HttpStatusCode.Created;
                    response.Message = "Data Updated Successfully";
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.ToString());
            }
            return response;
        }
    }
}
