using System.Net;
using System.Text.Json.Serialization;

namespace Gastos.Shared.Result
{
    public class CommandResult<T>
    {
        public CommandResult(T data, HttpStatusCode statusCode, string message)
        {
            Data = data;
            StatusCode = (int)statusCode;
            Message = message;
        }

        public T Data { get; private set; }
        public int StatusCode { get; private set; }
        public string Message { get; private set; }
        [JsonIgnore]
        public bool IsSuccess => StatusCode >= 200 && StatusCode < 300;
    }
    public class CommandResult
    {
        public CommandResult(HttpStatusCode statusCode, string message)
        {
            StatusCode = (int)statusCode;
            Message = message;
        }

        public int StatusCode { get; private set; }
        public string Message { get; private set; }
        [JsonIgnore]
        public bool IsSuccess => StatusCode >= 200 && StatusCode < 300;
    }
}
