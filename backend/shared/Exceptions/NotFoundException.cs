namespace Shared.Exceptions;

/// <summary>
/// Thrown when a requested resource is not found.
/// </summary>
public class NotFoundException : ApplicationException
{
    public NotFoundException(string resourceName, string identifier)
        : base($"{resourceName} with identifier '{identifier}' not found.", "NOT_FOUND", 404)
    {
    }

    public NotFoundException(string message)
        : base(message, "NOT_FOUND", 404)
    {
    }
}
