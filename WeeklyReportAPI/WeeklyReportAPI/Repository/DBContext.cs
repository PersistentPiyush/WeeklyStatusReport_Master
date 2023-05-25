using SqlKata.Compilers;
using SqlKata.Execution;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace WeeklyReportAPI.Repository
{

    public class DBContext
    {
        /*private readonly IConfiguration _configuration;
        public DBContext(IConfiguration configuration) {
            _configuration = configuration;

        }
        // public IConfiguration Configuration { get; set; }
        // string DBConnectionstring_=ConfigurationManager.["config:ConnectionString"];
        string str = "";
        str = _configuration.GetValue<string>("Config:ConnectionString"); //.GetSection("ConnectionString");
       
        
        static SqlConnection connection = new SqlConnection(DBConnectionstring);*/

        static SqlConnection connection = new SqlConnection("Data Source=PSL-7Q47XM3\\SQLEXPRESS01;" +
            "Initial Catalog=wsr;Integrated Security=True");
        static SqlServerCompiler compiler = new SqlServerCompiler();
        QueryFactory db = new QueryFactory(connection, compiler);
        public QueryFactory GetQueryFactory() { return db; }


    }
}
