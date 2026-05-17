import { defineType, defineField } from "sanity";

export const homeHeroSlider = defineType({
  name: "homeHeroSlider",
  title: "Home Hero Slider",
  type: "object",
  validation: (Rule) =>
    // This is a custom validation rule that requires both 'buttonText' and 'buttonLink' to be set, or neither to be set
    Rule.custom((fields) => {
      const { buttonText, buttonLink } = fields || {}
      if ((buttonText && buttonLink) || (!buttonText && !buttonLink)) {
        return true
      }
      return 'Both Button text and Button link must be set, or both must be empty'
    }),
  fields: [
    defineField({
      name: "vimeoId",
      title: "Vimeo Id",
      type: "string",
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      title: 'Button Text',
    }),
    defineField({
      name: 'buttonLink',
      type: 'string',
      title: 'Button Url'
    }),
    defineField({
      name: "heading",
      type: "string",
      title: "Heading"
    }),
    defineField({
      name: "subHeading",
      type: "string",
      title: "Sub Heading"
    }),
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: [
        defineField({
          name: "slide",
          type: "object",
          title: "Slide",

          fields: [
            defineField({
              name: 'desktopImage',
              type: 'customImage',
              title: 'Desktop Image for Dark Theme',
              description: 'Image size should be 1920x1000 pixels',
              options: { hotspot: true },
            }),
            defineField({
              name: 'desktopImageLight',
              type: 'customImage',
              title: 'Desktop Image For Light Theme',
              description: 'Image size should be 1920x1000 pixels',
              options: { hotspot: true },
            }),
            defineField({
              name: 'mobileImage',
              type: 'customImage',
              title: 'Mobile Image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'buttonText',
              type: 'string',
              title: 'Button Text',
            }),
            defineField({
              name: 'buttonUrl',
              type: 'url',
              title: 'Button Url'
            }),
            defineField({
              name: "heading",
              type: "string",
              title: "Heading"
            }),
            defineField({
              name: "subHeading",
              type: "string",
              title: "Sub Heading"
            }),
          ]
        }),
      ]
    }),
    defineField({
      name: 'brandName',
      type: 'string',
      title: 'Brand Label',
    }),
    defineField({
      name: 'brandPlaceholder',
      type: 'string',
      title: 'Brand Placeholder',
    }),
    defineField({
      name: 'brandModelName',
      type: 'string',
      title: 'Brand Model',
    }),
    defineField({
      name: 'brandModelPlaceholder',
      type: 'string',
      title: 'Brand Model Placeholder',
    }),
    defineField({
      name: 'SearchButtonText',
      type: 'string',
      title: 'Search Button Text',
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subTitle: 'subHeading',
    },
    prepare({ title }) {
      return {
        title: title || 'Untitled Hero slider Section',
        subtitle: 'Hero slider Section',
      }
    }
  }
})