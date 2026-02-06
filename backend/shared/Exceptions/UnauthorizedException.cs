namespace Shared.Exceptions;

/// <summary>
/// Thrown when a request is unauthorized or authentication fails.
/// </summary>
public class UnauthorizedException : ApplicationException
{
    public UnauthorizedException(string message)
        : base(message, "UNAUTHORIZED", 401)
    {
    }

    public UnauthorizedException()
        : base("Unauthorized access.", "UNAUTHORIZED", 401)
    {
    }
}
