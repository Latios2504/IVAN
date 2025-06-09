using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ivan_api.Extensions;

public static class ModelStateExtensions
{
    public static List<string> GetErrorMessages(this ModelStateDictionary modelState)
    {
        return modelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)
            .Where(message => !string.IsNullOrEmpty(message))
            .ToList();
    }

    public static bool HasErrors(this ModelStateDictionary modelState)
    {
        return !modelState.IsValid;
    }
}
