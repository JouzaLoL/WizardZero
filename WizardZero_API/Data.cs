using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WizardZero_API.Models;
using Uses = WizardZero_API.Models.Rig.Uses;


namespace WizardZero_API
{
    public class Data
    {
        public static List<Rig> Rigs = new List<Rig>
        {
            //Basic Mid
            new Rig(Uses.Basic, 11500, new List<string>{"hdd"}, "https://www.czc.cz/1crghj7jl2i7oach5q02qg0npa/seznam"),
            //Basic Min
            new Rig(Uses.Basic, 9300, new List<string>() {string.Empty}, "https://www.czc.cz/brrv8044j0hr39n8slqc4itn25/seznam"),
        };
    }
}