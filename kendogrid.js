 function BindGridOnLoad() {
        debugger;
            var customerid = '<%= REAMS.Utility.Helpers.SessionHelper.CompanyId %>';
            debugger;
            var logoutType = $find('<%=LogoutType.ClientID %>');
            if (logoutType != null) {
                if (logoutType.get_selectedItem() != null)
                    var logoutTypeValue = logoutType.get_selectedItem().get_value();
            }
            var pageSize = 50;
            var logoutType = logoutTypeValue;
            $191('#Grid').kendoGrid({
                excel: {
                    allPages: true,
                    fileName: "UserSessions.xlsx"
                },
                columns: [
                       {
                           field: "UserName",
                           title: "User Name"

                       },
                       {
                           field: "Name",
                           title: "Name"

                       },
                       {
                           field: "LoginDateTime",
                           title: "Login Date",
                           template: "#= (LoginDateTime==null? '': kendo.toString(new Date(LoginDateTime),'MM/dd/yyyy hh:mm tt')) #"
                       },
                       {
                           field: "LogoutDateTime",
                           title: "Logout Date",
                           template: "#= (LogoutDateTime==null? '': kendo.toString(new Date(LogoutDateTime),'MM/dd/yyyy hh:mm tt')) #"

                       },
                       {
                           field: "logoutType",
                           title: "Logout Type",
                           sortable: false
                       }],

                sortable: {
                    mode: "single",

                    allowUnsort: false
                },
                noRecords: true,
                messages: {
                    noRecords: "No records found"
                },
                pageable: true,

                serverPaging: true,
                serverSorting: false,
                resizeable: true,
                batch: true,
                dataSource: {
                    type: 'json',
                    serverPaging: true,
                    serverSorting: true,
                    pageSize: pageSize,
                    pageable: true,
                    sort: { field: "LoginDateTime", dir: "desc" },
                    schema: {
                        data: function (response) {
                            var json = $191.parseJSON(response.d);
                            return json.objAno;
                        },
                        total: function (response) {
                            var json = $191.parseJSON(response.d);
                            return json.total;
                        },
                        errors: function (response) {
                            return response.error;
                        }
                    },
                    error: function (e) {

                        if (e.errorThrown == "Unauthorized") {
                            window.location.href = '../Security/Login.aspx';
                        }
                    },
                    transport: {
                        read: {
                            url: "UserSessionsList.aspx/FilterGrid",
                            type: "POST",
                            contentType: "application/json; charset=utf-8", // send paramters as json
                            dataType: "json",
                            data: function (e) {
                                var logoutType = $find('<%=LogoutType.ClientID %>');
                                if (logoutType != null) {
                                    if (logoutType.get_selectedItem() != null)
                                        var logoutTypeValue = logoutType.get_selectedItem().get_value();
                                }
                                var pageSize = 50;
                                var logoutType = logoutTypeValue;
                                var fromDate = $191('#fromDate').val();
                                var toDate = $191('#toDate').val();
                                var todaydate = new Date();
                                var dd = todaydate.getDate();
                                var mm = todaydate.getMonth() + 1;
                                var yyyy = todaydate.getFullYear();
                                if (dd < 10) {
                                    dd = '0' + dd;
                                }
                                if (mm < 10) {
                                    mm = '0' + mm;
                                }
                                today = mm + '/' + dd + '/' + yyyy;
                                if (fromDate == today) {
                                    $191('#Next').attr('src', '../App_Themes/DEnergyMetro/Images/right-arrow_disable.png');

                                } else {
                                    $191('#Next').attr('src', '../App_Themes/DEnergyMetro/Images/right-arrow.png');
                                }
                                var combo = $find("<%= UserListDropDown.ClientID %>");
                                var items = combo.get_checkedItems();
                                var selectedUsers = '';
                                for (i = 0; i < items.length  ; i++) {
                                    selectedUsers += items[i].get_value() + ',';
                                }
                                selectedUsers = selectedUsers.slice(0, -1);
                                var json = JSON.stringify(e['sort']);

                                var orderby = 0;
                                var order = 0;
                                if (json != undefined) {
                                    var temp = JSON.parse(json);
                                    orderby = temp[0].field;
                                    order = temp[0].dir;
                                }
                                return {
                                    userId: selectedUsers,
                                    fromDate: fromDate,
                                    toDate: toDate,
                                    logoutType: logoutType,
                                    customerid: customerid,
                                    pageSize: pageSize,
                                    orderby: orderby,
                                    order: order
                                };
                            }

                        },
                        parameterMap: function (data, type) {
                            if (type == "read") {
                                return kendo.stringify(data, data.pageSize);
                            }
                        }
                    }
                }, pageable: {
                    pageSize: pageSize,
                    messages: {
                       
                        display: "{2} item(s) in <span class='grid-pagecount' />" + " page(s)"
                    }
                },
                dataBound: function () {
                    
                    var gridContent = this.element.find('.k-grid-content');
                    if (this.dataSource.totalPages() === 0) {
                        this.pager.element.hide();
                    }
                    else {
                        var p = this.dataSource.totalPages();
                        setTimeout(function () { $(".grid-pagecount").html(p) }, 100);
                        this.pager.element.show();
                    }
                }
            });
        }