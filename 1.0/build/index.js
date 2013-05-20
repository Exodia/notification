/*
combined files : 

1.0/notification
1.0/index

*/
;
KISSY.add('gallery/notification/1.0/notification',function () {
    var Notification = window.Notification,
        webkitNotify = window.webkitNotifications


    /**
     * 桌面通知组件, 对W3C标准的Notication以及早期版本的webkitNotications做了封装,
     * 提供更加方便的接口, 简单的示例如下:
     *      @example
     *      function handler(ev){
     *          alert(ev.type);
     *      }
     *
     *      KISSY.use('gallery/notification/1.0/index', function (S, Notification) {
     *          document.onclick = function () {
     *               //请求权限
     *               Notification.requestPermission(function (p) {
     *                    var notify = new Notification("我是标题", {
     *                          body: "我是内容体",
     *                          //icon URL mac下的safari和chrome不支持
     *                          icon: "http://0.gravatar.com/avatar/eba2d15b16971d6ea0800c8cc1801a1c?s=70",
     *                          //文字方向, mac下safari和chrome不支持
     *                          dir: "rtl"
     *                     });
     *
     *                    notify.on('show', handler).on('close', handler).
     *                      on('error', handler).on('click', handler);
     *
     *                   //弹出通知
     *                   notify.show();
     *               })
     *          }
     *       })
     *
     * @class DesktopNotify
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
            me._events[ev.type].forEach(function (fn) {
                fn.call(me, ev)
            })
        }

        options.autoShow && this.show()
    }

    DesktopNotify.prototype = {

        /**
         * @method constructor
         * @param title {String}
         * @param options {Object}
         * @param options.body {String}
         * @param options.icon {String}
         * @param options.dir {String}
         * @param options.tag {String}
         * @param options.onshow {function}
         * @param options.onclose {function}
         * @param options.onclick {function}
         * @param options.onerror {function}
         */
        constructor: DesktopNotify,

        /**
         * 弹出一个文本桌面通知
         *
         * @method show
         * @member DesktopNotify
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
         * @member DesktopNotify
         * @param {String} url:html链接资源
         * @deprecated
         */
        showHTML: function (url) {

        },


        /***
         * 关闭一个桌面通知
         *
         * @method
         * @member DesktopNotify
         * @param {Object} cb： 隐藏后的回调函数
         * @return this
         */
        close: function (cb) {
            this._instance && this._instance.close()
        },


        /**
         * 添加事件监听函数
         *
         * @method
         * @member DesktopNotify
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
         *
         * @method
         * @member DesktopNotify
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


    /**
     * 快速显示一个桌面通知
     *
     * @property
     * @method show
     * @param title
     * @param body
     * @param icon
     * @member DesktopNotify
     * @static
     */
    DesktopNotify.show = function (title, body, icon) {
        Notification && new Notification(title, {
            body: body,
            icon: icon
        }) || webkitNotify && new webkitNotify.createNotification(icon, title, body).show()
    }


    /**
     * 检查权限状态, 0为允许, 1为不允许, 2为禁止
     * @method checkPermission
     * @member DesktopNotify
     * @return {Number}
     * @static
     */
    DesktopNotify.checkPermission = function () {

    }


    /**
     * 检查是否得到授权
     *
     * @method isPermitted
     * @static
     * @member DesktopNotify
     * @return {Boolean}： true表示得到授权
     */
    DesktopNotify.isPermitted = function () {
        return Notification.permission && Notification.permission === 'granted' ||
            webkitNotify.checkPermission() == 0
    }


    /**
     * 请求授权
     *
     * @method requestPermission
     * @static
     * @member DesktopNotify
     * @param cb {function(permission)} 得到授权后的回调函数,将传入权限字符串作为参数
     * @return this
     */
    DesktopNotify.requestPermission = function (cb) {
        (Notification || webkitNotify).requestPermission(cb)

        return this
    }


    /**
     * 检测是否支持Notification，支持返回true
     *
     * @method isSupport
     * @static
     * @member DesktopNotify
     */
    DesktopNotify.isSupport = function () {
        return 'Notification' in window || 'webkitNotifications' in window;
    }

    return DesktopNotify

})

/**
 * @fileoverview 桌面通知组件
 * @author 踏风<tafeng.dxx@taobao.com>
 * @module notification
 **/
KISSY.add('1.0/index',function (S, Notification) {

    return Notification;
}, {
    requires: ['./notification']
});




