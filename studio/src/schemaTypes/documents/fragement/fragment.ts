
import { defineType, defineField, defineArrayMember } from 'sanity'
import { i18n } from '../../../../language';

export const fragment = defineType({
  name: 'fragment',
  type: 'document',
  title: 'Fragment',
  groups: [
    { name: 'details', title: 'Basic Details' },
  ],
  fields: [
    defineField({
      name: 'type',
      type: 'string',
      title: 'Fragment Type ',
      options: {
        list: ['Header', 'Footer',],
        layout: 'dropdown'
      },
      readOnly: true,
      hidden : true,
      group: 'details'
    }),

    /* fields for header */
    defineField({
      name: 'header',
      type: 'header',
      title: 'Header',
      hidden: (({ document }) => !document?.type || document?.type == 'Footer'),
      group: 'details'
    }),
  

    /* feilds for Footer */
    defineField({
      name: 'footer',
      type: 'footer',
      title: 'Footer',
      hidden: (({ document }) => !document?.type || document?.type == 'Header' ),
      group: 'details'
    }),

    defineField({
      name: 'language',
      type: 'string',
      options : {
        list : i18n.languages.map(l => l.id),
        layout : 'dropdown',
      },
      readOnly: true,
    }),    

  ],
  preview: {
    select: {
      title: "type",
      subtitle: "language",
    },
    prepare({ title, subtitle }) {
      return {
        title: title + ' Fragment',
        subtitle: subtitle
      }
    }
  }

});
