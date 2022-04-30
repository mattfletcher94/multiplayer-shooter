import { shallowMount, createLocalVue } from '@vue/test-utils'
import FullscreenLoader from '@/components/FullscreenLoader.vue'
import BootstrapVue from 'bootstrap-vue'

const createComponent = (props = {}) => {
    const localVue = createLocalVue()
    localVue.use(BootstrapVue);
    return shallowMount(FullscreenLoader, {
        localVue: localVue,
        propsData: {
            ...props
        }
    });
}


describe('FullscreenLoader.vue', () => {

    it('Do not render inner content when show prop is false.', () => {
        const props = { width: 500, height: 600, show: false, message: "Loading" }
        const component = createComponent(props);
        expect(component.find('.full-screen-loader-inner').exists()).toBe(false);
    });
    
    it('Do not allow pointer events when show prop is false.', () => {
        const props = { width: 500, height: 600, show: false, message: "Loading" }
        const component = createComponent(props);
        expect(component.attributes().style).toMatch(`pointer-events: none`);
    });

    
    it('Render inner content when show prop is true.', () => {
        const props = { width: 500, height: 600, show: true, message: "Loading" }
        const component = createComponent(props);
        expect(component.find('.full-screen-loader-inner').exists()).toBe(true);
    });
    
    it('Allow pointer events when show prop is true.', () => {
        const props = { width: 500, height: 600, show: true, message: "Loading" }
        const component = createComponent(props);
        expect(component.attributes().style).toMatch(`pointer-events: initial`);
    });
    
    it('Display loading message correctly.', () => {
        const props = { width: 500, height: 600, show: true, message: "Loading" }
        const component = createComponent(props);
        expect(component.find('.full-screen-loader-message').text()).toMatch(props.message);
    });

    it('Width and Height styles are set correctly.', () => {
        const props = { width: 500, height: 600, show: true, message: "Loading" }
        const component = createComponent(props);
        expect(component.find('.full-screen-loader-inner').attributes().style).toMatch(`width: ${props.width}px; height: ${props.height}px;`);
    });

});
