using SqlKata.Compilers;
using SqlKata.Execution;
using System.Data.SqlClient;

namespace WeeklyReportAPI.Repository
{
    public class DBContext
    {
        static SqlConnection connection = new SqlConnection("Data Source=(localdb)\\MSSQLLOCALDB;" +
            "Initial Catalog=wsr;Integrated Security=True");
        static SqlServerCompiler compiler = new SqlServerCompiler();
        QueryFactory db = new QueryFactory(connection, compiler);
        public QueryFactory GetQueryFactory() { return db; }


    }
}
