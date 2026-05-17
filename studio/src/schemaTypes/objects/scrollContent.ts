import { defineField, defineType } from "sanity";

export default defineType({
    name: 'scrollContent',
    title:'Scroll Content',
    type:'object',
    fields:[
        defineField({
            name: 'title',
            title: 'Title',
            type: 'array',
            of: [{ type: 'string' }]
        })
    ]
    ,
    preview: {
        select: {
            title: 'title'
        },
        prepare(selection) {
            const { title } = selection;
            return {
                title: Array.isArray(title) ? title.join(', ') : title,
                subtitle: 'Scroll Content Section',
            };
        }
    }
})