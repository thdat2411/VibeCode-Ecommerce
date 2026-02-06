namespace Shared.Exceptions;

/// <summary>
/// Thrown when a resource already exists (e.g., duplicate email).
/// </summary>
public class ConflictException : ApplicationException
{
    public ConflictException(string message)
        : base(message, "CONFLICT", 409)
    {
    }

    public ConflictException(string resourceName, string field, string value)
        : base($"{resourceName} with {field} '{value}' already exists.", "CONFLICT", 409)
    {
    }
}
