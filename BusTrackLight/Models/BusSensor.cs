using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusTrackLight.Models
{
    public class BusSensor
    {
        [Key]
        public int Id { get; set; }

        public string DeviceId { get; set; }

        public int Value { get; set; }

        public double? Lat { get; set; }

        public double? Lon { get; set; }


        public DateTime Fecha { get; set; }
    }
}
