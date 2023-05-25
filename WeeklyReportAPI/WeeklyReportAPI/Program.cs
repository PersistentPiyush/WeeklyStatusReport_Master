using WeeklyReportAPI.Model;
using WeeklyReportAPI.DAL;
using WeeklyReportAPI.BAL;


namespace WeeklyReportAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
           /* builder.Services.Configure<>(builder.Configuration.GetSection("ConnectionString"));
            builder.Services.AddScoped<IConnectionCommon, ConnectionCommon>();
            builder.Services.Configure<DevOpsConfiguration>(builder.Configuration.GetSection("ConnectionString"));*/
            builder.Services.AddControllers();
            builder.Services.AddTransient<IActionItemDAL, ActionItemDAL>();
            builder.Services.AddTransient<IActionItemBAL, ActionItemBAL>(); 



            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseCors(options =>
            {
                options.AllowAnyOrigin();
                options.AllowAnyMethod();
                options.AllowAnyHeader();
            });

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();
            app.UseRouting();
            //app.UseEndpoints(endpoints => { });
            app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

            app.MapControllers();
            app.Run();//terminal



        }
    }
}