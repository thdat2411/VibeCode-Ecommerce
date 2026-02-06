namespace Shared.Exceptions;

/// <summary>
/// Base exception for application-specific errors.
/// All custom exceptions should inherit from this.
/// </summary>
public class ApplicationException : Exception
{
    public string Code { get; set; }
    public int StatusCode { get; set; }

    public ApplicationException(string message, string code = "APPLICATION_ERROR", int statusCode = 500)
        : base(message)
    {
        Code = code;
        StatusCode = statusCode;
    }

    public ApplicationException(string message, Exception innerException, string code = "APPLICATION_ERROR", int statusCode = 500)
        : base(message, innerException)
    {
        Code = code;
        StatusCode = statusCode;
    }
}
