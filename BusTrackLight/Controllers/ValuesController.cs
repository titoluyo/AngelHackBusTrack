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
        public List<BusSensor> Get()
        {
            IOwinContext octx = HttpContext.Current.GetOwinContext();
            var ctx = octx.Get<ApplicationDbContext>();
            var testlist = ctx.BusSensor.ToList();
            return testlist;
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]Prueba prueba)
        {
            IOwinContext octx = HttpContext.Current.GetOwinContext();
            var ctx = octx.Get<ApplicationDbContext>();
            var test = ctx.BusSensor.Create();
            test.DeviceId = prueba.DeviceId;
            //test.Value = prueba.Valor;
            var temp = prueba.Valor.Split(',');
            test.Value = int.Parse(temp[0]);
            test.Lat = float.Parse(temp[1]);
            test.Lon = float.Parse(temp[2]);

            test.Fecha = prueba.Fecha;
            ctx.BusSensor.Add(test);
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

    public class Prueba
    {
        public string DeviceId { get; set; }
        public string Valor { get; set; }
        public DateTime Fecha { get; set; }

    }
}
