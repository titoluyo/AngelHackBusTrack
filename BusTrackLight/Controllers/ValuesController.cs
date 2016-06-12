using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using BusTrackLight.Models;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;

namespace BusTrackLight.Controllers
{
    //[Authorize]
    public class ValuesController : ApiController
    {
        // GET api/values
        public IEnumerable<string> Get()
        {
            var values = new List<string>();
            IOwinContext octx = HttpContext.Current.GetOwinContext();
            var ctx = octx.Get<ApplicationDbContext>();
            var testlist = ctx.Tests.ToList();
            foreach (var value in testlist)
            {
                values.Add(value.Value);
            }
            return values.ToArray();
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
            IOwinContext octx = HttpContext.Current.GetOwinContext();
            var ctx = octx.Get<ApplicationDbContext>();
            var test = ctx.Tests.Create();
            test.Value = value;
            ctx.Tests.Add(test);
            ctx.SaveChanges();
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
