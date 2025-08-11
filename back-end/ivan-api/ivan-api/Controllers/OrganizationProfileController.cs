using ivan_api.Services.OrganizationProfiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.OrganizationProfiles;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationProfileController : ControllerBase
    {
        private readonly IOrganizationProfileService _service;

        public OrganizationProfileController(IOrganizationProfileService service)
        {
            _service = service;
        }

        //[HttpPost("list")]
        //public async Task<IActionResult> List([FromBody] OrganizationProfileFilterModel filter)
        //{
        //    var result = await _service.ListOrganizationProfile(filter);
        //    return Ok(result);
        //}

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var result = await _service.GetList(pageNumber, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("get/{userId}")]
        public async Task<IActionResult> Details(int userId)
        {
            try
            {
                var result = await _service.GetOrganizationProfileById(userId);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] OrganizationProfileInputModel input)
        {
            if (input == null)
            {
                input = new OrganizationProfileInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.AddOrganizationProfile(input);

                if (!result)//if false
                {
                    return BadRequest("Failed to add organization profile");
                }

                var listDto = await _service.GetList(1, 100);

                var list = listDto.Items.ToList();

                var postAdd = await _service.GetOrganizationProfileById(list.Last().OrganizationId);

                return Ok(postAdd);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update([FromBody] OrganizationProfileUpdateModel input, int id)
        {
            if (input == null)
            {
                input = new OrganizationProfileUpdateModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.UpdateOrganizationProfile(input, id);

                var postUpate = await _service.GetOrganizationProfileById(id);

                if (!result)//if false
                {
                    return BadRequest(postUpate);
                }

                return Ok(postUpate);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET api/OrganizationProfile/{userId}/completion
        /// Get organization profile completion percentage and missing fields
        /// </summary>
        [HttpGet("{userId}/completion")]
        public async Task<ActionResult<ProfileCompletionDto>> GetProfileCompletion(int userId)
        {
            try
            {
                var profile = await _service.GetOrganizationProfileById(userId);
                if (profile == null)
                    return NotFound(new { message = $"Organization profile for UserId={userId} not found." });

                var completion = CalculateOrganizationProfileCompletion(profile);
                return Ok(completion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error calculating profile completion", error = ex.Message });
            }
        }

        private ProfileCompletionDto CalculateOrganizationProfileCompletion(OrganizationProfileViewModel profile)
        {
            var totalFields = 12; // Total important fields
            var completedFields = 0;
            var missingFields = new List<string>();

            // Check required fields
            if (!string.IsNullOrEmpty(profile.OrganizationName)) completedFields++; else missingFields.Add("Organization Name");
            if (!string.IsNullOrEmpty(profile.ShortName)) completedFields++; else missingFields.Add("Short Name");
            if (profile.TypeId > 0) completedFields++; else missingFields.Add("Organization Type");
            if (!string.IsNullOrEmpty(profile.Description)) completedFields++; else missingFields.Add("Description");
            if (!string.IsNullOrEmpty(profile.Mission)) completedFields++; else missingFields.Add("Mission");
            if (!string.IsNullOrEmpty(profile.Vision)) completedFields++; else missingFields.Add("Vision");
            if (!string.IsNullOrEmpty(profile.Address)) completedFields++; else missingFields.Add("Address");
            if (!string.IsNullOrEmpty(profile.Province)) completedFields++; else missingFields.Add("Province");
            if (!string.IsNullOrEmpty(profile.ContactPersonName)) completedFields++; else missingFields.Add("Contact Person Name");
            if (!string.IsNullOrEmpty(profile.ContactEmail)) completedFields++; else missingFields.Add("Contact Email");
            if (!string.IsNullOrEmpty(profile.ContactPhone)) completedFields++; else missingFields.Add("Contact Phone");
            if (!string.IsNullOrEmpty(profile.Website)) completedFields++; else missingFields.Add("Website");

            var completionPercentage = (int)Math.Round((double)completedFields / totalFields * 100);

            return new ProfileCompletionDto
            {
                CompletionPercentage = completionPercentage,
                MissingFields = missingFields
            };
        }

        //public async Task<int> getLastId()
        //{
        //    var temp = await _service.GetList(1, 1000);
        //    if (temp.Items == null) return -1;
        //    var lastLst = temp.Items.ToList();
        //    var last = lastLst.Last().OrganizationId;

        //    return last == null ? -1 : last;
        //}
    }
}
