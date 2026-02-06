using Users.Models;
using Users.Repositories;
using Shared.Exceptions;

namespace Users.Services;

/// <summary>
/// Business logic service for address operations
/// </summary>
public class AddressService
{
    private readonly IUserRepository _userRepository;

    public AddressService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<AddressData>> GetAddressesAsync(string userId)
    {
        ValidateUserId(userId);
        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
            throw new NotFoundException("User", userId);

        return user.Addresses ?? new List<AddressData>();
    }

    public async Task<AddressData> AddAddressAsync(string userId, AddressData address)
    {
        ValidateUserId(userId);
        ValidateAddress(address);

        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
            throw new NotFoundException("User", userId);

        var newAddress = new AddressData
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = address.FirstName,
            LastName = address.LastName,
            Company = address.Company,
            Street = address.Street,
            Ward = address.Ward,
            District = address.District,
            City = address.City,
            Country = address.Country,
            PostalCode = address.PostalCode,
            Phone = address.Phone,
            IsDefault = address.IsDefault || (user.Addresses?.Count == 0)
        };

        // If this is default, unset others
        if (newAddress.IsDefault && user.Addresses != null)
        {
            user.Addresses.ForEach(a => a.IsDefault = false);
        }

        user.Addresses.Add(newAddress);
        await _userRepository.UpdateAsync(userId, user);

        return newAddress;
    }

    public async Task<AddressData> UpdateAddressAsync(string userId, string addressId, AddressData address)
    {
        ValidateUserId(userId);
        ValidateAddress(address);

        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
            throw new NotFoundException("User", userId);

        var addressIndex = user.Addresses?.FindIndex(a => a.Id == addressId);
        if (addressIndex is null or < 0)
            throw new NotFoundException("Address", addressId);

        user.Addresses![addressIndex.Value] = new AddressData
        {
            Id = addressId,
            FirstName = address.FirstName,
            LastName = address.LastName,
            Company = address.Company,
            Street = address.Street,
            Ward = address.Ward,
            District = address.District,
            City = address.City,
            Country = address.Country,
            PostalCode = address.PostalCode,
            Phone = address.Phone,
            IsDefault = address.IsDefault
        };

        // If set as default, unset others
        if (address.IsDefault)
        {
            foreach (var addr in user.Addresses.Where((a, i) => i != addressIndex.Value))
            {
                addr.IsDefault = false;
            }
        }

        await _userRepository.UpdateAsync(userId, user);
        return user.Addresses[addressIndex.Value];
    }

    public async Task<bool> DeleteAddressAsync(string userId, string addressId)
    {
        ValidateUserId(userId);

        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
            throw new NotFoundException("User", userId);

        var address = user.Addresses?.FirstOrDefault(a => a.Id == addressId);
        if (address is null)
            throw new NotFoundException("Address", addressId);

        user.Addresses!.Remove(address);
        await _userRepository.UpdateAsync(userId, user);

        return true;
    }

    public async Task<AddressData> SetDefaultAddressAsync(string userId, string addressId)
    {
        ValidateUserId(userId);

        var user = await _userRepository.GetByIdAsync(userId);
        if (user is null)
            throw new NotFoundException("User", userId);

        var addressToSet = user.Addresses?.FirstOrDefault(a => a.Id == addressId);
        if (addressToSet is null)
            throw new NotFoundException("Address", addressId);

        // Unset all as default
        user.Addresses!.ForEach(a => a.IsDefault = false);

        // Set the specified one as default
        addressToSet.IsDefault = true;

        await _userRepository.UpdateAsync(userId, user);
        return addressToSet;
    }

    private void ValidateUserId(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new UnauthorizedException("User ID is required.");
    }

    private void ValidateAddress(AddressData address)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(address.FirstName))
            errors["FirstName"] = new[] { "First name is required." };

        if (string.IsNullOrWhiteSpace(address.LastName))
            errors["LastName"] = new[] { "Last name is required." };

        if (string.IsNullOrWhiteSpace(address.Street))
            errors["Street"] = new[] { "Street is required." };

        if (string.IsNullOrWhiteSpace(address.City))
            errors["City"] = new[] { "City is required." };

        if (string.IsNullOrWhiteSpace(address.PostalCode))
            errors["PostalCode"] = new[] { "Postal code is required." };

        if (string.IsNullOrWhiteSpace(address.Phone))
            errors["Phone"] = new[] { "Phone number is required." };

        if (errors.Count > 0)
            throw new ValidationException(errors);
    }
}
