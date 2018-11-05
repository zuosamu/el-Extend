export default {
    searchConfig: {
        searchShow: true,
        resetButton: true,
        flex: '1',
        form: {
            $attr: {
                size: 'small',
                labelWidth: '68px'

            },
            $listener: {}
        },
        formItem: {
            input: {
                strategy: i => i,
                $default: '',
                span: 1,
                $attr: {},
                $listener: {}
            },
            select: {
                strategy: i => i,
                span: 1,
                $default: '',
                $attr: {},
                $listener: {}
            },
            datePicker: {
                strategy: ([startDate, endDate]) => ({
                    startDate,
                    endDate
                }),
                $default: '',
                span: 1,
                $attr: {
                    type: 'datetimerange',
                    startPlaceholder: '开始时间',
                    endPlaceholder: '结束时间'
                },
                $listener: {}
            },
            cascader: {
                strategy: ([platform, roleId = null]) => ({
                    platform,
                    roleId
                }),                
                $default: [],
                span: 1,
                $attr: {
                    clearable: true
                },
                $listener: {}
            },
            datePickerCustom: {
                strategy: ([startDate, endDate]) => ({
                    startDate,
                    endDate
                }),
                $default: '',
                span: 1,
                $attr: {
                    type: 'datetimerange',
                    'start-placeholder': '开始时间',
                    'end-placeholder': '结束时间',
                    days: [],
                    defaultDay: 0
                },
                $listener: {}
            },
            methodDefault: {
                strategy: i => i,
                $default: '',
                span: 1,
                $attr: {},
                $listener: {}
            }
        }
    },
    tableConfig: {
        tableShow: true,
        table: {
            $attr: {
                border: true,
                headerAlign: 'center'
            },
            $listener: {}
        },
        column: []
    },
    pagination: {
        paginationShow: true,
        $listener: {},
        pageParams: {
            pageNo: 1,
            pageSize: 10
        },
        $attr: {
            pageSizes: [5, 10, 20],
            background: true,
            layout: 'prev, pager, next, sizes, jumper'
        }
    }
};
