namespace WebAPI.Helpers.Core
{
    public class CheckError
    {
        public bool IsError { get; set; }
        public string Code { get; set; }
        public Exception Exception { get; set; }
        public string Message { get; set; }
    }
}
