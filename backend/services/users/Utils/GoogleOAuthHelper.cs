using System.Net.Http.Json;
using Users.Models;

namespace Users.Utils;

/// <summary>
/// Google OAuth helper for token validation and user info retrieval
/// </summary>
public class GoogleOAuthHelper
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GoogleOAuthHelper(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    /// <summary>
    /// Validates Google ID token and retrieves user info
    /// </summary>
    public async Task<GoogleUserInfo?> ValidateTokenAndGetUserInfo(string idToken)
    {
        try
        {
            var response = await _httpClient.GetAsync(
                $"https://www.googleapis.com/oauth2/v1/tokeninfo?id_token={idToken}"
            );

            if (!response.IsSuccessStatusCode)
                return null;

            var userInfo = await response.Content.ReadFromJsonAsync<GoogleUserInfo>();
            return userInfo;
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Gets user info from Google using access token
    /// </summary>
    public async Task<GoogleUserProfile?> GetUserProfile(string accessToken)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v1/userinfo");
            request.Headers.Add("Authorization", $"Bearer {accessToken}");

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                return null;

            var profile = await response.Content.ReadFromJsonAsync<GoogleUserProfile>();
            return profile;
        }
        catch
        {
            return null;
        }
    }
}

/// <summary>
/// Google token info response
/// </summary>
public record GoogleUserInfo(
    string Email,
    string? Name,
    string? Picture
);

/// <summary>
/// Google user profile from userinfo endpoint
/// </summary>
public record GoogleUserProfile(
    string Id,
    string Email,
    string? Name,
    string? Picture
);
