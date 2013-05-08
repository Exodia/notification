KISSY.add(function () {

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

        if (!options) {
            return this
        }

        this.dir = options.dir
        this.onclick = options.onclick
        this.onshow = options.onshow
        this.onerror = options.onerror
        this.ondisplay = options.ondisplay
        this.tag = options.tag
    }

    /**
     * 快速显示一个桌面通知
     * @param title
     * @param body
     * @param icon
     */
    DesktopNotify.show = function (title, body, icon) {

    }

    /**
     * 检查权限状态
     * @return {Number}: 0为允许，1为不允许， 2为禁止
     */
    DesktopNotify.checkPermission = function () {

    }

    /**
     * 检查是否得到授权
     * @return {Boolean}： true表示得到授权
     */
    DesktopNotify.isPermitted = function () {
        return this.checkPermission() === 0;
    }


    /**
     * 请求授权
     * @param cb {function} 得到授权后的回调函数
     */
    DesktopNotify.requestPermission = function (cb) {

    }


    /**
     * 检测是否支持Notification，支持返回true
     */
    DesktopNotify.isSupport = function () {
        return 'Notification' in window || 'webkitNotifications' in window;
    }


    DesktopNotify.prototype = {

        constructor: DesktopNotify,

        /**
         *弹出一个文本桌面通知
         *
         */
        show: function () {
        },


        /**
         *弹出一个 HTML桌面通知
         *
         * @param {String} url:html链接资源
         */
        showHTML: function (url) {
        },

        /***
         * 关闭一个桌面通知
         *
         * @param {Object} cb： 隐藏后的回调函数
         *
         */
        close: function (cb) {
        },


        /**
         * 添加事件监听函数
         * @param {Object} type: 事件类型
         * @param {Object} fn: 监听函数
         */
        on: function (type, fn) {
            _eventTable[type] && _instance && _instance.addEventListener(type, fn, false);
        },

        /**
         * 移除事件监听函数
         * @param {Object} type: 事件类型
         * @param {Object} fn: 监听函数
         */
        off: function (type, fn) {
            _eventTable[type] && _instance && _instance.removeEventListener(type, fn, false);
        }
    };

    return DesktopNotify;

})
