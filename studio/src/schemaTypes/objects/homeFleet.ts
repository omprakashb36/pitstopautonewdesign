import { defineField, defineType } from "sanity";

export default defineType({
  name: 'homeFleet',
  title: 'Home Fleet',
  type: 'object',
  fields: [
    defineField({
      name: 'RightImage',
      title: 'Right Image',
      type: 'customImage',
      description: 'Image size should be 800x811 pixels',
    }),
    defineField({
      name: 'imageAlign',
      title: 'Image Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'dropdown',
        direction: 'horizontal',
      },
      initialValue: 'right',
    }),
    defineField({
      name: 'aboutFleet',
      title: 'About Fleet',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
        }),
        defineField({
          name: 'subHeading',
          title: 'Sub Heading',
          type: 'string',
        }),
        defineField({
          name: 'decription',
          title: 'Description',
          type: 'text',
        }),
        defineField({
          name: 'topLogo',
          title: 'Top Logo',
          type: 'customImage',
          description: 'Image size should be 98x105 pixels',
        }),
        defineField({
          name: 'button',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'buttonLink',
          title: 'Select Page Link',
          type: 'reference',
          to: [{ type: 'page' }]
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'aboutFleet.heading',
      media: 'RightImage',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Home Fleet',
        subtitle: 'Home Fleet Section',
        media: media,
      };
    },
  },
});
