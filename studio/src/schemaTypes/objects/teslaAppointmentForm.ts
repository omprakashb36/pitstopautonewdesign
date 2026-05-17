import { de } from 'date-fns/locale'
import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'teslaAppointmentForm',
    title: 'Tesla Appointment Form',
    type: 'object',
    options: { collapsible: false },
    fields: [
        defineField({
            name: 'contactInfo',
            type: 'object',
            options: {  columns: 1 },
            fields: [
                defineField({
                    name: 'country',
                    title: 'Country',
                    type: 'object',
                    options: { collapsible: false , columns: 2 },
                    fields:[
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                        }),
                        defineField({
                            name: 'placeholder',
                            title: 'Placeholder',
                            type: 'string',
                        }),
                    ]
                }),
                defineField({
                    name: 'phoneNumber',
                    title: 'Phone Number',
                    type: 'object',
                    options: { collapsible: false, columns: 2 },
                    fields:[
                        defineField({
                            name: 'label',
                            title: 'Label',
                            type: 'string',
                        }),
                        defineField({
                            name: 'placeholder',
                            title: 'Placeholder',
                            type: 'string',
                        }),
                    ]
                }),
            ],
        }),
        defineField({
            name: 'model',
            type: 'object',
            options: { collapsible: false, columns: 2 },
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'string',
                }),
                defineField({
                    name: 'placeholder',
                    title: 'Placeholder',
                    type: 'string',
                }),
            ],
        }),
        defineField({
            name: 'year',
            type: 'object',
            options: { collapsible: false ,columns: 1},
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'string',
                }),
                defineField({
                    name: 'placeholder',
                    title: 'Placeholder',
                    type: 'string',
                }),
                defineField({
                    name: 'years',
                    title: 'Add Years',
                    type: 'array',
                    of: [{ type: 'number'}]
                }),
            ],
        }),
        defineField({
            name: 'workshop',
            type: 'object',
            options: { collapsible: false ,columns: 1},
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'string',
                }),
                defineField({
                    name: 'placeholder',
                    title: 'Placeholder',
                    type: 'string',
                }),
            ],
        }),
         defineField({
            name: 'fullName',
            type: 'object',
            options: { collapsible: false, columns: 2 },
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'string',
                }),
                defineField({
                    name: 'placeholder',
                    title: 'Placeholder',
                    type: 'string',
                }),
            ],
        }),
         defineField({
            name: 'email',
            type: 'object',
            options: { collapsible: false, columns: 2 },
            fields: [
                defineField({
                    name: 'label',
                    title: 'Label',
                    type: 'string',
                }),
                defineField({
                    name: 'placeholder',
                    title: 'Placeholder',
                    type: 'string',
                }),
            ],
        }),
        
    ],
})