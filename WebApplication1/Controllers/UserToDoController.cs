using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ToDoApp.Models;
using ToDoApp.ViewModels;


namespace ToDoApp.Controllers
{
    [Authorize]
    public class UserToDoController : Controller
    {
        // GET: UserToDo
        public ActionResult Index()
        {
            return View();
        }

        #region ToDo List 
        /// <summary>
        /// Add new ToDo in List
        /// </summary>
        /// <param name="vm"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult AddToDoInList(ToDoListVm vm)
        {
            try
            {
                var userId = User.Identity.GetUserId();
                using (Entities et = new Entities())
                {
                    //Getting max id from table
                    var autoId = et.tbl_todo_list.DefaultIfEmpty()
                        .Max(x => x == null ? 0 : x.Id);
                    var Id = autoId + 1;
                    tbl_todo_list td = new tbl_todo_list();
                    td.Id = Id;
                    td.order = vm.order;
                    td.title = vm.title;
                    td.priority = vm.priority;
                    td.date = vm.date;
                    td.created_date = System.DateTime.Now;
                    td.created_by = userId;
                    et.tbl_todo_list.Add(td);
                    et.SaveChanges();
                }
                return Json(new { key = true, message = "Success", }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { key = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Get ToDo List Against Current User
        /// </summary>
        /// <returns></returns>
        public ActionResult GetUserToDoList()
        {
            try
            {
                var userId = User.Identity.GetUserId();
                using (Entities et = new Entities())
                {
                    var data = (from tdl in et.tbl_todo_list
                                where tdl.created_by == userId
                                select new ToDoListVm
                                {
                                    Id = tdl.Id,
                                    order = tdl.order,
                                    title = tdl.title,
                                    priority = tdl.priority,
                                    date = tdl.date
                                }).OrderBy(x => x.order).ToList()
                                .Select(x=> new ToDoListVm {
                                    Id = x.Id,
                                    order = x.order,
                                    title = x.title,
                                    priority = x.priority,
                                    TodoDate = (x.date.HasValue) ? x.date.Value.ToString("yyyy-MM-dd") : null
                                });
                    return Json(new { key = true, message = "Success", data }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { key = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Stop current execution
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UpdateToDoListOrder(List<int> id)
        {
            try
            {
                using (Entities et = new Entities())
                {
                    int order = 1;
                    foreach (var item in id)
                    {
                        var data = et.tbl_todo_list.FirstOrDefault(c => c.Id == item);
                        if (data != null)
                        {
                            data.order = order++;
                            //et.tbl_todo_list.Add(data);
                            et.SaveChanges();
                        }
                    }
                }
                return Json(new { key = true, message = "Success", }, JsonRequestBehavior.AllowGet);
            }

            catch (Exception ex)
            {
                return Json(new { key = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Stop current execution
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult DeleteToDoFromList(int id)
        {
            try
            {
                using (Entities et = new Entities())
                {
                    var data = et.tbl_todo_list.FirstOrDefault(c => c.Id == id);
                    if (data != null)
                    {
                        et.tbl_todo_list.Remove(data);
                        et.SaveChanges();
                    }
                }

                return Json(new { key = true, message = "Success", }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { key = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        #endregion ToDo List
    }
}