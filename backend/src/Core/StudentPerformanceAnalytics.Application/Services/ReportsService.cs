using StudentPerformanceAnalytics.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentPerformanceAnalytics.Application.Services
{
    public class ReportsService : IReportsService
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly IMarksService _marksService;
        private readonly IPredictionService _predictionService;

        public ReportsService(
            IAnalyticsService analyticsService,
            IMarksService marksService,
            IPredictionService predictionService)
        {
            _analyticsService = analyticsService;
            _marksService = marksService;
            _predictionService = predictionService;
        }

        public async Task<ReportsDashboardDto> GetDashboardAsync()
        {
            var performance = await _analyticsService.GetPowerBiSummaryAsync();
            var predictions = await _predictionService.GetPredictionSummaryAsync();
            var marks = await _marksService.GetAllMarksAsync();

            return new ReportsDashboardDto(
                performance,
                predictions,
                marks
            );
        }
    }
}
