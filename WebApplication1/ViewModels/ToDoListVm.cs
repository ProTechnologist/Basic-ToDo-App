using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ToDoApp.ViewModels
{
    public class ToDoListVm
    {
        public int Id { get; set; }
        public Nullable<int> order { get; set; }
        public string title { get; set; }
        public Nullable<System.DateTime> date { get; set; }
        public string priority { get; set; }
        public Nullable<System.DateTime> created_date { get; set; }
        public Nullable<int> created_by { get; set; }
        public string TodoDate { get; set; }
    }
}