KISSY.add(function () {

    var Notification = window.Notification,
        webkitNotify = window.webkitNotifications

    var createRouter = function (notify) {

        return function (ev) {
            var events = notify._events

            events[ev.type].forEach(function (fn) {
                fn.call(notify, ev)
            })
        }

    }

    /**
     *
     * @param title {String}
     * @param options {Object}
     * @param options.body {String}
     * @param options.icon {String}
     * @param options.dir {String}
     * @param options.tag {String}
     * @parma options.onshow {function}
     * @parma options.onclose {function}
     * @parma options.onclick {function}
     * @parma options.onerror {function}
     * @constructor
     */
    function DesktopNotify(title, options) {
        this._title = title
        this._options = options
        this._instance = null
        this._events = {
            "show": [],
            "close": [],
            "click": [],
            "error": []
        }

        var me = this

        this._router = function (ev) {
            console.log(ev)
            me._events[ev.type].forEach(function (fn) {
                fn.call(me, ev)
            })
        }

        options.autoShow && this.show()
    }

    /**
     * 快速显示一个桌面通知
     * @param title
     * @param {options} body
     * @param {options} icon
     * @static
     */
    DesktopNotify.show = function (title, body, icon) {
        Notification && new Notification(title, {
            body: body,
            icon: icon
        }) || webkitNotify && new webkitNotify.createNotification(icon, title, body).show()
    }

    /**
     * 检查权限状态
     * @return {Number}: 0为允许，1为不允许， 2为禁止
     */
    DesktopNotify.checkPermission = function () {

    }

    /**
     * 检查是否得到授权
     * @static
     * @return {Boolean}： true表示得到授权
     */
    DesktopNotify.isPermitted = function () {
        return Notification.permission && Notification.permission === 'granted' ||
            webkitNotify.checkPermission() == 0
    }


    /**
     * 请求授权
     * @static
     * @param cb {function} 得到授权后的回调函数
     * @return this
     */
    DesktopNotify.requestPermission = function (cb) {
        (Notification || webkitNotify).requestPermission(cb)

        return this
    }


    /**
     * @static
     * 检测是否支持Notification，支持返回true
     */
    DesktopNotify.isSupport = function () {
        return 'Notification' in window || 'webkitNotifications' in window;
    }


    DesktopNotify.prototype = {

        constructor: DesktopNotify,

        /**
         * 弹出一个文本桌面通知
         * @member DesktopNofity
         * @return this
         */
        show: function () {
            var options = this._options

            if (Notification) {
                this._instance = Notification && new Notification(this._title, options)
                this._initEvents()
            } else {
                this._instance = webkitNotify.createNotification(options.icon, this._title, options.body)
                this._instance.dir = options.dir
                this._initEvents()
                this._instance.show()
            }

            return this
        },

        _initEvents: function () {
            var ins = this._instance,
                events = this._events

            for (var type in events) {
                ins.addEventListener(type, this._router, false)
            }
        },


        /**
         * 弹出一个HTML桌面通知, Notification标准不支持该功能, 最新版的chrome也移除了该功能, 慎用
         *
         * @param {String} url:html链接资源
         * @deprecated
         */
        showHTML: function (url) {

        },

        /***
         * 关闭一个桌面通知
         *
         * @param {Object} cb： 隐藏后的回调函数
         * @return this
         */
        close: function (cb) {
            this._instance && this._instance.close()
        },


        /**
         * 添加事件监听函数
         * @param {Object} type: 事件类型
         * @param {Object} fn: 监听函数
         */
        on: function (type, fn) {
            if (!this._events[type]) {
                throw new Error("Unsupported events:" + type)
            }

            this._events[type].push(fn)

            return this

        },

        /**
         * 移除事件监听函数
         * @param {Object} type: 事件类型
         * @param {Object} fn: 监听函数
         */
        off: function (type, fn) {
            if (!this._events[type]) {
                throw new Error("Unsupported events:" + type)
            }

            var events = this._events[type],
                index

            if (!fn) {
                this._events[type] = []

            } else {
                index = events.indexOf(fn)
                index > -1 && events.splice(index, 1)
            }

            return this
        }
    }

    return DesktopNotify

})
