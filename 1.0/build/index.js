/*
combined files : 

gallery/notification/1.0/notification
gallery/notification/1.0/index

*/
;
KISSY.add('gallery/notification/1.0/notification',function () {
    var Notification = window.Notification,
        webkitNotify = window.webkitNotifications


    /**
     * 桌面通知组件, 对W3C标准的Notication以及早期版本的webkitNotications做了封装,
     * 支持的浏览器: chrome,  FireFox Aurora, FireFox Nightly, Safari 6
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
         * @param title {String} 通知对话框标题
         * @param options {Object} 其他配置项
         * @param options.body {String} 对话框内容体
         * @param options.icon {String} 对话框icon, Mac下chrome和safari不支持
         * @param options.dir {String}  对话框内容文字方向, 可取"ltr", "rtl"; Mac下chrome和safari不支持
         * @param options.tag {String}  对话框标签, 会替代当前具有同样标签的对话框
         * @param options.onshow {function} 回调函数, 当对话框展示时触发,
         * FF和webkit的触发时机有差异, FF在对话框显示前触发, 而webkit则在显示后触发
         *
         * @param options.onclose {function} 回调函数, 当对话框关闭时触发
         * @param options.onclick {function} 回调函数, 当点击对话框触发
         * @param options.onerror {function} 回调函数, 当调用出现错误时触发,比如拒绝授权
         */
        constructor: DesktopNotify,

        /**
         * 弹出桌面通知
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

        /***
         * 关闭一个桌面通知, 当对话框已经被关闭时, 对应的close事件不会触发
         *
         * @method
         * @member DesktopNotify
         * @return this
         */
        close: function () {
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
         * 移除事件监听函数, 未传入fn,则移除指定事件的所有监听函数
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
     * @param title 通知标题
     * @param body 通知内容体
     * @param icon 对话框url
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
KISSY.add('gallery/notification/1.0/index',function (S, Notification) {

    return Notification;
}, {
    requires: ['./notification']
});




