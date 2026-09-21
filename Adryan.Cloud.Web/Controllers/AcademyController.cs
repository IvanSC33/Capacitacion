using Microsoft.AspNetCore.Mvc;

namespace Adryan.Cloud.Web.Controllers
{
    public class AcademyController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}