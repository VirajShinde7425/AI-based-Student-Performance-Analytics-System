using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentPerformanceAnalytics.Application.DTOs
{
    public record ReportsDashboardDto(
     PowerBiSummaryDto Performance,
     AiPredictionSummaryDto Predictions,
     IEnumerable<SubjectMarkDto> Marks
 );
}
