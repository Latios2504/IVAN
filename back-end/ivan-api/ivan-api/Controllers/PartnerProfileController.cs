using ivan_api.Services.PartnerProfiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ivan_api.DTOs.PartnerProfiles;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnerProfileController : ControllerBase
    {
        private readonly IPartnerProfileService _service;

        public PartnerProfileController(IPartnerProfileService service)
        {
            _service = service;
        }

        //[HttpPost("list")]
        //public async Task<IActionResult> List([FromBody] PartnerProfileFilterModel filter)
        //{
        //    var result = await _service.ListPartnerProfile(filter);
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
                var result = await _service.GetPartnerProfileById(userId);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] PartnerProfileInputModel input)
        {
            if (input == null)
            {
                input = new PartnerProfileInputModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.AddPartnerProfile(input);

                if (!result)//if false
                {
                    return BadRequest("Failed to add partner profile");
                }

                var listDto = await _service.GetList(1, 100);

                var list = listDto.Items.ToList();

                var postAdd = await _service.GetPartnerProfileById(list.Last().PartnerId);

                return Ok(postAdd);
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update([FromBody] PartnerProfileUpdateModel input, int id)
        {
            if (input == null)
            {
                input = new PartnerProfileUpdateModel();
                TryValidateModel(input);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _service.UpdatePartnerProfile(input, id);

                var postUpate = await _service.GetPartnerProfileById(id);

                if (!result)//if false
                {
                    return BadRequest(postUpate);
                }

                return Ok(postUpate);
            }
            catch(Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET api/PartnerProfile/{userId}/completion
        /// Get partner profile completion percentage and missing fields
        /// </summary>
        [HttpGet("{userId}/completion")]
        public async Task<ActionResult<ProfileCompletionDto>> GetProfileCompletion(int userId)
        {
            try
            {
                var profile = await _service.GetPartnerProfileById(userId);
                if (profile == null)
                    return NotFound(new { message = $"Partner profile for UserId={userId} not found." });

                var completion = CalculatePartnerProfileCompletion(profile);
                return Ok(completion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error calculating profile completion", error = ex.Message });
            }
        }

        private ProfileCompletionDto CalculatePartnerProfileCompletion(PartnerProfileViewModel profile)
        {
            var totalFields = 10; // Total important fields
            var completedFields = 0;
            var missingFields = new List<string>();

            // Check required fields
            if (!string.IsNullOrEmpty(profile.CompanyName)) completedFields++; else missingFields.Add("Company Name");
            if (profile.IndustryId > 0) completedFields++; else missingFields.Add("Industry");
            if (!string.IsNullOrEmpty(profile.Description)) completedFields++; else missingFields.Add("Description");
            if (!string.IsNullOrEmpty(profile.Address)) completedFields++; else missingFields.Add("Address");
            if (!string.IsNullOrEmpty(profile.Province)) completedFields++; else missingFields.Add("Province");
            if (!string.IsNullOrEmpty(profile.ContactPersonName)) completedFields++; else missingFields.Add("Contact Person Name");
            if (!string.IsNullOrEmpty(profile.ContactEmail)) completedFields++; else missingFields.Add("Contact Email");
            if (!string.IsNullOrEmpty(profile.ContactPhone)) completedFields++; else missingFields.Add("Contact Phone");
            if (!string.IsNullOrEmpty(profile.Website)) completedFields++; else missingFields.Add("Website");
            if (!string.IsNullOrEmpty(profile.TaxCode)) completedFields++; else missingFields.Add("Tax Code");

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
        //    var last = lastLst.Last().PartnerId;

        //    return last == null ? -1 : last;
        //}
    }
}
