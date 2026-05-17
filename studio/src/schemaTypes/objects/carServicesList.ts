import { defineField, defineType } from "sanity";

export default defineType({
    name: 'carServicesList',
    title: 'Car Services List',
    type: 'object',
    fields: [
        defineField({
            name: 'heading',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'scheduleNow',
            title: 'Schedule Now Label',
            type: 'string',
        }),
        defineField({
            name: 'muchMore',
            title: 'Much More Label',
            type: 'string',
        }),
        defineField({
            name: 'browseAll',
            title: 'Browse All Lable',
            type: 'string',
        }),
        defineField({
            name: 'serviceCard',
            title: 'Service Card',
            type: 'array',
            of:[
                defineField({
                    name: 'cards',
                    title: 'Cards',
                    type: 'object',
                    fields:[
                        defineField({
                            name: 'title',
                            title: 'Title',
                            type: 'string'
                        }),
                        defineField({
                            name: 'scheduleNow',
                            title: 'Schedule Now',
                            type: 'string'
                        }),
                        defineField({
                            name: 'thumbnailImage',
                            title: 'Thumbnail Image',
                            type: 'customImage'
                        }),
                        defineField({
                            name: 'selectServiceLink',
                            title: 'Select Service Link',
                            type: 'reference',
                            to: [{ type: 'service' }]

                        })
                    ]
                })
            ]
        })      
    ],
    preview: {
        select: {
            title: 'heading',
        },
        prepare(selection) {
            const { title } = selection;
            return {
                title: title,
                subtitle: 'Car Services List',
            };
        },
    }
});