using Microsoft.AspNetCore.Mvc;

namespace Gastos.Shared.Result
{
    public static class ResultExtension
    {
        public static IActionResult ToResult(this CommandResult result)
        {
            return new ObjectResult(result)
            {
                StatusCode = result.StatusCode
            };
        }
        public static IActionResult ToResult<T>(this CommandResult<T> result)
        {
            return new ObjectResult(result)
            {
                StatusCode = result.StatusCode
            };
        }
    }
}
