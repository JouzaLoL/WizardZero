using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.SessionState;
using Newtonsoft.Json.Linq;
using WizardZero_API.Models;

namespace WizardZero_API.Controllers
{
    public class RigController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage Rig([FromBody]JObject body)
        {

            Config config = Newtonsoft.Json.JsonConvert.DeserializeObject<Config>(Newtonsoft.Json.JsonConvert.SerializeObject(body));
            string response = Newtonsoft.Json.JsonConvert.SerializeObject(Filter.GetRig(config));
            var rig = Filter.GetRig(config);
            return Request.CreateResponse(HttpStatusCode.OK, response);
        }
    }
}
