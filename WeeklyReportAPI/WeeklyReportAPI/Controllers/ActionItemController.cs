using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using WeeklyReportAPI.BAL;
using WeeklyReportAPI.Model;
using WeeklyReportAPI.DTO;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WeeklyReportAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActionItemController : ControllerBase
    {
        IActionItemBAL _actionItemBAL;
        public ActionItemController(IActionItemBAL actionItemBAL) {
            _actionItemBAL = actionItemBAL;
        }
        
       
        /*[HttpGet]
        [Route("/GetActionItems")]
        public Response Get()
        {
            return _actionItemBAL.GetActionItembal();
        }*/

        [HttpGet]
        [Route("/GetWeeklySummaryReport")]
        public Response GetWeeklySummaryReport(DateTime WeekEndingDate)
        {
            return _actionItemBAL.GetWeeklySummaryReport(WeekEndingDate);
        }
        
        // POST api/<ActionItemController>
        [HttpPost]
        [Route("/AddWeeklySummaryReport")]
        public Response Post([FromBody] WeeklySummaryReport weeklySummaryReport)
        {
            return _actionItemBAL.AddWeeklySummaryReport(weeklySummaryReport);
        }
        
        // PUT api/<ActionItemController>/5
        [HttpPut]
        [Route("/UpdateWeeklySummaryReport")]
        public Response Put(int SummaryID, [FromBody] WeeklySummaryReport weeklySummaryReport)
        {
            return _actionItemBAL.UpdateWeeklySummaryReport(SummaryID, weeklySummaryReport);
        }        
    }
}
