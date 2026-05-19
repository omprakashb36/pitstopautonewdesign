import { defineField, defineType } from "sanity"

export const homeWorkFlow = defineType({
    name: "homeWorkFlow",
    type: "object",
    title: "Home Work Flow",
    fields: [
        defineField({
            name: "image",
            type: "customImage",
            title: "Image",
            description: 'Image size should be 800x800 pixels',
            options: { hotspot: true },
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
            name: "workFlow",
            title: "Work Flow",
            type: "array",
            of: [
                defineField({
                    name: "work",
                    type: "object",
                    title: "Work",
                    fields: [
                        defineField({
                            name: "workName",
                            type: "string",
                            title: "Work Name",
                        }),
                        defineField({
                            name: "workDesc",
                            type: 'text',
                            title: "Work Description"
                        })

                    ]
                })
            ]

        })
    ],
    preview:
    {
        select: {
            title: "heading",
            subtitle: 'workName'
        },
        prepare({ title }) {
            return {
                title: title || 'Untitled Home WorkFlow Section',
                subtitle: 'Home WorkFlow Section',
            }
        }
    }
})