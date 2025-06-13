using ivan_api.DTOs.EventManage;
using ivan_api.Services.EventServ;
﻿using ivan_api.DTOs;
using ivan_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ivan_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _service;
        public EventsController(IEventService service) => _service = service;

        // GET: api/events
        [HttpGet, AllowAnonymous]
        public async Task<IActionResult> GetAll() =>
            Ok(await _service.GetAllAsync());

        // GET: api/events/5
        [HttpGet("{id}"), AllowAnonymous]
        public async Task<IActionResult> Get(int id)
        {
            var evt = await _service.GetByIdAsync(id);
            if (evt == null) return NotFound();
            return Ok(evt);
        }

        // POST: api/events
        // Chỉ Organization được thêm sự kiện
        [HttpPost]
        //[Authorize(Roles = "Organization")]
        public async Task<IActionResult> Create([FromBody] CreateEventDto dto)
        {
            var newId = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = newId }, null);
        }

        // PUT: api/events/5
        // Chỉ Organization được cập nhật
        [HttpPut("{id}")]
        //[Authorize(Roles = "Organization")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEventDto dto)
        {
            if (!await _service.UpdateAsync(id, dto))
                return NotFound();
            return NoContent();
        private readonly IEventService _eventService;
        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }
        [HttpGet("{eventId}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponseDTO<EventDTO>>> GetEvent(int eventId)
        {
            var result = await _eventService.GetEventAsync(eventId);
            if (!result.Success)
            {
                return result.Errors.Any(e => e.Contains("not found")) ? NotFound(result) : StatusCode(500, result);
            }
            return Ok(result);
        }
    }
}
