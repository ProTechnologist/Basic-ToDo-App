var ToDoList = function () {
    //Global variables
    var debuggingEnabled = false;
    //end Global variables

    //User ToDo List

    //Adding new ToDo in List
    var handleAddToList = function () {
        debugger;
        var todoTitle = $('#txt_todo_title').val();
        var todoPriority = $('#todo_priority_list').find('option:selected').text();
        var todoDate = $('#todo_date').val();
        var order = 1;
        if ($('#toDoList li').length > 0)
        {
            var lbl_order = $('#toDoList li:last > div').find('#lbl_order').text();
            order = parseInt(lbl_order) + 1;
        }
        var todoListVm = {
            order: order,
            title: todoTitle,
            priority: todoPriority,
            date: todoDate
        };

        $.ajax({
            url: '/UserToDo/AddToDoInList',
            type: "POST",
            data: { vm: todoListVm },
            dataType: 'Json',
            success: function (response) {
                debugger;
                if (response.key == false) {
                        alert('Error');
                }
                else {
                    handleGetUserToDoList();
                }
            },
            complete: function () {
            },
            faiure: function () {
            }
        });
        $('#txt_todo_title').val('');
        $('#todo_priority_list').val('-1');
        $('#todo_date').val('');
    };

    //Getting user ToDo List
    var handleGetUserToDoList = function () {
        $.ajax({
            url: '/UserToDo/GetUserToDoList',
            type: "Get",
            dataType: 'Json',
            success: function (response) {
                debugger;
                if (response.key == false) {
                    alert('Error');
                }
                else {
                    $('#toDoList').empty();

                    // adding headers to the dynamic table
                    $('#toDoList').append('<li>'
                     + '<div class="form-group col-md-12"> '
                      + '<div class="col-md-1"><label id="lbl_order" class="pull-left">ID</label></div> '
                         + '<div class="col-md-4"><label id="lbl_title" class="pull-left">Title</label></div> '
                         + '<div class="col-md-3"><label class="pull-right">Date</label></div> '
                           + '<div class="col-md-3"><label class="pull-right">Priority</label></div> '
                          + '<div class="col-md-1"><label class=pull-right">Actions</label></div> '
                       + '</div> '
                  + '</li>');

                    // adding data to the dynamic table
                    $.each(response.data, function (key, value) {
                        $('#toDoList').append('<li value='+value.Id+'>'
                       + '<div class="form-group col-md-12"> '
                        + '<div class="col-md-1"><label id="lbl_order" class="pull-left">' + value.order + '</label></div> '
                           + '<div class="col-md-4"><label id="lbl_title" class="pull-left">' + value.title + '</label></div> '
                           + '<div class="col-md-3"><label class="pull-right">' + value.TodoDate + '</label></div> '
                             + '<div class="col-md-3"><span class="badge pull-right">' + value.priority + '</span></div> '
                            + '<div class="col-md-1"><span onclick="ToDoList.removeFromList(this);" class="glyphicon glyphicon-remove pull-right remove_item"></span></div> '
                         + '</div> '
                    + '</li>');
                    });
                }
            },
            complete: function () {
            },
            faiure: function () {
            }
        });
    };

    //Re ordering ToDos
    var handleToDoListReorder = function () {
        $('#toDoList').sortable({
            stop: function (e, ui) {
                debugger;
                var order = 0;
                var id = new Array();
                $(this).find('li').each(function (i) {
                    $(this).find('#lbl_order').text(parseInt(order) + 1);
                    id.push($(this).attr("value"));
                    order = order + 1;
                });
                things = JSON.stringify({ ID: id});
                if (id.length > 0) {
                    $.ajax({
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        type: 'POST',
                        url: '/UserToDo/UpdateToDoListOrder',
                        traditional: true,
                        data: things,
                        success: function (response) {
                        },
                        failure: function (response) {
                        },
                        complete: function () {
                        }
                    });
                }
            }
        });
    };

    //Deleting ToDo from List
    var handleRemoveFromList = function (el) {

        if (!confirm('Are you sure you want to remove this ToDo item?')) { return false; }

        debugger;
        var id = $(el).closest('li').attr('value');
        $.ajax({
            url: '/UserToDo/DeleteToDoFromList',
            type: "POST",
            data: { id: id },
            dataType: 'Json',
            success: function (response) {
                debugger;
                if (response.key == false) {
                    alert('Error');
                }
                else {
                    handleGetUserToDoList();
                }
            },
            complete: function () {
            },
            faiure: function () {
            }
        });
    };

    var handleOnClickEvents = function () {
        $('#todo_date').datepicker().on('changeDate', function (ev) {
            $('#todo_date').datepicker('hide');
        });

        $(document).on('click', 'li', function () {
            $(this).find('#lbl_title').toggleClass('strike');//.fadeOut('slow');
        });

        $('ol').sortable();
    };

    return {
        init: function () {
            //Initialize Datepicker
            $("#todo_date").datepicker({
                dateFormat: "mm/dd/yy",
                showOtherMonths: true,
                selectOtherMonths: true,
                autoclose: true,
                changeMonth: true,
                changeYear: true,
            });
            handleToDoListReorder();
            handleGetUserToDoList();
            handleOnClickEvents();
        },
        addToList: function () {
            handleAddToList();
        },
        removeFromList: function(el){
            handleRemoveFromList(el);
        },
        success: function (data, status, xhr, modalId) {

        },
        error: function (xhr, status, error) {
        },
        log: function (msg) {
            if (debuggingEnabled == true) {
                console.log(msg);
            }
        }
    };
}();

jQuery(document).ready(function () {
    ToDoList.init();
});