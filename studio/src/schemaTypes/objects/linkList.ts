import { defineArrayMember, defineField, defineType } from "sanity";

export const linkList = defineType({
    name: 'linkList',
    type: 'object',
    title: 'Link List',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
            description: 'A title for the list of links (optional)',
        }),
        defineField({
            type: "array",
            name: "links",
            of: [
                defineArrayMember({ type: 'linkItem', }),
            ],
        }),
    ],
    preview: {
        select: {
          title: 'title',
          linkCount: 'links.length',
        },
        prepare({ title, linkCount }) {
          return {
            title: title || 'Untitled Link List',
            subtitle: "Link List Section with " + (linkCount || 0) + " links",
          }
        },
      },
});