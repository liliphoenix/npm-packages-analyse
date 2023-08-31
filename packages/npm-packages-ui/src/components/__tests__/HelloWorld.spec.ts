const { describe, it, expect } =require( 'vitest')

const { mount } =require('@vue/test-utils') 
// @ts-ignore
import App from "@/App.vue"

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount( App, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
