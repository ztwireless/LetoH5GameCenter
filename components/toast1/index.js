import ToastComponent from './Toast.vue';
import Vue from 'vue';

let instance;
let instances = [];
let seed = 1;

const ToastConstructor = Vue.extend(ToastComponent);

const Toast = function(options) {
    // ssr
    if (Vue.prototype.$isServer) {
        return;
    }

    if (typeof options == 'string') {
        options = {
            text: options
        }
    }

    let userOnClose = options.onClose;
    let id = `toast-${seed++}`;

    options.onClose = function() {
        Toast.close(id, userOnClose);
    }

    instance = new ToastConstructor({
        data: options
    });

    instance.id = id;
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
    instance.dom = instance.vm.$el;

    instances.push(instance);
    return instance.vm;
}


Toast.close = function(id, userOnClose) {
    for (let i = 0, len = instances.length; i < len; i++) {
        if (id === instances[i].id) {
            if (typeof userOnClose === 'function') {
                userOnClose(instances[i]);
            }
            instances.splice(i, 1);
            break;
        }
    }
}


export default Toast;
