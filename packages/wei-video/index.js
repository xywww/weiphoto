import component from './src/index.vue';
component.install = function(Vue) {
    Vue.component(component.name, component);
    Vue.directive("wei-video", {
        inserted: function(el, binding, vnode) {
            if (!vnode.child.viewer) {
                vnode.child.isDirective = true;
                vnode.context[binding.arg] = vnode.child.inits(binding.value);
            }
        }
    })
};
export default component;