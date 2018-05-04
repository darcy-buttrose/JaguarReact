using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Membership
{
    public class Program {
        public static void Main(string[] args)
        {
            Console.Title = "Membership";

            var host = BuildWebHost(args);

            SeedData.EnsureSeedData(host.Services);

            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddEnvironmentVariables(prefix: "Application_")
                .AddJsonFile("hosting.json", optional: true)
                .AddCommandLine(args)
                .Build();

            return WebHost.CreateDefaultBuilder(args)
                .UseUrls("http://0.0.0.0:22530")
                .UseConfiguration(config)
                .UseStartup<Startup>()
                .Build();
        }
    }
}
