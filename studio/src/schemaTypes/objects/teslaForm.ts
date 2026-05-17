import { defineField, defineType } from "sanity";

export const teslaForm = defineType({
    name: 'teslaForm',
    title: 'Form',
    type: 'object',
    fields: [
        defineField({
            name: 'whiteHeading',
            type: 'string',
            title: 'White Heading',
        }),
        defineField({
            name: 'redHeading',
            type: 'string',
            title: 'Red Heading',
        }),
        defineField({
            name: 'teslaImage',
            title: 'Popup Image',
            type: 'customImage'
        }),
        defineField({
            name: 'teslaLogo',
            title: 'Popup bottom right Logo',
            type: 'customImage'
        }),
        defineField({
            name: 'stepOne',
            title: 'Step One',
            type: 'object',
            fields: [
                defineField({
                    name: 'countryLabel',
                    title: 'Country Label',
                    type: 'string',
                }),
                defineField({
                    name: 'phoneLabel',
                    title: 'Phone Label',
                    type: 'string'
                }),
                defineField({
                    name: 'phonePlaceholder',
                    title: 'Phone Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'modelLabel',
                    title: 'Model Label',
                    type: 'string'
                }),
                defineField({
                    name: 'modelPlaceholder',
                    title: 'Model Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'yearLabel',
                    title: 'Year Label',
                    type: 'string',
                }),
                defineField({
                    name: 'yearPlaceholder',
                    title: 'Year Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'years',
                    type: 'array',
                    title: 'Years',
                    of: [
                        defineField({
                            name: 'year',
                            type: 'string',
                            title: 'Year'
                        })
                    ]
                }),
                defineField({
                    name: 'plateNumberLabel',
                    title: 'Plate Number Label',
                    type: 'string'
                }),
                defineField({
                    name: 'plateNumberPlaceholder',
                    title: 'Plate Number Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'proceed',
                    title: 'Proceed Label',
                    type: 'string'
                })
            ]
        }),
        defineField({
            name: 'stepTwo',
            title: 'Step Two',
            type: 'object',
            fields: [
                defineField({
                    name: 'workshopLabel',
                    title: 'Workshop Label',
                    type: 'string'
                }),
                defineField({
                    name: 'workshopPlaceholder',
                    title: 'Workshop Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'selectAndProceed',
                    title: 'Select And Proceed Label',
                    type: 'string'
                })
            ]
        }),
        defineField({
            name: 'stepThree',
            title: 'Step Three',
            type: 'object',
            fields: [
                defineField({
                    name: 'fullNameLabel',
                    title: 'Full Name Label',
                    type: 'string',
                }),
                defineField({
                    name: 'fullNamePlaceholder',
                    title: 'Full Name Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'emailLabel',
                    title: 'Email Label',
                    type: 'string',
                }),
                defineField({
                    name: 'emailPlaceholder',
                    title: 'Email Placeholder',
                    type: 'string'
                }),
                defineField({
                    name: 'declaration',
                    title: 'Declaration',
                    type: 'string'
                }),
                defineField({
                    name: 'scheduleAppointment',
                    title: 'Schedule Appointment Label',
                    type: 'string'
                })
            ]
        })
    ],
    preview: {

        select: {
            title: 'heading',
        },
        prepare() {
            return {
                title: "Book Appointment",
                subtitle: 'Form'
            }
        }
    }

})
