import { de } from "date-fns/locale";
import { defineField, defineType } from "sanity";

export default defineType({
    name: 'richTextTitle',
    title: 'Rich Text Title',
    type: 'object',
    fields: [
        defineField({
            name: 'aboutsection',
            title: 'About section',
            type: 'blockContent',
        }),
    ],
    preview: {
        select: {
            blocks: 'aboutsection',
        },
        prepare({ blocks }) {
            // Get the first block's first child's text, fallback if not present
            const title =
                blocks && blocks[0] && blocks[0].children && blocks[0].children[0]
                    ? blocks[0].children[0].text
                    : 'Rich Text Title';
            return {
                title,
                subtitle: 'Rich Text Title Section',
            };
        },
    },
})
