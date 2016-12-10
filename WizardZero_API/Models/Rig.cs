using System.Collections.Generic;

namespace WizardZero_API.Models
{
    public class Rig
    {
        public Uses Use;
        public int Price;
        public List<string> Tags;
        public string Url;

        public enum Uses
        {
            Basic,
            Gaming,
            Workstation
        }

        public Rig(Uses use, int price, List<string> tags, string url)
        {
            Use = use;
            Price = price;
            Tags = tags;
            Url = url;
        }

        public Rig()
        {
            
        }
    }
}