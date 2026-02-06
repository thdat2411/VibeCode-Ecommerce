namespace Shared.Exceptions;

/// <summary>
/// Thrown when a request fails validation.
/// </summary>
public class ValidationException : ApplicationException
{
    public Dictionary<string, string[]> Errors { get; set; }

    public ValidationException(string message)
        : base(message, "VALIDATION_ERROR", 400)
    {
        Errors = new Dictionary<string, string[]>();
    }

    public ValidationException(Dictionary<string, string[]> errors)
        : base("One or more validation errors occurred.", "VALIDATION_ERROR", 400)
    {
        Errors = errors;
    }
}
