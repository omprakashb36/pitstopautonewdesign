import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'richText',
  type: 'object',
  title: 'Rich Text',
  fields: [
    {
      name: 'content',
      type: 'blockContent',
      title: 'Content',
    },
    defineField({
      name: 'htmlId',
      type: 'string',
      title: 'ID Attribute',
      description: 'Unique identifier for the banner component',
    }),
  ],
  preview: {
    select: {
      title: 'content',
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title ? `${title[0].children[0].text}` : 'No content',
        subtitle: "Rich Text Section",
      };
    },
  }
});